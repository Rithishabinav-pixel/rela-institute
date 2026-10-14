'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function ArticleImage({ src, alt, width = 360, height = 202, fallback = '/assets/images/sample-article-img.png' }) {
  const [failed, setFailed] = useState(false)

  const detectEarlyError = (img) => {
    if (img && !failed && img.complete && img.naturalWidth === 0) setFailed(true)
  }

  return (
    <Image
      ref={detectEarlyError}
      src={failed ? fallback : src}
      width={width}
      height={height}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
}
