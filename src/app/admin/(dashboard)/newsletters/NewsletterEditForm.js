'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import style from '../../content/content-admin.module.css'

function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export default function NewsletterEditForm({ mode, item }) {
  const router = useRouter()

  const [title, setTitle] = useState(item?.title ?? '')
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(item?.publishedAt))
  const [featureImage, setFeatureImage] = useState(item?.featureImage ?? '')
  const [pdfUrl, setPdfUrl] = useState(item?.pdfUrl ?? '')
  const [isActive, setIsActive] = useState(item?.isActive !== false)

  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfError, setPdfError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/newsletters/upload-image', { method: 'POST', body: formData })
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

  const handlePdfChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPdfUploading(true)
    setPdfError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/newsletters/upload-pdf', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setPdfError(data.error || 'Could not upload PDF.')
        return
      }

      setPdfUrl(data.url)
    } catch {
      setPdfError('Could not upload PDF.')
    } finally {
      setPdfUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = { title, publishedAt: publishedAt || null, featureImage, pdfUrl, isActive }

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/newsletters' : `/api/admin/newsletters/${item.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save newsletter.')
        return
      }

      router.push('/admin/newsletters')
      router.refresh()
    } catch {
      setError('Could not save newsletter.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.field}>
        <label className={style.label}>
          Newsletter Title <span className={style.required}>*</span>
        </label>
        <input className={style.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={style.field}>
        <label className={style.label}>Published Date</label>
        <input type="date" className={style.input} value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
      </div>

      <div className={style.field}>
        <label className={style.label}>Featured Image (360 × 202px)</label>
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
        <label className={style.label}>PDF Upload</label>
        <div>
          <input type="file" accept="application/pdf" onChange={handlePdfChange} />
          {pdfUploading && <p className={style.hint}>Uploading…</p>}
          {pdfError && <p className={style.hint} style={{ color: '#c0392b' }}>{pdfError}</p>}
          {!pdfUploading && pdfUrl && (
            <p className={style.hint}>
              <a href={pdfUrl} target="_blank" rel="noreferrer">
                View current PDF
              </a>
            </p>
          )}
        </div>
      </div>

      <div className={style.checkboxField}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label className={style.label} htmlFor="isActive">Active (visible on the public site)</label>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || imageUploading || pdfUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/newsletters')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
