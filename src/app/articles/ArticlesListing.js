'use client'

import React, { useEffect, useMemo, useState } from 'react'
import style from './article.module.css'
import Image from 'next/image'
import Link from 'next/link'
import ArticleImage from './ArticleImage'

const BATCH_SIZE = 16
const QUICK_SEARCH_LIMIT = 12

export default function ArticlesListing({ articles, departments }) {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState(null)
  const [sort, setSort] = useState('')
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const [lastCard, setLastCard] = useState(null)

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase()

    const result = articles.filter(
      (article) =>
        (!term || article.title.toLowerCase().includes(term)) &&
        (departmentId === null || article.departments.includes(departmentId))
    )

    if (sort === 'Newest') result.sort((a, b) => b.date.localeCompare(a.date))
    if (sort === 'Oldest') result.sort((a, b) => a.date.localeCompare(b.date))
    if (sort === 'A-Z') result.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))

    return result
  }, [articles, search, departmentId, sort])

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  useEffect(() => {
    if (!lastCard || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((count) => count + BATCH_SIZE)
      },
      { rootMargin: '0px 0px 300px 0px' }
    )

    observer.observe(lastCard)
    return () => observer.disconnect()
  }, [lastCard, hasMore])

  const applySearch = () => {
    setSearch(searchInput)
    setVisibleCount(BATCH_SIZE)
  }

  const selectDepartment = (id) => {
    setDepartmentId(id)
    setVisibleCount(BATCH_SIZE)
  }

  const selectSort = (value) => {
    setSort(value)
    setVisibleCount(BATCH_SIZE)
  }

  return (
    <>


<section className={style.topSection}>
  <div className={`container ${style.container}`}>
    <h1 className='common_heading'>Articles</h1>

    <div className={style.quickSearch_container}>
      <h2 className='orange_text'>Quick Search</h2>

      <div className={style.quickcategories}>
        <button className={departmentId === null ? style.active : undefined} onClick={() => selectDepartment(null)}>All</button>
        {departments.slice(0, QUICK_SEARCH_LIMIT).map((department) => (
          <button
            key={department.id}
            className={departmentId === department.id ? style.active : undefined}
            onClick={() => selectDepartment(department.id)}
          >
            {department.name}
          </button>
        ))}
      </div>
    </div>

    <div className={style.actions}>

      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') applySearch()
  }}
/>
<button onClick={applySearch}> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>

      <div className={`${style.action_button} ${style.dropdown}`}>
<select
  value={departmentId ?? ''}
  onChange={(e) => selectDepartment(e.target.value === '' ? null : Number(e.target.value))}
>
  <option value="">All Department</option>
 {[...departments]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((department) => (
    <option key={department.id} value={department.id}>
      {department.name}
    </option>
  ))}

  
</select>
      </div>

       <div className={`${style.action_button} ${style.sort}`}>
<select value={sort} onChange={(e) => selectSort(e.target.value)}>
  <option disabled value="">Sort By</option>
  <option   value="Newest">Newest</option>
  <option   value="Oldest">Oldest</option>
  <option   value="A-Z">A-Z</option>

</select>
      </div>

    </div>

  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

  {filteredArticles.length === 0 && <p>No articles found.</p>}

  {visibleArticles.map((article, index) => (
  <Link
    key={article.id}
    href={article.link}
    className={style.card}
    ref={hasMore && index === visibleArticles.length - 1 ? setLastCard : undefined}
  >
    <div className={style.image}>
      <ArticleImage src={article.image} alt={article.imageAlt}/>
    </div>
    <div className={style.content}>
      <p className={style.date}>{article.formattedDate}</p>
      <h3>{article.title}</h3>
    </div>
  </Link>
  ))}

</div>

</section>

    </>
  )
}
