'use client'

import { useMemo, useState } from 'react'
import style from '../doctors.module.css'

export default function DoctorsRearrangeClient({ initial }) {
  const [doctors, setDoctors] = useState(initial)
  const [search, setSearch] = useState('')
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return doctors

    return doctors.filter((doctor) => {
      if (doctor.name.toLowerCase().includes(term)) return true
      if (doctor.speciality?.name?.toLowerCase().includes(term)) return true
      return doctor.departments.some((department) => department.name.toLowerCase().includes(term))
    })
  }, [doctors, search])

  const reorder = (fromId, toId) => {
    if (fromId == null || toId == null || fromId === toId) return

    setDoctors((prev) => {
      const next = [...prev]
      const fromIndex = next.findIndex((doctor) => doctor.id === fromId)
      const toIndex = next.findIndex((doctor) => doctor.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev

      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    setDirty(true)
    setSaved(false)
  }

  const handleDragStart = (id) => setDragId(id)

  const handleDragOver = (event, id) => {
    event.preventDefault()
    if (id !== overId) setOverId(id)
  }

  const handleDrop = (event, targetId) => {
    event.preventDefault()
    reorder(dragId, targetId)
    setDragId(null)
    setOverId(null)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setOverId(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/doctors/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: doctors.map((doctor) => doctor.id) }),
      })

      if (!res.ok) throw new Error('Could not save the new order')

      setDirty(false)
      setSaved(true)
    } catch {
      setError('Could not save the new order. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className={style.pageHeader}>
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search by name or speciality..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className={style.headerActions}>
          {saved && <span className={style.hint}>Order saved.</span>}
          <button
            type="button"
            className={style.primaryButton}
            onClick={handleSave}
            disabled={!dirty || saving}
          >
            {saving ? 'Saving…' : 'Save Order'}
          </button>
        </div>
      </div>

      {error && <div className={style.errorBanner}>{error}</div>}

      <p className={style.hint}>Drag and drop a card to change its position, then click Save Order.</p>

      <div className={style.rearrangeGrid}>
        {filtered.length === 0 && <p className={style.hint}>No doctors found.</p>}

        {filtered.map((doctor) => (
          <div
            key={doctor.id}
            draggable
            onDragStart={() => handleDragStart(doctor.id)}
            onDragOver={(event) => handleDragOver(event, doctor.id)}
            onDrop={(event) => handleDrop(event, doctor.id)}
            onDragEnd={handleDragEnd}
            className={`${style.rearrangeCard} ${dragId === doctor.id ? style.rearrangeCardDragging : ''} ${
              overId === doctor.id && dragId !== doctor.id ? style.rearrangeCardOver : ''
            }`}
          >
            <span className={style.rearrangeHandle} aria-hidden="true">
              ⠿
            </span>
            <div>
              <p className={style.rearrangeName}>{doctor.name}</p>
              <p className={style.rearrangeSpeciality}>{doctor.speciality?.name}</p>
              {doctor.departments.length > 0 && (
                <div className={style.tagList}>
                  {doctor.departments.map((department) => (
                    <span key={department.id} className={style.tag}>
                      {department.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
