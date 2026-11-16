"use client"

import React, { useEffect, useRef, useState } from 'react'
import style from './search.module.css'
import Image from 'next/image'
import Button from '../components/UI/Button'

const PAGE_SIZE = 10
const DEBOUNCE_MS = 350

export default function SearchClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const requestId = useRef(0)

  useEffect(() => {
    const term = query.trim()
    if (!term) return

    const timer = setTimeout(() => {
      const currentRequest = ++requestId.current
      setLoading(true)
      setError('')

      fetch(`/api/search?q=${encodeURIComponent(term)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Could not load search results')
          return res.json()
        })
        .then((data) => {
          if (requestId.current !== currentRequest) return
          setResults(data.results || [])
          setVisibleCount(PAGE_SIZE)
        })
        .catch(() => {
          if (requestId.current !== currentRequest) return
          setError('Could not load search results. Please try again.')
        })
        .finally(() => {
          if (requestId.current !== currentRequest) return
          setLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  const handleQueryChange = (event) => {
    const value = event.target.value
    setQuery(value)
    if (!value.trim()) {
      requestId.current++
      setResults([])
      setLoading(false)
      setError('')
      setVisibleCount(PAGE_SIZE)
    }
  }

  const trimmedQuery = query.trim()
  const visibleResults = results.slice(0, visibleCount)
  const hasMore = visibleCount < results.length

  return (
    <section className={`common_section ${style.search_section}`}>
      <div className={`container section_container column ${style.container}`}>
        <div className={style.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleQueryChange}
          />
          <button type="button">
            <Image src="/assets/images/search.svg" width={32} height={32} alt="" />
          </button>
        </div>

        {loading && <p>Searching…</p>}
        {error && <p>{error}</p>}

        {!loading && !error && trimmedQuery && results.length > 0 && (
          <div className={style.searchCards}>
            {visibleResults.map((result, index) => (
              <div className={style.card} key={`${result.link}-${index}`}>
                <div className={style.inner}>
                  <div className={style.content}>
                    <h3 className={style.title}>{result.title}</h3>
                    <p>{result.description}</p>
                    <span>{result.category}</span>
                  </div>
                  <Button classname="orange_btn" link={result.link} text="View detail" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && trimmedQuery && results.length === 0 && (
          <p>No results found for &quot;{trimmedQuery}&quot;</p>
        )}

        {!loading && !error && hasMore && (
          <button
            type="button"
            className="common_btn orange_btn"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Load More
          </button>
        )}
      </div>
    </section>
  )
}
