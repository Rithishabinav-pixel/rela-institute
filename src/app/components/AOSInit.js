'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initializes AOS (Animate On Scroll) once, globally, so it is ready to use
// later — no `data-aos` attributes have been added to any element yet.
export default function AOSInit() {
  const pathname = usePathname()

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 80,
    })
  }, [])

  // App Router navigations don't reload the page, so newly-rendered elements
  // on the new route need AOS to recalculate their trigger positions.
  useEffect(() => {
    AOS.refresh()
  }, [pathname])

  return null
}
