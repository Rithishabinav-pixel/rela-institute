'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchableSelect from '../../SearchableSelect'
import style from '../../content/content-admin.module.css'

export default function TestimonialEditForm({ mode, item, categories }) {
  const router = useRouter()

  const [title, setTitle] = useState(item?.title ?? '')
  const [content, setContent] = useState(item?.content ?? '')
  const [userName, setUserName] = useState(item?.userName ?? '')
  const [userImage, setUserImage] = useState(item?.userImage ?? '')
  const [featureImage, setFeatureImage] = useState(item?.featureImage ?? '')
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? null)
  const [isInternational, setIsInternational] = useState(item?.isInternational ?? false)
  const [isFeatured, setIsFeatured] = useState(item?.isFeatured ?? false)
  const [isActive, setIsActive] = useState(item?.isActive !== false)

  const [userImageUploading, setUserImageUploading] = useState(false)
  const [userImageError, setUserImageError] = useState('')
  const [featureImageUploading, setFeatureImageUploading] = useState(false)
  const [featureImageError, setFeatureImageError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleUserImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUserImageUploading(true)
    setUserImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/testimonials/upload-user-image', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setUserImageError(data.error || 'Could not upload image.')
        return
      }

      setUserImage(data.url)
    } catch {
      setUserImageError('Could not upload image.')
    } finally {
      setUserImageUploading(false)
      event.target.value = ''
    }
  }

  const handleFeatureImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFeatureImageUploading(true)
    setFeatureImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/testimonials/upload-feature-image', { method: 'POST', body: formData })
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = { title, content, userName, userImage, featureImage, categoryId, isInternational, isFeatured, isActive }

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/testimonials' : `/api/admin/testimonials/${item.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save testimonial.')
        return
      }

      router.push('/admin/testimonials')
      router.refresh()
    } catch {
      setError('Could not save testimonial.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.field}>
        <label className={style.label}>
          Testimonial Title <span className={style.required}>*</span>
        </label>
        <input className={style.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Testimonial Content <span className={style.required}>*</span>
        </label>
        <textarea className={style.textarea} rows={5} value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            User Name <span className={style.required}>*</span>
          </label>
          <input className={style.input} value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Category <span className={style.required}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <SearchableSelect options={categories} value={categoryId} onChange={setCategoryId} placeholder="Select category..." />
            </div>
            <a href="/admin/testimonials" target="_blank" rel="noreferrer" className={style.secondaryButton}>
              + Manage
            </a>
          </div>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>User Image (40 × 40px)</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview} style={{ width: 40, height: 40 }}>
            {userImage && <Image src={userImage} alt="" width={40} height={40} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUserImageChange} />
            {userImageUploading && <p className={style.hint}>Uploading…</p>}
            {userImageError && <p className={style.hint} style={{ color: '#c0392b' }}>{userImageError}</p>}
          </div>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>Optional Featured Image (360 × 415px)</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {featureImage && <Image src={featureImage} alt="" width={160} height={184} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFeatureImageChange} />
            {featureImageUploading && <p className={style.hint}>Uploading…</p>}
            {featureImageError && <p className={style.hint} style={{ color: '#c0392b' }}>{featureImageError}</p>}
          </div>
        </div>
      </div>

      <div className={style.checkboxField}>
        <input type="checkbox" id="isInternational" checked={isInternational} onChange={(e) => setIsInternational(e.target.checked)} />
        <label className={style.label} htmlFor="isInternational">International</label>
      </div>

      <div className={style.checkboxField}>
        <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        <label className={style.label} htmlFor="isFeatured">Featured Testimonial</label>
      </div>

      <div className={style.checkboxField}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label className={style.label} htmlFor="isActive">Active (visible on the public site)</label>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || userImageUploading || featureImageUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/testimonials')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
