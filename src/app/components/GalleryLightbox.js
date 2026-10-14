'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import style from './GalleryLightbox.module.css'

/**
 * Renders a gallery grid using the caller's existing markup/classNames (so the
 * host page's CSS is untouched) and adds a click-to-open lightbox overlay on top.
 */
export default function GalleryLightbox({ images, galleryClassName, cardsClassName, imageClassName }) {
  const [openIndex, setOpenIndex] = useState(null)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)

  const isOpen = openIndex !== null

  const openAt = (index, event) => {
    triggerRef.current = event?.currentTarget ?? null
    setOpenIndex(index)
  }

  const close = () => {
    setOpenIndex(null)
    triggerRef.current?.focus?.()
  }

  const showPrev = () => setOpenIndex((i) => (i - 1 + images.length) % images.length)
  const showNext = () => setOpenIndex((i) => (i + 1) % images.length)

  useEffect(() => {
    if (!isOpen) return

    dialogRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowLeft') showPrev()
      else if (event.key === 'ArrowRight') showNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, images.length])

  if (!images || images.length === 0) return null

  const current = isOpen ? images[openIndex] : null

  return (
    <>
      <div className={galleryClassName}>
        <h2>Prints</h2>
        <div className={cardsClassName}>
          {images.map((image, index) => (
            <div
              className={imageClassName}
              key={image.id}
              role="button"
              tabIndex={0}
              aria-label={`Open image ${index + 1} of ${images.length}${image.altText ? `: ${image.altText}` : ''}`}
              onClick={(event) => openAt(index, event)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openAt(index, event)
                }
              }}
            >
              <Image src={image.imagePath} alt={image.altText || ''} width={360} height={360} />
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className={style.backdrop}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery viewer"
        >
          <div
            className={style.dialog}
            ref={dialogRef}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className={style.closeButton} onClick={close} aria-label="Close gallery">
              ×
            </button>

            {images.length > 1 && (
              <button
                type="button"
                className={`${style.navButton} ${style.prevButton}`}
                onClick={showPrev}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <div className={style.imageWrap}>
              <Image
                key={current.id}
                src={current.imagePath}
                alt={current.altText || ''}
                fill
                sizes="90vw"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                className={`${style.navButton} ${style.nextButton}`}
                onClick={showNext}
                aria-label="Next image"
              >
                ›
              </button>
            )}

            {images.length > 1 && (
              <p className={style.counter}>
                {openIndex + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
