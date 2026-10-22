'use client'

import { useState } from 'react'
import QuickAddModal from '../../QuickAddModal'
import style from './jobs.module.css'

export default function JobOptionManager({ label, apiBasePath, items, onItemsChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const openAddModal = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleSave = async (name) => {
    if (editingItem) {
      const res = await fetch(`${apiBasePath}/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save')
      onItemsChange(items.map((item) => (item.id === editingItem.id ? data.item : item)).sort((a, b) => a.name.localeCompare(b.name)))
    } else {
      const res = await fetch(apiBasePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save')
      onItemsChange([...items, data.item].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return

    const res = await fetch(`${apiBasePath}/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete this value.')
      return
    }

    onItemsChange(items.filter((i) => i.id !== item.id))
  }

  return (
    <div className={style.optionManager}>
      <div className={style.optionManagerHeader}>
        <span className={style.optionManagerLabel}>{label}</span>
        <button type="button" className={style.optionManagerAdd} onClick={openAddModal}>
          + Add {label}
        </button>
      </div>
      <div className={style.optionChips}>
        {items.map((item) => (
          <span key={item.id} className={style.optionChip}>
            <button type="button" onClick={() => openEditModal(item)} className={style.optionChipLabel}>
              {item.name}
            </button>
            <button
              type="button"
              className={style.optionChipRemove}
              onClick={() => handleDelete(item)}
              aria-label={`Delete ${item.name}`}
            >
              ×
            </button>
          </span>
        ))}
        {items.length === 0 && <span className={style.optionChipsEmpty}>None yet</span>}
      </div>

      {modalOpen && (
        <QuickAddModal
          title={editingItem ? `Edit ${label}` : `Add ${label}`}
          initialValue={editingItem?.name ?? ''}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
