"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './resources.module.css'
import Image from 'next/image'
import ResourcesCard from './ResourcesCard'

const BATCH_SIZE = 3
const SEARCH_DEBOUNCE_MS = 300

export default function ResourcesClient({ initial, categories }) {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sort, setSort] = useState('newest')
  const [selected,setSelected] = useState('');

  const [items, setItems] = useState(initial.items)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [cursor, setCursor] = useState(initial.nextCursor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastCard, setLastCard] = useState(null)
  const fetchingRef = useRef(false)
  const requestId = useRef(0)

  const loadFirstPage = useCallback((nextSearch, nextCategoryId, nextSort) => {
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)
    setError('')

    const params = new URLSearchParams({ search: nextSearch, sort: nextSort, cursor: '0', limit: String(BATCH_SIZE) })
    if (nextCategoryId) params.set('categoryId', nextCategoryId)

    fetch(`/api/resources?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load resources')
        return res.json()
      })
      .then((data) => {
        if (requestId.current !== currentRequest) return
        setItems(data.items)
        setHasMore(data.hasMore)
        setCursor(data.nextCursor)
      })
      .catch(() => {
        if (requestId.current !== currentRequest) return
        setError('Could not load resources. Please try again.')
      })
      .finally(() => {
        if (requestId.current !== currentRequest) return
        setLoading(false)
        fetchingRef.current = false
      })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim()
      setSearch(nextSearch)
      loadFirstPage(nextSearch, categoryId, sort)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const handleCategoryChange = (event) => {
    const nextCategoryId = event.target.value;
    const selectedText = event.target.selectedOptions[0].text;
    setSelected(selectedText)
    setCategoryId(nextCategoryId)
    loadFirstPage(search, nextCategoryId, sort)
  }

  const handleSortChange = (event) => {
    const nextSort = event.target.value
    setSort(nextSort)
    loadFirstPage(search, categoryId, nextSort)
  }

  const loadMore = useCallback(() => {
    if (fetchingRef.current || !hasMore) return
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)

    const params = new URLSearchParams({ search, sort, cursor: String(cursor), limit: String(BATCH_SIZE) })
    if (categoryId) params.set('categoryId', categoryId)

    fetch(`/api/resources?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load resources')
        return res.json()
      })
      .then((data) => {
        if (requestId.current !== currentRequest) return
        setItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          return [...prev, ...data.items.filter((item) => !existingIds.has(item.id))]
        })
        setHasMore(data.hasMore)
        setCursor(data.nextCursor)
      })
      .catch(() => {})
      .finally(() => {
        if (requestId.current !== currentRequest) return
        setLoading(false)
        fetchingRef.current = false
      })
  }, [search, sort, categoryId, cursor, hasMore])

  useEffect(() => {
    if (!lastCard || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '0px 0px 300px 0px' }
    )

    observer.observe(lastCard)
    return () => observer.disconnect()
  }, [lastCard, hasMore, loadMore])

  return (
      <>

<div className={`static_page`}>
<section className={style.topSection}>
  <div className={`container ${style.container}`}>
   <h1 className="common_heading">
  Resource Centre {selected && selected !== "All Department" && `For ${selected}`}</h1>
  </div>
</section>

<section className={style.resourcesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.resourcesListing}>

 <div className={style.actions}>

      {/* <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}

/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div> */}

      <div className={`${style.action_button} ${style.dropdown}`}>
<select value={categoryId} onChange={handleCategoryChange}>
  <option value="">All Department</option>
  {categories.map((c) => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
</select>
      </div>

       <div className={`${style.action_button} ${style.sort}`}>
              <select value={sort} onChange={handleSortChange}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
              </select>
            </div>


    </div>


</div>

{error && <p className={style.hint}>{error}</p>}
{!error && !loading && items.length === 0 && <p className={style.hint}>No resources found.</p>}

{/* cards  */}
<div className={style.resourcesCards}>
  {items.map((item)=>(
  <ResourcesCard key={item.id} resources={item} cardStyle={`resourcesGridCard`}/>
  ))}
</div>
<div ref={setLastCard} aria-hidden="true" />

{loading && <p className={style.hint}>Loading…</p>}

</div>

</section>
</div>
    </>
  )
}
