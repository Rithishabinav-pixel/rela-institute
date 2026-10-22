'use client'

import { useState } from 'react'
import style from './QuickAddModal.module.css'

export default function QuickAddModal({ title, initialValue = '', onSave, onClose }) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!value.trim()) {
      setError('This field cannot be empty')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave(value.trim())
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
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') handleSave() }}
            autoFocus
          />
        </div>
        {error && <div className={style.error}>{error}</div>}
        <div className={style.actions}>
          <button type="button" className={style.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={style.primaryButton} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
