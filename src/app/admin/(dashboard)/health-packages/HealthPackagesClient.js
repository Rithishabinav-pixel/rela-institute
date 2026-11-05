'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from '../../content/content-admin.module.css'

export default function HealthPackagesClient({ initial }) {
  const [packages, setPackages] = useState(initial)

  const persistOrder = async (nextPackages) => {
    setPackages(nextPackages)

    try {
      const res = await fetch('/api/admin/health-packages/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: nextPackages.map((p) => p.id) }),
      })

      if (!res.ok) throw new Error('Could not save the new order')
    } catch {
      setPackages(packages)
      window.alert('Could not save the new order. Please try again.')
    }
  }

  const moveUp = (index) => {
    if (index === 0) return
    const next = [...packages]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    persistOrder(next)
  }

  const moveDown = (index) => {
    if (index === packages.length - 1) return
    const next = [...packages]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    persistOrder(next)
  }

  const handleToggleActive = async (pkg) => {
    const nextValue = !pkg.isActive

    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, isActive: nextValue } : p)))

    try {
      const res = await fetch(`/api/admin/health-packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextValue }),
      })

      if (!res.ok) throw new Error('Could not update health package')
    } catch {
      setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, isActive: pkg.isActive } : p)))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const handleDelete = async (pkg) => {
    if (!window.confirm(`Delete "${pkg.testName}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/health-packages/${pkg.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete health package.')
      return
    }

    setPackages((prev) => prev.filter((p) => p.id !== pkg.id))
  }

  return (
    <div className={style.card}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Image</th>
            <th>Test Name</th>
            <th>Slug</th>
            <th>Offer / Actual Price</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {packages.length === 0 && (
            <tr className={style.stateRow}>
              <td colSpan={7}>No health packages found.</td>
            </tr>
          )}

          {packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>
                <div className={style.rowActions}>
                  <button type="button" className={style.secondaryButton} disabled={index === 0} onClick={() => moveUp(index)} aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" className={style.secondaryButton} disabled={index === packages.length - 1} onClick={() => moveDown(index)} aria-label="Move down">
                    ↓
                  </button>
                </div>
              </td>
              <td>
                <span className={style.avatar}>
                  {pkg.packageImage && <Image src={pkg.packageImage} alt="" width={64} height={40} />}
                </span>
              </td>
              <td>{pkg.testName}</td>
              <td>{pkg.slug}</td>
              <td>₹{pkg.offerPrice} / ₹{pkg.actualPrice}</td>
              <td>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pkg.isActive}
                  aria-label={`Toggle ${pkg.testName} active`}
                  className={`${style.toggle} ${pkg.isActive ? style.toggleOn : ''}`}
                  onClick={() => handleToggleActive(pkg)}
                />
              </td>
              <td>
                <div className={style.rowActions}>
                  <Link href={`/admin/health-packages/${pkg.id}`} className={style.secondaryButton}>
                    Edit
                  </Link>
                  <button type="button" className={style.dangerButton} onClick={() => handleDelete(pkg)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
