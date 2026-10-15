'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TagInput from '../../TagInput'
import style from './departments.module.css'

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function DepartmentEditForm({ mode, department }) {
  const router = useRouter()

  const [name, setName] = useState(department?.name ?? '')
  const [slug, setSlug] = useState(department?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [icon, setIcon] = useState(department?.icon ?? '')
  const [iconUploading, setIconUploading] = useState(false)
  const [iconError, setIconError] = useState('')
  const [symptoms, setSymptoms] = useState(department?.symptoms ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleNameChange = (value) => {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSlugChange = (value) => {
    setSlugTouched(true)
    setSlug(value)
  }

  const handleIconChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIconUploading(true)
    setIconError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/departments/upload-icon', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setIconError(data.error || 'Could not upload icon.')
        return
      }

      setIcon(data.url)
    } catch {
      setIconError('Could not upload icon.')
    } finally {
      setIconUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = { name, slug, icon, symptoms }

    const url = mode === 'edit' ? `/api/admin/departments/${department.id}` : '/api/admin/departments'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save department.')
        return
      }

      router.push('/admin/departments')
      router.refresh()
    } catch {
      setError('Could not save department.')
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
            Department Name <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
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

      <div className={style.field}>
        <label className={style.label}>Department Icon (80 × 80px)</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {icon && <Image src={icon} alt="" width={80} height={80} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleIconChange} />
            {iconUploading && <p className={style.hint}>Uploading…</p>}
            {iconError && <p className={style.hint} style={{ color: '#c0392b' }}>{iconError}</p>}
            {!iconError && !iconUploading && (
              <p className={style.hint}>PNG/JPEG/WEBP must be exactly 80×80px. SVG is accepted at any size. Leave empty for no icon.</p>
            )}
          </div>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>Symptoms</label>
        <TagInput value={symptoms} onChange={setSymptoms} placeholder="Type a symptom and press Enter..." />
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Add Department'}
        </button>
      </div>
    </form>
  )
}
