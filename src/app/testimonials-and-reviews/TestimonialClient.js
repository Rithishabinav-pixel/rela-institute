"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './testimonial.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TestimonialCard from './TestimonialCard'

const BATCH_SIZE = 3
const SEARCH_DEBOUNCE_MS = 300

export default function TestimonialClient({ initial, categories }) {

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState(null)
  const [sort, setSort] = useState('newest')
  const [items, setItems] = useState(initial.items)
  const [hasMore, setHasMore] = useState(initial.hasMore)
  const [cursor, setCursor] = useState(initial.nextCursor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastCard, setLastCard] = useState(null)
  const [activePopup,setActivePopup] = useState(null)
  const fetchingRef = useRef(false)
  const requestId = useRef(0)

  const loadFirstPage = useCallback((nextSearch, nextCategoryId, nextSort) => {
    const currentRequest = ++requestId.current
    fetchingRef.current = true
    setLoading(true)
    setError('')

    const params = new URLSearchParams({ search: nextSearch, sort: nextSort, cursor: '0', limit: String(BATCH_SIZE) })
    if (nextCategoryId) params.set('categoryId', nextCategoryId)

    fetch(`/api/testimonials?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load testimonials')
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
        setError('Could not load testimonials. Please try again.')
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
      loadFirstPage(searchInput, categoryId, sort)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const selectCategory = (id) => {
    setCategoryId(id)
    loadFirstPage(search, id, sort)
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

    fetch(`/api/testimonials?${params.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Could not load testimonials')
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
    <Link href="/testimonials-and-reviews" className={style.active}>Testimonials and Reviews</Link>
    <Link href="/patient-experience" >Patient Experience</Link>
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

 <div className={`${style.action_button} ${style.sort}`}>
              <select value={sort} onChange={handleSortChange}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A-Z</option>
              </select>
            </div>


    </div>

{error && <p className={style.hint}>{error}</p>}
{!error && !loading && items.length === 0 && <p className={style.hint}>No testimonials found.</p>}

<div className={style.testimonialCards}>
  {items.map((item, index) => (
    <TestimonialCard key={item.id} data={{ title: item.title, content: item.content, name: item.userName, image: item.userImage }} index={index} setActivePopup={setActivePopup} cardStyle={`testimonial_grid`}/>
  ))}
</div>
<div ref={setLastCard} aria-hidden="true" />

{loading && <p className={style.hint}>Loading…</p>}

</div>



</div>

</section>
</div>


{/* popup --------------------- */}

{activePopup !== null && items[activePopup] &&
    <div className={style.popup}>
      <div className={style.overlay} onClick={()=>setActivePopup(null)}></div>

      <div className={style.container}>

        <button  className={style.closeBtn} onClick={()=>setActivePopup(null)}> <Image src="/assets/images/close.svg" width={24} height={24} alt="Close" /> </button>


        <TestimonialCard data={{ title: items[activePopup].title, content: items[activePopup].content, name: items[activePopup].userName, image: items[activePopup].userImage }} cardStyle={`popup_card`}/>

      </div>
    </div>

}
    </>
  )
}
