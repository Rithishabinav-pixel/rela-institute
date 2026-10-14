'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './success-stories.module.css'

const SEARCH_DEBOUNCE_MS = 250

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function SuccessStoriesClient({ initial }) {
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

      fetch(`/api/admin/success-stories?search=${encodeURIComponent(search)}&page=${page}&pageSize=20`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load success stories')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load success stories. Please try again.')
        })
        .finally(() => {
          if (requestId.current !== currentRequest) return
          setLoading(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, page])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleDelete = async (story) => {
    if (!window.confirm(`Delete "${story.title}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/success-stories/${story.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete success story.')
      return
    }

    setResult((prev) => ({
      ...prev,
      stories: prev.stories.filter((s) => s.id !== story.id),
      total: prev.total - 1,
    }))
  }

  const handleToggle = async (story, field) => {
    const nextValue = !story[field]

    setResult((prev) => ({
      ...prev,
      stories: prev.stories.map((s) => (s.id === story.id ? { ...s, [field]: nextValue } : s)),
    }))

    try {
      const res = await fetch(`/api/admin/success-stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: nextValue }),
      })

      if (!res.ok) throw new Error('Could not update success story')
    } catch {
      setResult((prev) => ({
        ...prev,
        stories: prev.stories.map((s) => (s.id === story.id ? { ...s, [field]: story[field] } : s)),
      }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const stories = result?.stories ?? []
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

            {!error && loading && stories.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={7}>Loading success stories…</td>
              </tr>
            )}

            {!error && !loading && stories.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={7}>No success stories found.</td>
              </tr>
            )}

            {!error &&
              stories.map((story) => (
                <tr key={story.id}>
                  <td>
                    <span className={style.avatar}>
                      {story.featureType === 'video' ? (
                        'Video'
                      ) : story.featureImage ? (
                        <Image src={story.featureImage} alt="" width={64} height={40} />
                      ) : (
                        '—'
                      )}
                    </span>
                  </td>
                  <td>{story.title}</td>
                  <td>{formatDate(story.publishedAt)}</td>
                  <td>
                    <div className={style.tagList}>
                      {story.departments.map((department) => (
                        <span key={department.id} className={style.tag}>
                          {department.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={style.tagList}>
                      {story.doctors.map((doctor) => (
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
                      aria-checked={story.quickSearch}
                      aria-label={`Include "${story.title}" in Quick Search`}
                      className={`${style.toggle} ${story.quickSearch ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(story, 'quickSearch')}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`/admin/success-stories/${story.id}`} className={style.secondaryButton}>
                        Edit
                      </Link>
                      <button type="button" className={style.dangerButton} onClick={() => handleDelete(story)}>
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
