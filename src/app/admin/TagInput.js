'use client'

import { useState } from 'react'
import style from './TagInput.module.css'

export default function TagInput({ value, onChange, placeholder = 'Type a value and press Enter...' }) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const alreadyExists = value.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())
    if (!alreadyExists) {
      onChange([...value, trimmed])
    }
    setDraft('')
  }

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const editTag = (index) => {
    setDraft(value[index])
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      editTag(value.length - 1)
    }
  }

  return (
    <div>
      <div className={style.control}>
        {value.map((tag, index) => (
          <span key={`${tag}-${index}`} className={style.chip} onClick={() => editTag(index)} title="Click to edit">
            {tag}
            <button
              type="button"
              className={style.chipRemove}
              onClick={(event) => {
                event.stopPropagation()
                removeTag(index)
              }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className={style.input}
          placeholder={value.length === 0 ? placeholder : 'Add another...'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
        />
      </div>
      <p className={style.hint}>Press Enter to add. Click a tag to edit it.</p>
    </div>
  )
}
