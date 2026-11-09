'use client'

import { useState } from 'react'
import Image from 'next/image'
import style from './QuickAddModal.module.css'

export default function CategoryManagerModal({ title, initialName = '', initialImage = '', initialActive = true, hasImage, uploadPath, onSave, onClose }) {
  const [name, setName] = useState(initialName)
  const [categoryImage, setCategoryImage] = useState(initialImage)
  const [isActive, setIsActive] = useState(initialActive)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(uploadPath, { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not upload image.')
        return
      }

      setCategoryImage(data.url)
    } catch {
      setError('Could not upload image.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Category name cannot be empty')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave({ name: name.trim(), categoryImage, isActive })
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(event) => event.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.field}>
          <input
            className={style.input}
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter' && !hasImage) handleSave() }}
            autoFocus
          />
        </div>

        {hasImage && (
          <div className={style.field} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {categoryImage && (
              <Image src={categoryImage} alt="" width={64} height={75} style={{ borderRadius: 8, objectFit: 'cover' }} />
            )}
            <div>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
              {uploading && <p style={{ fontSize: 12, color: '#8a8a8a' }}>Uploading…</p>}
            </div>
          </div>
        )}

        <div className={style.field} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="categoryActive" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          <label htmlFor="categoryActive">Active</label>
        </div>

        {error && <div className={style.error}>{error}</div>}
        <div className={style.actions}>
          <button type="button" className={style.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={style.primaryButton} onClick={handleSave} disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
