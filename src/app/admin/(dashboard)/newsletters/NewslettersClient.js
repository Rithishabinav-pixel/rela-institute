'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from '../../content/content-admin.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function NewslettersClient({ initial }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentRequest = ++requestId.current
      setLoading(true)
      setError('')

      fetch(`/api/admin/newsletters?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}&pageSize=20`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load newsletters')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load newsletters. Please try again.')
        })
        .finally(() => {
          if (requestId.current !== currentRequest) return
          setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, sort, page])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleSortChange = (event) => {
    setSort(event.target.value)
    setPage(1)
  }

  const handleToggleActive = async (item) => {
    const nextValue = !item.isActive
    setResult((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, isActive: nextValue } : i)) }))

    try {
      const res = await fetch(`/api/admin/newsletters/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextValue }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      setResult((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, isActive: item.isActive } : i)) }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/newsletters/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete newsletter.')
      return
    }

    setResult((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== item.id), total: prev.total - 1 }))
  }

  const items = result?.items ?? []
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <div className={style.pageHeader}>
        <div />
        <div style={{ display: 'flex', gap: 12 }}>
          <select className={style.input} value={sort} onChange={handleSortChange}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
          </select>
          <input
            type="text"
            className={style.searchInput}
            placeholder="Search by title..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Published</th>
              <th>PDF</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={6}>{error}</td>
              </tr>
            )}

            {!error && !loading && items.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={6}>No newsletters found.</td>
              </tr>
            )}

            {!error &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={style.avatar}>
                      {item.featureImage && <Image src={item.featureImage} alt="" width={64} height={40} />}
                    </span>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'}</td>
                  <td>
                    {item.pdfUrl ? (
                      <a href={item.pdfUrl} target="_blank" rel="noreferrer" className={style.secondaryButton}>
                        View PDF
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      className={`${style.toggle} ${item.isActive ? style.toggleOn : ''}`}
                      onClick={() => handleToggleActive(item)}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`/admin/newsletters/${item.id}`} className={style.secondaryButton}>
                        Edit
                      </Link>
                      <button type="button" className={style.dangerButton} onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={style.pagination}>
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <span className={style.pageInfo}>
              Page {page} of {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}
