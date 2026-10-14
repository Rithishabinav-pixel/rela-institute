'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './content-admin.module.css'

const SEARCH_DEBOUNCE_MS = 250

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Generic admin listing table shared by Expert Talks and Events.
 *
 * @param {object} props
 * @param {{items:object[], total:number, page:number, pageSize:number, totalPages:number}} props.initial
 * @param {string} props.apiBasePath - e.g. '/api/admin/expert-talks'
 * @param {string} props.editBasePath - e.g. '/admin/expert-talks'
 * @param {string} props.entityLabel - e.g. 'expert talk'
 */
export default function ContentListingClient({ initial, apiBasePath, editBasePath, entityLabel }) {
  const [search, setSearch] = useState('')
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

      fetch(`${apiBasePath}?search=${encodeURIComponent(search)}&page=${page}&pageSize=20`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Could not load ${entityLabel}s`)
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError(`Could not load ${entityLabel}s. Please try again.`)
        })
        .finally(() => {
          if (requestId.current !== currentRequest) return
          setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return

    const res = await fetch(`${apiBasePath}/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || `Could not delete ${entityLabel}.`)
      return
    }

    setResult((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== item.id),
      total: prev.total - 1,
    }))
  }

  const handleToggle = async (item, field) => {
    const nextValue = !item[field]

    setResult((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === item.id ? { ...i, [field]: nextValue } : i)),
    }))

    try {
      const res = await fetch(`${apiBasePath}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: nextValue }),
      })

      if (!res.ok) throw new Error(`Could not update ${entityLabel}`)
    } catch {
      setResult((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === item.id ? { ...i, [field]: item[field] } : i)),
      }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const items = result?.items ?? []
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <div className={style.pageHeader}>
        <div />
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Title</th>
              <th>Date</th>
              <th>Departments</th>
              <th>Doctors</th>
              <th>Quick Search</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={7}>{error}</td>
              </tr>
            )}

            {!error && loading && items.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={7}>Loading…</td>
              </tr>
            )}

            {!error && !loading && items.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={7}>No records found.</td>
              </tr>
            )}

            {!error &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className={style.avatar}>
                      {item.featureType === 'video' ? (
                        'Video'
                      ) : item.featureImage ? (
                        <Image src={item.featureImage} alt="" width={64} height={40} />
                      ) : (
                        '—'
                      )}
                    </span>
                  </td>
                  <td>{item.title}</td>
                  <td>{formatDate(item.publishedAt)}</td>
                  <td>
                    <div className={style.tagList}>
                      {item.departments.map((department) => (
                        <span key={department.id} className={style.tag}>
                          {department.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={style.tagList}>
                      {item.doctors.map((doctor) => (
                        <span key={doctor.id} className={style.tag}>
                          {doctor.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.quickSearch}
                      aria-label={`Include "${item.title}" in Quick Search`}
                      className={`${style.toggle} ${item.quickSearch ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(item, 'quickSearch')}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`${editBasePath}/${item.id}`} className={style.secondaryButton}>
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
