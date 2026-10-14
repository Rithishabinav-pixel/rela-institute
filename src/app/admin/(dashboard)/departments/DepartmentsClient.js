'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './departments.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function DepartmentsClient({ initial }) {
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

      fetch(`/api/admin/departments?q=${encodeURIComponent(search)}&page=${page}&pageSize=20`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load departments')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load departments. Please try again.')
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

  const handleDelete = async (department) => {
    if (!window.confirm(`Delete ${department.name}? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/departments/${department.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete department.')
      return
    }

    setResult((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== department.id),
      total: prev.total - 1,
    }))
  }

  const handleToggle = async (department, field) => {
    const nextValue = !department[field]

    setResult((prev) => ({
      ...prev,
      departments: prev.departments.map((d) => (d.id === department.id ? { ...d, [field]: nextValue } : d)),
    }))

    try {
      const res = await fetch(`/api/admin/departments/${department.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: nextValue }),
      })

      if (!res.ok) throw new Error('Could not update department')
    } catch {
      setResult((prev) => ({
        ...prev,
        departments: prev.departments.map((d) => (d.id === department.id ? { ...d, [field]: department[field] } : d)),
      }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const departments = result?.departments ?? []
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <div className={style.pageHeader}>
        <div />
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search departments..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Department</th>
              <th>Slug</th>
              <th>Symptoms</th>
              <th>ID</th>
              <th>Show in Homepage</th>
              <th>Center of Excellence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={8}>{error}</td>
              </tr>
            )}

            {!error && loading && departments.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={8}>Loading departments…</td>
              </tr>
            )}

            {!error && !loading && departments.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={8}>No departments found.</td>
              </tr>
            )}

            {!error &&
              departments.map((department) => (
                <tr key={department.id}>
                  <td>
                    <span className={style.iconThumb}>
                      {department.icon && <Image src={department.icon} alt="" width={40} height={40} />}
                    </span>
                  </td>
                  <td>{department.name}</td>
                  <td className={style.idCell}>{department.slug || '—'}</td>
                  <td className={style.idCell}>{department.symptomCount}</td>
                  <td className={style.idCell}>{department.departmentId}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={department.showInHomepage}
                      aria-label={`Show ${department.name} in homepage`}
                      className={`${style.toggle} ${department.showInHomepage ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(department, 'showInHomepage')}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={department.centerOfExcellence}
                      aria-label={`Mark ${department.name} as Center of Excellence`}
                      className={`${style.toggle} ${department.centerOfExcellence ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(department, 'centerOfExcellence')}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`/admin/departments/${department.id}`} className={style.secondaryButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={style.dangerButton}
                        onClick={() => handleDelete(department)}
                      >
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
