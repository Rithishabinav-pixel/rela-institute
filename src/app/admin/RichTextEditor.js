'use client'

import { useEffect, useRef, useState } from 'react'
import style from './RichTextEditor.module.css'

export default function RichTextEditor({ value, onChange, resetKey }) {
  const editorRef = useRef(null)
  const [sourceMode, setSourceMode] = useState(false)
  const lastExternalValue = useRef(value)

  useEffect(() => {
    if (editorRef.current && !sourceMode) {
      editorRef.current.innerHTML = value || ''
      lastExternalValue.current = value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useEffect(() => {
    if (!sourceMode && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceMode])

  const emitChange = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const exec = (command, arg) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    emitChange()
  }

  const handleHeadingChange = (event) => {
    const tag = event.target.value
    exec('formatBlock', tag)
  }

  const handleLink = () => {
    const url = window.prompt('Link URL (https://...)')
    if (!url) return
    exec('createLink', url)
  }

  const handleImage = () => {
    const url = window.prompt('Image URL (paste the Media Library URL)')
    if (!url) return
    exec('insertImage', url)
  }

  const toggleSource = () => {
    if (!sourceMode && editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
    setSourceMode((prev) => !prev)
  }

  return (
    <div className={style.wrapper}>
      <div className={style.toolbar}>
        <select onChange={handleHeadingChange} defaultValue="" disabled={sourceMode}>
          <option value="" disabled>
            Format
          </option>
          <option value="P">Paragraph</option>
          <option value="H1">Heading 1</option>
          <option value="H2">Heading 2</option>
          <option value="H3">Heading 3</option>
          <option value="H4">Heading 4</option>
          <option value="H5">Heading 5</option>
          <option value="H6">Heading 6</option>
        </select>
        <div className={style.toolbarDivider} />
        <button type="button" onClick={() => exec('bold')} disabled={sourceMode}>
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => exec('italic')} disabled={sourceMode}>
          <em>I</em>
        </button>
        <button type="button" onClick={() => exec('insertUnorderedList')} disabled={sourceMode}>
          • List
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} disabled={sourceMode}>
          1. List
        </button>
        <button type="button" onClick={handleLink} disabled={sourceMode}>
          Link
        </button>
        <button type="button" onClick={handleImage} disabled={sourceMode}>
          Image
        </button>
        <button
          type="button"
          className={`${style.sourceToggle} ${sourceMode ? style.sourceToggleActive : ''}`}
          onClick={toggleSource}
        >
          {'</>'} Source
        </button>
      </div>

      {sourceMode ? (
        <textarea
          className={style.sourceTextarea}
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <div
          ref={editorRef}
          className={style.editor}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={emitChange}
        />
      )}
    </div>
  )
}
