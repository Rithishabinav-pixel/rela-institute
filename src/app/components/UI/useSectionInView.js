'use client'

import { useEffect, useRef, useState } from 'react'

// Fires once, the first time the element attached to the returned ref
// crosses the middle of the viewport, then stops observing so it never
// re-triggers on subsequent scrolling.
export default function useSectionInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
