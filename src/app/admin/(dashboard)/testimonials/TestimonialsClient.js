'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CategoryManagerPanel from '../../CategoryManagerPanel'
import style from '../../content/content-admin.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function TestimonialsClient({ initial, categories: initialCategories }) {
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [international, setInternational] = useState('')
  const [featured, setFeatured] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(initial)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentRequest = ++requestId.current
      setError('')

      const params = new URLSearchParams({ search, page: String(page), pageSize: '20' })
      if (categoryId) params.set('categoryId', categoryId)
      if (international) params.set('international', international)
      if (featured) params.set('featured', featured)

      fetch(`/api/admin/testimonials?${params.toString()}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load testimonials')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load testimonials. Please try again.')
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, categoryId, international, featured, page])

  const handleToggleField = async (item, field) => {
    const nextValue = !item[field]
    setResult((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, [field]: nextValue } : i)) }))

    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value: nextValue }),
      })
      if (!res.ok) throw new Error('failed')
    } catch {
      setResult((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, [field]: item[field] } : i)) }))
      window.alert('Could not save the change. Please try again.')
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete testimonial from "${item.userName}"? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/testimonials/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete testimonial.')
      return
    }

    setResult((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== item.id), total: prev.total - 1 }))
  }

  const items = result?.items ?? []
  const totalPages = result?.totalPages ?? 1
  const resetPage = (setter) => (value) => { setter(value); setPage(1) }

  return (
    <>
      <CategoryManagerPanel
        label="Testimonial"
        apiBasePath="/api/admin/testimonial-categories"
        items={categories}
        onItemsChange={setCategories}
      />

      <div className={style.pageHeader}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <select className={style.input} value={categoryId} onChange={(e) => resetPage(setCategoryId)(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className={style.input} value={international} onChange={(e) => resetPage(setInternational)(e.target.value)}>
            <option value="">International: Any</option>
            <option value="true">International Only</option>
            <option value="false">Non-International Only</option>
          </select>
          <select className={style.input} value={featured} onChange={(e) => resetPage(setFeatured)(e.target.value)}>
            <option value="">Featured: Any</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
        </div>
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search by title or user name..."
          value={search}
          onChange={(e) => resetPage(setSearch)(e.target.value)}
        />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Title</th>
              <th>Category</th>
              <th>International</th>
              <th>Featured</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={7}>{error}</td>
              </tr>
            )}

            {!error && items.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={7}>No testimonials found.</td>
              </tr>
            )}

            {!error &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={style.avatar} style={{ width: 32, height: 32 }}>
                        {item.userImage && <Image src={item.userImage} alt="" width={32} height={32} />}
                      </span>
                      {item.userName}
                    </div>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category?.name}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isInternational}
                      className={`${style.toggle} ${item.isInternational ? style.toggleOn : ''}`}
                      onClick={() => handleToggleField(item, 'isInternational')}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isFeatured}
                      className={`${style.toggle} ${item.isFeatured ? style.toggleOn : ''}`}
                      onClick={() => handleToggleField(item, 'isFeatured')}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isActive}
                      className={`${style.toggle} ${item.isActive ? style.toggleOn : ''}`}
                      onClick={() => handleToggleField(item, 'isActive')}
                    />
                  </td>
                  <td>
                    <div className={style.rowActions}>
                      <Link href={`/admin/testimonials/${item.id}`} className={style.secondaryButton}>
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
