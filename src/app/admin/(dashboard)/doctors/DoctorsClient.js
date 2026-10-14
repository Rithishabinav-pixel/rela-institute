'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import style from './doctors.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function DoctorsClient({ initial }) {
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

      fetch(`/api/admin/doctors?search=${encodeURIComponent(search)}&page=${page}&pageSize=20`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load doctors')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load doctors. Please try again.')
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

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Delete ${doctor.name}? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/doctors/${doctor.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete doctor.')
      return
    }

    setResult((prev) => ({
      ...prev,
      doctors: prev.doctors.filter((d) => d.id !== doctor.id),
      total: prev.total - 1,
    }))
  }

  const handleToggle = async (doctor, field) => {
    const nextValue = !doctor[field]

    setResult((prev) => ({
      ...prev,
      doctors: prev.doctors.map((d) => (d.id === doctor.id ? { ...d, [field]: nextValue } : d)),
    }))

    try {
      const res = await fetch(`/api/admin/doctors/${doctor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: nextValue }),
      })

      if (!res.ok) throw new Error('Could not update doctor')
    } catch {
      setResult((prev) => ({
        ...prev,
        doctors: prev.doctors.map((d) => (d.id === doctor.id ? { ...d, [field]: doctor[field] } : d)),
      }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const doctors = result?.doctors ?? []
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <div className={style.pageHeader}>
        <div />
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search Doctor..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Education</th>
              <th>Departments</th>
              <th>Speciality</th>
              <th>Position</th>
              <th>Main Position</th>
              <th>Show in Homepage</th>
              <th>Quick Search</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={10}>{error}</td>
              </tr>
            )}

            {!error && loading && doctors.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={10}>Loading doctors…</td>
              </tr>
            )}

            {!error && !loading && doctors.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={10}>No doctors found.</td>
              </tr>
            )}

            {!error &&
              doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>
                    <span className={style.avatar}>
                      <Image
                        src={doctor.image || '/assets/images/doc-sample-img.png'}
                        alt={doctor.name}
                        width={44}
                        height={52}
                      />
                    </span>
                  </td>
                  <td>{doctor.name}</td>
                  <td>{doctor.education}</td>
                  <td>
                    <div className={style.tagList}>
                      {doctor.departments.map((department) => (
                        <span key={department.id} className={style.tag}>
                          {department.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{doctor.speciality?.name}</td>
                  <td>{doctor.position}</td>
                  <td>{doctor.mainPosition}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={doctor.showInHomepage}
                      aria-label={`Show ${doctor.name} in homepage`}
                      className={`${style.toggle} ${doctor.showInHomepage ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(doctor, 'showInHomepage')}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={doctor.quickSearch}
                      aria-label={`Include ${doctor.name} in Quick Search`}
                      className={`${style.toggle} ${doctor.quickSearch ? style.toggleOn : ''}`}
                      onClick={() => handleToggle(doctor, 'quickSearch')}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`/admin/doctors/${doctor.id}`} className={style.secondaryButton}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={style.dangerButton}
                        onClick={() => handleDelete(doctor)}
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
