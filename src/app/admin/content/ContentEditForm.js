'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchableSelect from '../SearchableSelect'
import RichTextEditor from '../RichTextEditor'
import style from './content-admin.module.css'

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

const YOUTUBE_PATTERNS = [
  /youtube\.com\/watch\?v=([\w-]{6,})/i,
  /youtube\.com\/embed\/([\w-]{6,})/i,
  /youtu\.be\/([\w-]{6,})/i,
  /youtube\.com\/shorts\/([\w-]{6,})/i,
]

function extractYoutubeVideoId(url) {
  if (!url) return null
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Generic create/edit form shared by Expert Talks and Events (same shape as
 * the already-shipped Media Article / Success Story admin forms, which stay
 * on their own dedicated components — this one is only for new modules).
 *
 * @param {object} props
 * @param {'create'|'edit'} props.mode
 * @param {object} [props.item] - existing record in edit mode
 * @param {{id:number,name:string}[]} props.departments
 * @param {{id:number,name:string}[]} props.doctors
 * @param {string} props.apiBasePath - e.g. '/api/admin/expert-talks'
 * @param {string} props.listPath - e.g. '/admin/expert-talks'
 * @param {string} props.entityLabel - e.g. 'Expert Talk'
 * @param {string} [props.contentLabel] - label above the rich text editor
 */
export default function ContentEditForm({ mode, item, departments, doctors, apiBasePath, listPath, entityLabel, contentLabel = 'Content' }) {
  const router = useRouter()

  const [title, setTitle] = useState(item?.title ?? '')
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(item?.publishedAt))
  const [featureType, setFeatureType] = useState(item?.featureType ?? 'image')
  const [featureImage, setFeatureImage] = useState(item?.featureImage ?? '')
  const [featureImageSourceUrl] = useState(item?.featureImageSourceUrl ?? '')
  const [featureImageUploading, setFeatureImageUploading] = useState(false)
  const [featureImageError, setFeatureImageError] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState(item?.youtubeUrl ?? '')
  const [readMoreUrl, setReadMoreUrl] = useState(item?.readMoreUrl ?? '')
  const [departmentIds, setDepartmentIds] = useState(item?.departments?.map((d) => d.departmentId) ?? [])
  const [doctorIds, setDoctorIds] = useState(item?.doctors?.map((d) => d.id) ?? [])
  const [content, setContent] = useState(item?.content ?? '')
  const [gallery, setGallery] = useState(item?.gallery ?? [])
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryError, setGalleryError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const youtubeVideoId = extractYoutubeVideoId(youtubeUrl)

  const handleTitleChange = (value) => {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSlugChange = (value) => {
    setSlugTouched(true)
    setSlug(value)
  }

  const handleFeatureImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFeatureImageUploading(true)
    setFeatureImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${apiBasePath}/upload-feature-image`, { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setFeatureImageError(data.error || 'Could not upload image.')
        return
      }

      setFeatureImage(data.url)
    } catch {
      setFeatureImageError('Could not upload image.')
    } finally {
      setFeatureImageUploading(false)
      event.target.value = ''
    }
  }

  const handleGalleryChange = async (event) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    setGalleryUploading(true)
    setGalleryError('')

    try {
      const formData = new FormData()
      files.forEach((file) => formData.append('files', file))
      const res = await fetch(`${apiBasePath}/upload-gallery-images`, { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setGalleryError(data.error || 'Could not upload gallery images.')
        return
      }

      setGallery((prev) => [...prev, ...data.uploaded.map((uploadedItem) => ({ imagePath: uploadedItem.imagePath }))])

      if (data.failed?.length > 0) {
        setGalleryError(data.failed.map((f) => `${f.name}: ${f.error}`).join('; '))
      }
    } catch {
      setGalleryError('Could not upload gallery images.')
    } finally {
      setGalleryUploading(false)
      event.target.value = ''
    }
  }

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      title,
      slug,
      publishedAt: publishedAt || null,
      featureType,
      featureImage,
      featureImageSourceUrl,
      youtubeUrl,
      readMoreUrl,
      departmentIds,
      doctorIds,
      content,
      gallery: gallery.map((image) => ({ imagePath: image.imagePath, altText: image.altText })),
    }

    const url = mode === 'edit' ? `${apiBasePath}/${item.id}` : apiBasePath
    const method = mode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || `Could not save ${entityLabel.toLowerCase()}.`)
        return
      }

      router.push(listPath)
      router.refresh()
    } catch {
      setError(`Could not save ${entityLabel.toLowerCase()}.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Title <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            required
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Slug <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            required
          />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Publication Date</label>
          <input
            type="date"
            className={style.input}
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Read The Article URL</label>
          <input
            className={style.input}
            value={readMoreUrl}
            onChange={(event) => setReadMoreUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>Feature Media Type</label>
        <div className={style.typeToggle}>
          <button
            type="button"
            className={`${style.typeToggleButton} ${featureType === 'image' ? style.typeToggleButtonActive : ''}`}
            onClick={() => setFeatureType('image')}
          >
            Image
          </button>
          <button
            type="button"
            className={`${style.typeToggleButton} ${featureType === 'video' ? style.typeToggleButtonActive : ''}`}
            onClick={() => setFeatureType('video')}
          >
            YouTube Video
          </button>
        </div>

        {featureType === 'image' ? (
          <div className={style.imageUploadRow}>
            <span className={style.imagePreview}>
              {featureImage && <Image src={featureImage} alt="" width={160} height={90} />}
            </span>
            <div>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFeatureImageChange} />
              {featureImageUploading && <p className={style.hint}>Uploading…</p>}
              {featureImageError && (
                <p className={style.hint} style={{ color: '#c0392b' }}>
                  {featureImageError}
                </p>
              )}
              {!featureImageError && !featureImageUploading && (
                <p className={style.hint}>PNG, JPEG, or WEBP. Leave empty for no feature image.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <input
              className={style.input}
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {youtubeUrl && !youtubeVideoId && (
              <p className={style.hint} style={{ color: '#c0392b' }}>
                Could not recognize this as a YouTube URL. Use a watch, youtu.be, or embed link.
              </p>
            )}
            {youtubeVideoId && (
              <div className={style.imagePreview} style={{ width: 260, height: 146 }}>
                <iframe
                  key={youtubeVideoId}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                  title="YouTube video preview"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Departments</label>
          <SearchableSelect
            multiple
            options={departments}
            value={departmentIds}
            onChange={setDepartmentIds}
            placeholder="Search department..."
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>Doctors</label>
          <SearchableSelect
            multiple
            options={doctors}
            value={doctorIds}
            onChange={setDoctorIds}
            placeholder="Search doctor..."
          />
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>{contentLabel}</label>
        <RichTextEditor value={content} onChange={setContent} resetKey={`${mode}-${item?.id ?? 'new'}`} />
      </div>

      <div className={style.field}>
        <label className={style.label}>Gallery</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleGalleryChange} />
        {galleryUploading && <p className={style.hint}>Uploading…</p>}
        {galleryError && (
          <p className={style.hint} style={{ color: '#c0392b' }}>
            {galleryError}
          </p>
        )}

        {gallery.length > 0 && (
          <div className={style.galleryGrid}>
            {gallery.map((image, index) => (
              <div key={`${image.imagePath}-${index}`} className={style.galleryItem}>
                <Image src={image.imagePath} alt="" width={120} height={90} />
                <button
                  type="button"
                  className={style.galleryRemove}
                  onClick={() => removeGalleryImage(index)}
                  aria-label={`Remove gallery image ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : `Add ${entityLabel}`}
        </button>
      </div>
    </form>
  )
}
