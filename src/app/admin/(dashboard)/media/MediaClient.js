'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import style from './media.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function MediaClient({ initialMedia }) {
  const [media, setMedia] = useState(initialMedia)
  const [search, setSearch] = useState('')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selected, setSelected] = useState(null)
  const [editAltText, setEditAltText] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/admin/media?search=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => setMedia(data.media ?? []))
        .catch(() => {})
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search])

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!file) {
      setUploadError('Please choose an image.')
      return
    }
    if (!altText.trim()) {
      setUploadError('Alt text is required.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', altText.trim())

      const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Could not upload image.')
        return
      }

      setMedia((prev) => [data.media, ...prev])
      setAltText('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setUploadError('Could not upload image.')
    } finally {
      setUploading(false)
    }
  }

  const openDetail = (item) => {
    setSelected(item)
    setEditAltText(item.altText)
    setCopied(false)
  }

  const closeDetail = () => setSelected(null)

  const handleCopyUrl = () => {
    if (!selected) return
    const absoluteUrl = window.location.origin + selected.url
    navigator.clipboard?.writeText(absoluteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleSaveAlt = async () => {
    if (!selected || !editAltText.trim()) return

    const res = await fetch(`/api/admin/media/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ altText: editAltText.trim() }),
    })
    const data = await res.json()
    if (!res.ok) {
      window.alert(data.error || 'Could not update alt text.')
      return
    }

    setMedia((prev) => prev.map((item) => (item.id === selected.id ? data.media : item)))
    setSelected(data.media)
  }

  const handleDelete = async () => {
    if (!selected) return
    if (!window.confirm('Delete this image? This cannot be undone.')) return

    const res = await fetch(`/api/admin/media/${selected.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete image.')
      return
    }

    setMedia((prev) => prev.filter((item) => item.id !== selected.id))
    closeDetail()
  }

  return (
    <>
      <form className={style.uploadCard} onSubmit={handleUpload}>
        <div className={style.field}>
          <label className={style.label}>Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Alt Text <span style={{ color: '#c0392b' }}>*</span>
          </label>
          <input
            className={style.input}
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            placeholder="Describe the image"
          />
        </div>
        <button type="submit" className={style.primaryButton} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        {uploadError && <div className={style.errorText}>{uploadError}</div>}
      </form>

      <div className={style.pageHeader}>
        <div />
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search by alt text..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {media.length === 0 ? (
        <div className={style.emptyState}>No media uploaded yet.</div>
      ) : (
        <div className={style.grid}>
          {media.map((item) => (
            <button key={item.id} type="button" className={style.gridItem} onClick={() => openDetail(item)}>
              <span className={style.gridImage}>
                <Image src={item.url} alt={item.altText} fill sizes="200px" />
              </span>
              <span className={style.gridCaption}>{item.altText}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className={style.overlay} onClick={closeDetail}>
          <div className={style.modal} onClick={(event) => event.stopPropagation()}>
            <div className={style.modalPreview}>
              <Image src={selected.url} alt={selected.altText} fill sizes="480px" />
            </div>

            <div className={style.modalField}>
              <div className={style.modalLabel}>Alt Text</div>
              <div className={style.urlRow}>
                <input value={editAltText} onChange={(event) => setEditAltText(event.target.value)} />
                <button type="button" className={style.secondaryButton} onClick={handleSaveAlt}>
                  Save
                </button>
              </div>
            </div>

            <div className={style.modalField}>
              <div className={style.modalLabel}>Image URL</div>
              <div className={style.urlRow}>
                <input readOnly value={selected.url} />
                <button type="button" className={style.secondaryButton} onClick={handleCopyUrl}>
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            <div className={style.modalActions}>
              <button type="button" className={style.dangerButton} onClick={handleDelete}>
                Delete
              </button>
              <button type="button" className={style.secondaryButton} onClick={closeDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
