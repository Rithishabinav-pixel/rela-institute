'use client'

import { useState } from 'react'
import Image from 'next/image'
import CategoryManagerModal from './CategoryManagerModal'
import style from './content/content-admin.module.css'

export default function CategoryManagerPanel({ label, apiBasePath, items, onItemsChange, hasImage = false, uploadPath }) {
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

  const handleSave = async ({ name, categoryImage, isActive }) => {
    const body = hasImage ? { name, categoryImage, isActive } : { name, isActive }

    if (editingItem) {
      const res = await fetch(`${apiBasePath}/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save category')
      onItemsChange(items.map((item) => (item.id === editingItem.id ? data.category : item)))
    } else {
      const res = await fetch(apiBasePath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not save category')
      onItemsChange([...items, data.category])
    }
  }

  const handleToggleActive = async (item) => {
    const nextValue = !item.isActive
    onItemsChange(items.map((i) => (i.id === item.id ? { ...i, isActive: nextValue } : i)))

    try {
      const res = await fetch(`${apiBasePath}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextValue }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      onItemsChange(items.map((i) => (i.id === item.id ? { ...i, isActive: item.isActive } : i)))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return

    const res = await fetch(`${apiBasePath}/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete this category.')
      return
    }

    onItemsChange(items.filter((i) => i.id !== item.id))
  }

  return (
    <div className={style.card} style={{ marginBottom: 24, padding: 20 }}>
      <div className={style.pageHeader} style={{ marginBottom: 16 }}>
        <h2 className={style.pageTitle} style={{ fontSize: 18 }}>{label} Categories</h2>
        <button type="button" className={style.primaryButton} onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {items.length === 0 && <span className={style.hint}>No categories yet.</span>}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid #ebebeb',
              borderRadius: 10,
              padding: '8px 12px',
            }}
          >
            {hasImage && item.categoryImage && (
              <Image src={item.categoryImage} alt="" width={32} height={37} style={{ borderRadius: 6, objectFit: 'cover' }} />
            )}
            <button type="button" onClick={() => openEditModal(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {item.name}
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={item.isActive}
              className={`${style.toggle} ${item.isActive ? style.toggleOn : ''}`}
              onClick={() => handleToggleActive(item)}
              title="Active"
            />
            <button type="button" className={style.dangerButton} onClick={() => handleDelete(item)} aria-label={`Delete ${item.name}`}>
              ×
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <CategoryManagerModal
          title={editingItem ? `Edit Category` : `Add Category`}
          initialName={editingItem?.name ?? ''}
          initialImage={editingItem?.categoryImage ?? ''}
          initialActive={editingItem?.isActive ?? true}
          hasImage={hasImage}
          uploadPath={uploadPath}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
