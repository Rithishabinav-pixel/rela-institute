'use client'

import { useEffect, useState } from 'react'

// Animates from 0 to `target` once `start` flips true (see useSectionInView,
// which fires that the moment the surrounding section crosses the middle of
// the viewport) so every counter in a section animates in sync.
export default function AnimatedCounter({ target, start, duration = 1500 }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return

    const startTime = performance.now()
    let frame

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [start, target, duration])

  return <span>{value}</span>
}
