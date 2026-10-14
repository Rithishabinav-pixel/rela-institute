'use client'

import { useEffect, useRef } from 'react'
import style from './content-detail.module.css'
import { toLocalArticleLinks } from '@/app/articles/wordpress'

/**
 * Generic rich-HTML content renderer shared by Media Articles, Success
 * Stories, Expert Talks, and Events (previously duplicated as MediaContent /
 * StoryContent). Rewrites any relainstitute.com article links to local
 * `/articles/<slug>` paths and wires up the ez-toc table-of-contents toggle
 * when that WordPress markup happens to be present in the content.
 */
export default function ContentRichText({ content }) {
  const contentRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!contentRef.current) return

      const tableHead = contentRef.current.querySelector('.ez-toc-title-container')
      const tableBody = contentRef.current.querySelector('nav')

      if (!tableHead || !tableBody) return

      const handleClick = () => {
        tableBody.classList.toggle('active')
      }

      tableHead.addEventListener('click', handleClick)

      return () => {
        tableHead.removeEventListener('click', handleClick)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  return (
    <div
      className={style.articleContents}
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: toLocalArticleLinks(content) }}
    />
  )
}
