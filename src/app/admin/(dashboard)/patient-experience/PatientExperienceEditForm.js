'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchableSelect from '../../SearchableSelect'
import style from '../../content/content-admin.module.css'

function extractYoutubeVideoId(url) {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{6,})/i,
    /youtube\.com\/embed\/([\w-]{6,})/i,
    /youtu\.be\/([\w-]{6,})/i,
    /youtube\.com\/shorts\/([\w-]{6,})/i,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function PatientExperienceEditForm({ mode, item, categories }) {
  const router = useRouter()

  const [patientName, setPatientName] = useState(item?.patientName ?? '')
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? null)
  const [featureImage, setFeatureImage] = useState(item?.featureImage ?? '')
  const [videoUrl, setVideoUrl] = useState(item?.videoUrl ?? '')
  const [isActive, setIsActive] = useState(item?.isActive !== false)

  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const videoId = extractYoutubeVideoId(videoUrl)

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/patient-experience/upload-image', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || 'Could not upload image.')
        return
      }

      setFeatureImage(data.url)
    } catch {
      setImageError('Could not upload image.')
    } finally {
      setImageUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = { patientName, categoryId, featureImage, videoUrl, isActive }

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/patient-experience' : `/api/admin/patient-experience/${item.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save patient experience.')
        return
      }

      router.push('/admin/patient-experience')
      router.refresh()
    } catch {
      setError('Could not save patient experience.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.field}>
        <label className={style.label}>
          Patient Name <span className={style.required}>*</span>
        </label>
        <input className={style.input} value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Category <span className={style.required}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <SearchableSelect options={categories} value={categoryId} onChange={setCategoryId} placeholder="Select category..." />
          </div>
          <a href="/admin/patient-experience" target="_blank" rel="noreferrer" className={style.secondaryButton}>
            + Manage Categories
          </a>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>Featured Image</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {featureImage && <Image src={featureImage} alt="" width={160} height={90} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
            {imageUploading && <p className={style.hint}>Uploading…</p>}
            {imageError && <p className={style.hint} style={{ color: '#c0392b' }}>{imageError}</p>}
          </div>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Video Embed URL (YouTube) <span className={style.required}>*</span>
        </label>
        <input
          className={style.input}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
        {videoUrl && !videoId && <p className={style.hint} style={{ color: '#c0392b' }}>Could not recognize this as a YouTube URL.</p>}
        {videoId && (
          <div style={{ marginTop: 10, maxWidth: 320, aspectRatio: '16/9' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
            />
          </div>
        )}
      </div>

      <div className={style.checkboxField}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label className={style.label} htmlFor="isActive">Active (visible on the public site)</label>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || imageUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/patient-experience')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
