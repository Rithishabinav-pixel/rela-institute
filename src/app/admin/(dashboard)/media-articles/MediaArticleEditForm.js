'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchableSelect from '../../SearchableSelect'
import RichTextEditor from '../../RichTextEditor'
import style from './media-articles.module.css'

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

export default function MediaArticleEditForm({ mode, article, departments, doctors }) {
  const router = useRouter()

  const [title, setTitle] = useState(article?.title ?? '')
  const [slug, setSlug] = useState(article?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(article?.publishedAt))
  const [featureType, setFeatureType] = useState(article?.featureType ?? 'image')
  const [featureImage, setFeatureImage] = useState(article?.featureImage ?? '')
  const [featureImageSourceUrl] = useState(article?.featureImageSourceUrl ?? '')
  const [featureImageUploading, setFeatureImageUploading] = useState(false)
  const [featureImageError, setFeatureImageError] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState(article?.youtubeUrl ?? '')
  const [readMoreUrl, setReadMoreUrl] = useState(article?.readMoreUrl ?? '')
  const [departmentIds, setDepartmentIds] = useState(
    article?.departments?.map((d) => d.departmentId) ?? []
  )
  const [doctorIds, setDoctorIds] = useState(article?.doctors?.map((d) => d.id) ?? [])
  const [content, setContent] = useState(article?.content ?? '')
  const [gallery, setGallery] = useState(article?.gallery ?? [])
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryError, setGalleryError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
      const res = await fetch('/api/admin/media-articles/upload-feature-image', { method: 'POST', body: formData })
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
      const res = await fetch('/api/admin/media-articles/upload-gallery-images', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setGalleryError(data.error || 'Could not upload gallery images.')
        return
      }

      setGallery((prev) => [...prev, ...data.uploaded.map((item) => ({ imagePath: item.imagePath }))])

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

    const url = mode === 'edit' ? `/api/admin/media-articles/${article.id}` : '/api/admin/media-articles'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save media article.')
        return
      }

      router.push('/admin/media-articles')
      router.refresh()
    } catch {
      setError('Could not save media article.')
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
          <input
            className={style.input}
            value={youtubeUrl}
            onChange={(event) => setYoutubeUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
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
        <label className={style.label}>Article Content</label>
        <RichTextEditor value={content} onChange={setContent} resetKey={`${mode}-${article?.id ?? 'new'}`} />
      </div>

      <div className={style.field}>
        <label className={style.label}>Gallery</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleGalleryChange}
        />
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
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Add Media Article'}
        </button>
      </div>
    </form>
  )
}
