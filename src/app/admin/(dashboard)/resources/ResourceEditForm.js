'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SearchableSelect from '../../SearchableSelect'
import style from '../../content/content-admin.module.css'

export default function ResourceEditForm({ mode, item, categories }) {
  const router = useRouter()

  const [title, setTitle] = useState(item?.title ?? '')
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? null)
  const [linkType, setLinkType] = useState(item?.linkType ?? 'url')
  const [externalUrl, setExternalUrl] = useState(item?.externalUrl ?? '')
  const [pdfUrl, setPdfUrl] = useState(item?.pdfUrl ?? '')
  const [isActive, setIsActive] = useState(item?.isActive !== false)

  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handlePdfChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPdfUploading(true)
    setPdfError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/resources/upload-pdf', { method: 'POST', body: formData })
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

    const input = { title, categoryId, linkType, externalUrl, pdfUrl, isActive }

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/resources' : `/api/admin/resources/${item.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save resource.')
        return
      }

      router.push('/admin/resources')
      router.refresh()
    } catch {
      setError('Could not save resource.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.field}>
        <label className={style.label}>
          Resource Title <span className={style.required}>*</span>
        </label>
        <input className={style.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Category <span className={style.required}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <SearchableSelect options={categories} value={categoryId} onChange={setCategoryId} placeholder="Select category..." />
          </div>
          <a href="/admin/resources" target="_blank" rel="noreferrer" className={style.secondaryButton}>
            + Manage Categories
          </a>
        </div>
      </div>

      <div className={style.typeToggle}>
        <button
          type="button"
          className={`${style.typeToggleButton} ${linkType === 'url' ? style.typeToggleButtonActive : ''}`}
          onClick={() => setLinkType('url')}
        >
          External URL
        </button>
        <button
          type="button"
          className={`${style.typeToggleButton} ${linkType === 'pdf' ? style.typeToggleButtonActive : ''}`}
          onClick={() => setLinkType('pdf')}
        >
          PDF Upload
        </button>
      </div>

      {linkType === 'url' ? (
        <div className={style.field}>
          <label className={style.label}>
            External URL <span className={style.required}>*</span>
          </label>
          <input className={style.input} value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://" />
        </div>
      ) : (
        <div className={style.field}>
          <label className={style.label}>
            PDF Upload <span className={style.required}>*</span>
          </label>
          <input type="file" accept="application/pdf" onChange={handlePdfChange} />
          {pdfUploading && <p className={style.hint}>Uploading…</p>}
          {pdfError && <p className={style.hint} style={{ color: '#c0392b' }}>{pdfError}</p>}
          {!pdfUploading && pdfUrl && (
            <p className={style.hint}>
              <a href={pdfUrl} target="_blank" rel="noreferrer">View current PDF</a>
            </p>
          )}
        </div>
      )}

      <div className={style.checkboxField}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label className={style.label} htmlFor="isActive">Active (visible on the public site)</label>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || pdfUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/resources')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
