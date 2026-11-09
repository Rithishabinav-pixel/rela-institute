"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './newsletter.module.css'
import Image from 'next/image'
import Button from '../components/UI/Button'

const BATCH_SIZE = 3
const SEARCH_DEBOUNCE_MS = 300

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function NewsLetterClient({ initial }) {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [items, setItems] = useState(initial.items)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [cursor, setCursor] = useState(initial.nextCursor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastCard, setLastCard] = useState(null)
  const fetchingRef = useRef(false)
  const requestId = useRef(0)

  const loadFirstPage = useCallback((nextSearch, nextSort) => {
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)
    setError('')

    fetch(`/api/newsletters?search=${encodeURIComponent(nextSearch)}&sort=${nextSort}&cursor=0&limit=${BATCH_SIZE}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load newsletters')
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
        setError('Could not load newsletters. Please try again.')
      })
      .finally(() => {
        if (requestId.current !== currentRequest) return
        setLoading(false)
        fetchingRef.current = false
      })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      loadFirstPage(searchInput, sort)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const handleSortChange = (event) => {
    const nextSort = event.target.value
    setSort(nextSort)
    loadFirstPage(search, nextSort)
  }

  const loadMore = useCallback(() => {
    if (fetchingRef.current || !hasMore) return
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)
    setError('')

    fetch(`/api/newsletters?search=${encodeURIComponent(search)}&sort=${sort}&cursor=${cursor}&limit=${BATCH_SIZE}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load newsletters')
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
      .catch(() => {
        if (requestId.current !== currentRequest) return
        setError('Could not load more newsletters. Please try again.')
      })
      .finally(() => {
        if (requestId.current !== currentRequest) return
        setLoading(false)
        fetchingRef.current = false
      })
  }, [search, sort, cursor, hasMore])

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
    <h1 className='common_heading'>Beyond the Headlines at Rela</h1>
  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.newsletterListing}>

 <div className={style.actions}>


      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}

/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>

 <div className={`${style.action_button} ${style.sort}`}>
              <select value={sort} onChange={handleSortChange}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
              </select>
            </div>


    </div>

{error && <p className={style.hint}>{error}</p>}

{!error && !loading && items.length === 0 && <p className={style.hint}>No newsletters found.</p>}

<div className={style.newsletterCards}>

  {items.map((item, index) => (
  <div className={style.card} key={item.id} ref={index === items.length - 1 ? setLastCard : undefined}>
    <Image className={style.featureImg} src={item.featureImage || '/assets/images/sample-newsletter.png'} width={360} height={202} alt=''/>
    <div className={style.content}>
    <p className={style.date}>{formatDate(item.publishedAt)}</p>
    <h2 className={style.title}>{item.title}</h2>
    <Button type="link" classname="orange_btn" text="Download now" link={item.pdfUrl || '#'}/>

    </div>
  </div>
  ))}

</div>

{loading && <p className={style.hint}>Loading…</p>}


</div>



</div>

</section>
</div>


    </>
  )
}
