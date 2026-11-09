'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CategoryManagerPanel from '../../CategoryManagerPanel'
import style from '../../content/content-admin.module.css'

const SEARCH_DEBOUNCE_MS = 250

export default function ResourcesClient({ initial, categories: initialCategories }) {
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
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

      fetch(`/api/admin/resources?${params.toString()}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load resources')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResult(data)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load resources. Please try again.')
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [search, categoryId, page])

  const handleToggleActive = async (item) => {
    const nextValue = !item.isActive
    setResult((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === item.id ? { ...i, isActive: nextValue } : i)) }))

    try {
      const res = await fetch(`/api/admin/resources/${item.id}`, {
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

    const res = await fetch(`/api/admin/resources/${item.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete resource.')
      return
    }

    setResult((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== item.id), total: prev.total - 1 }))
  }

  const items = result?.items ?? []
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <CategoryManagerPanel
        label="Resource"
        apiBasePath="/api/admin/resource-categories"
        items={categories}
        onItemsChange={setCategories}
        hasImage
        uploadPath="/api/admin/resource-categories/upload-image"
      />

      <div className={style.pageHeader}>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className={style.input} value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          className={style.searchInput}
          placeholder="Search by resource title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={style.errorRow}>
                <td colSpan={5}>{error}</td>
              </tr>
            )}

            {!error && items.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={5}>No resources found.</td>
              </tr>
            )}

            {!error &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category?.name}</td>
                  <td>{item.linkType === 'pdf' ? 'PDF' : 'External URL'}</td>
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
                      <Link href={`/admin/resources/${item.id}`} className={style.secondaryButton}>
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
