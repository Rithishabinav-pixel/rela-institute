'use client'

import { useEffect, useRef, useState } from 'react'
import style from './BlockContentEditor.module.css'

let nextBlockId = 1

function createBlock(type, text = '') {
  return { id: nextBlockId++, type, text }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function blocksToHtml(blocks) {
  return blocks
    .map((block) => {
      if (block.type === 'heading') return `<h3>${escapeHtml(block.text)}</h3>`
      if (block.type === 'list') {
        const items = block.text
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
        return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      }
      return `<p>${escapeHtml(block.text)}</p>`
    })
    .join('')
}

export function htmlToBlocks(html) {
  if (typeof window === 'undefined' || !html) return [createBlock('paragraph')]

  const container = document.createElement('div')
  container.innerHTML = html

  const blocks = [...container.children].map((el) => {
    if (el.tagName === 'H3') return createBlock('heading', el.textContent)
    if (el.tagName === 'UL') {
      const items = [...el.querySelectorAll('li')].map((li) => li.textContent)
      return createBlock('list', items.join('\n'))
    }
    return createBlock('paragraph', el.textContent)
  })

  return blocks.length > 0 ? blocks : [createBlock('paragraph')]
}

export default function BlockContentEditor({ value, onChange }) {
  const [blocks, setBlocks] = useState(() => htmlToBlocks(value))
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    setBlocks(htmlToBlocks(value))
  }, [value])

  const updateBlocks = (nextBlocks) => {
    setBlocks(nextBlocks)
    onChange(blocksToHtml(nextBlocks))
  }

  const setBlockText = (id, text) => {
    updateBlocks(blocks.map((block) => (block.id === id ? { ...block, text } : block)))
  }

  const toggleBlockType = (id, type) => {
    updateBlocks(
      blocks.map((block) => (block.id === id ? { ...block, type: block.type === type ? 'paragraph' : type } : block))
    )
  }

  const removeBlock = (id) => {
    const next = blocks.filter((block) => block.id !== id)
    updateBlocks(next.length > 0 ? next : [createBlock('paragraph')])
  }

  const addBlock = () => {
    updateBlocks([...blocks, createBlock('paragraph')])
  }

  return (
    <div className={style.wrapper}>
      {blocks.map((block) => (
        <div className={style.block} key={block.id}>
          {block.type === 'list' ? (
            <textarea
              className={style.blockInput}
              value={block.text}
              onChange={(event) => setBlockText(block.id, event.target.value)}
              placeholder="One item per line"
              rows={3}
            />
          ) : (
            <textarea
              className={`${style.blockInput} ${block.type === 'heading' ? style.blockInputHeading : ''}`}
              value={block.text}
              onChange={(event) => setBlockText(block.id, event.target.value)}
              placeholder={block.type === 'heading' ? 'Heading text' : 'Paragraph text'}
              rows={1}
            />
          )}
          <div className={style.blockControls}>
            <button
              type="button"
              className={`${style.toggleButton} ${block.type === 'heading' ? style.toggleButtonActive : ''}`}
              onClick={() => toggleBlockType(block.id, 'heading')}
              aria-label="Toggle heading"
              title="Bold (heading)"
            >
              B
            </button>
            <button
              type="button"
              className={`${style.toggleButton} ${block.type === 'list' ? style.toggleButtonActive : ''}`}
              onClick={() => toggleBlockType(block.id, 'list')}
              aria-label="Toggle bullet list"
              title="Bulleted list"
            >
              •≡
            </button>
            <button
              type="button"
              className={style.removeButton}
              onClick={() => removeBlock(block.id)}
              aria-label="Remove block"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <div className={style.addRow}>
        <button type="button" className={style.addButton} onClick={addBlock}>
          + Add Line
        </button>
      </div>
    </div>
  )
}
