"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './testimonial.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TestimonialCard from './TestimonialCard'
import Popup from './Popup'

const BATCH_SIZE = 3
const SEARCH_DEBOUNCE_MS = 300

export default function TestimonialClient({ initial, categories }) {

 const [searchInput, setSearchInput] = useState('')
 const [search, setSearch] = useState('')
 const [categoryId, setCategoryId] = useState(null)
 const [items, setItems] = useState(initial.items)
 const [hasMore, setHasMore] = useState(initial.hasMore)
 const [cursor, setCursor] = useState(initial.nextCursor)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const [lastCard, setLastCard] = useState(null)
 const [activeVideo,setActiveVideo] = useState(0);
 const [popup,setPopup] = useState(false)
 const fetchingRef = useRef(false)
 const requestId = useRef(0)

  const loadFirstPage = useCallback((nextSearch, nextCategoryId) => {
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)
    setError('')

    const params = new URLSearchParams({ search: nextSearch, cursor: '0', limit: String(BATCH_SIZE) })
    if (nextCategoryId) params.set('categoryId', nextCategoryId)

    fetch(`/api/patient-experience?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load patient experiences')
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
        setError('Could not load patient experiences. Please try again.')
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
      loadFirstPage(searchInput, categoryId)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const selectCategory = (id) => {
    setCategoryId(id)
    loadFirstPage(search, id)
  }

  const loadMore = useCallback(() => {
    if (fetchingRef.current || !hasMore) return
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)

    const params = new URLSearchParams({ search, cursor: String(cursor), limit: String(BATCH_SIZE) })
    if (categoryId) params.set('categoryId', categoryId)

    fetch(`/api/patient-experience?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load patient experiences')
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
  }, [search, categoryId, cursor, hasMore])

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
      <h1 className='common_heading'>Real Stories. <span>Real Care.</span></h1>
    <div className={style.quickSearch_container}>
      <h2 className='orange_text'>Quick Search</h2>

      <div className={style.quickcategories}>
        <button className={categoryId === null ? style.active : undefined} onClick={() => selectCategory(null)}>All</button>
        {categories.map((c) => (
          <button key={c.id} className={categoryId === c.id ? style.active : undefined} onClick={() => selectCategory(c.id)}>{c.name}</button>
        ))}
      </div>
    </div>
  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.doctorsListing}>

 <div className={style.actions}>

  <div className={`${style.action_button} ${style.tabs}`}>
    <Link href="/testimonials-and-reviews" >Testimonials and Reviews</Link>
    <Link href="/patient-experience" className={style.active}>Patient Experience</Link>
  </div>

      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}

/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>


    </div>

{error && <p className={style.hint}>{error}</p>}
{!error && !loading && items.length === 0 && <p className={style.hint}>No patient experiences found.</p>}

<div className={style.testimonialCards}>
  {items.map((item,index)=>(
    <TestimonialCard key={item.id} data={{ featureImage: item.featureImage, name: item.patientName }} activeVideo={index} setPopup={setPopup} setActiveVideo={setActiveVideo} cardStyle={`testimonial_grid`}/>
  ))}
</div>
<div ref={setLastCard} aria-hidden="true" />

{loading && <p className={style.hint}>Loading…</p>}


</div>



</div>

</section>
</div>

{popup &&
<Popup videoUrl={items[activeVideo]?.videoUrl}  activeVideo={activeVideo} setPopup={setPopup} setActiveVideo={setActiveVideo} length={items.length}/>
}
    </>
  )
}
