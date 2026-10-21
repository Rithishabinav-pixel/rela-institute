'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from '../../content/content-admin.module.css'

export default function HeroBannersClient({ initial }) {
  const [banners, setBanners] = useState(initial)

  const persistOrder = async (nextBanners) => {
    setBanners(nextBanners)

    try {
      const res = await fetch('/api/admin/hero-banners/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: nextBanners.map((b) => b.id) }),
      })

      if (!res.ok) throw new Error('Could not save the new order')
    } catch {
      setBanners(banners)
      window.alert('Could not save the new order. Please try again.')
    }
  }

  const moveUp = (index) => {
    if (index === 0) return
    const next = [...banners]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    persistOrder(next)
  }

  const moveDown = (index) => {
    if (index === banners.length - 1) return
    const next = [...banners]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    persistOrder(next)
  }

  const handleDelete = async (banner) => {
    if (!window.confirm('Delete this hero banner? This cannot be undone.')) return

    const res = await fetch(`/api/admin/hero-banners/${banner.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete hero banner.')
      return
    }

    setBanners((prev) => prev.filter((b) => b.id !== banner.id))
  }

  return (
    <div className={style.card}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Preview</th>
            <th>Type</th>
            <th>Title / Link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {banners.length === 0 && (
            <tr className={style.stateRow}>
              <td colSpan={5}>No hero banners found.</td>
            </tr>
          )}

          {banners.map((banner, index) => (
              <tr key={banner.id}>
                <td>
                  <div className={style.rowActions}>
                    <button type="button" className={style.secondaryButton} disabled={index === 0} onClick={() => moveUp(index)} aria-label="Move up">
                      ↑
                    </button>
                    <button type="button" className={style.secondaryButton} disabled={index === banners.length - 1} onClick={() => moveDown(index)} aria-label="Move down">
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <span className={style.avatar}>
                    {banner.desktopImage && <Image src={banner.desktopImage} alt="" width={64} height={40} />}
                  </span>
                </td>
                <td>{banner.type === 'image' ? 'Image Type' : 'Content Type'}</td>
                <td>{banner.type === 'image' ? banner.bannerLink : banner.title}</td>
                <td>
                  <div className={style.rowActions}>
                    <Link href={`/admin/hero-banners/${banner.id}`} className={style.secondaryButton}>
                      Edit
                    </Link>
                    <button type="button" className={style.dangerButton} onClick={() => handleDelete(banner)}>
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
