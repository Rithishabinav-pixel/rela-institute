'use client'

import React, { useMemo, useState } from 'react'
import style from './content-listing.module.css'
import Image from 'next/image'
import Link from 'next/link'
import ArticleImage from '../ArticleImage'

const FALLBACK_IMAGE = '/assets/images/sample-article-img.png'

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Generic public listing (search + department dropdown + Quick Search chips +
 * sort + card grid) shared by Media Articles, Success Stories, Expert Talks,
 * and Events. Reproduces the markup/classNames of the original MediaListing
 * component exactly — only the data source, heading, empty-state text, and
 * card link base path differ per module.
 *
 * @param {object} props
 * @param {object[]} props.items - serialized list items (slug, thumbnailUrl, publishedAt, title, departments)
 * @param {{id:number,name:string}[]} props.allDepartments - every department with >=1 record in this module
 * @param {{id:number,name:string}[]} props.quickSearchDepartments - departments with >=1 Quick-Search-enabled record
 * @param {string} props.basePath - e.g. '/media', '/success-stories', '/expert-talks', '/events'
 * @param {string} props.heading - e.g. 'Media', 'Success Stories'
 * @param {string} props.emptyMessage - e.g. 'No media found.'
 */
export default function ContentListing({
  items,
  allDepartments,
  quickSearchDepartments,
  basePath,
  heading,
  emptyMessage,
}) {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [sort, setSort] = useState('Newest')

  const selectDepartment = (id) => {
    setDepartment(id === '' ? '' : String(id))
  }

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()

    const filtered = items
      .filter((item) => !term || item.title.toLowerCase().includes(term))
      .filter((item) => !department || item.departments.some((d) => String(d.departmentId) === department))

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'A-Z') return a.title.localeCompare(b.title)
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return sort === 'Oldest' ? dateA - dateB : dateB - dateA
    })

    return sorted.map((item) => ({
      slug: item.slug,
      image: item.thumbnailUrl || FALLBACK_IMAGE,
      imageAlt: item.title,
      formattedDate: formatDate(item.publishedAt),
      title: item.title,
    }))
  }, [items, search, department, sort])

  return (
    <>
      <section className={style.topSection}>
        <div className={`container ${style.container}`}>
          <h1 className="common_heading">{heading} </h1>

          <div className={style.quickSearch_container}>
            <h2 className="orange_text">Quick Search</h2>

            <div className={style.quickcategories}>
              <button className={department === '' ? style.active : ''} onClick={() => selectDepartment('')}>
                All
              </button>
              {quickSearchDepartments.map((dept) => (
                <button
                  key={dept.id}
                  className={department === String(dept.id) ? style.active : ''}
                  onClick={() => selectDepartment(dept.id)}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          <div className={style.actions}>
            <div className={`${style.action_button} ${style.search}`}>
              <input
                type="text"
                placeholder="Search by Name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="button">
                <Image src="/assets/images/search-normal.svg" width={32} height={32} alt="" />
              </button>
            </div>

            <div className={`${style.action_button} ${style.dropdown}`}>
              <select value={department} onChange={(event) => setDepartment(event.target.value)}>
                <option value="">All Department</option>
                {allDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${style.action_button} ${style.sort}`}>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className={style.mediaGrid}>
        <div className={`container ${style.container}`}>
          {filteredItems.length === 0 && <p>{emptyMessage}</p>}

          {filteredItems.map((item) => (
            <Link key={item.slug} href={`${basePath}/${item.slug}`} className={style.card}>
              <div className={style.image}>
                <ArticleImage src={item.image} alt={item.imageAlt} />
              </div>
              <div className={style.content}>
                <p className={style.date}>{item.formattedDate}</p>
                <h3>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
