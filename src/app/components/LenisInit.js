'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { SMOOTH_SCROLL_ENABLED, SMOOTH_SCROLL_OPTIONS } from '@/lib/smooth-scroll'

gsap.registerPlugin(ScrollTrigger)


export default function LenisInit() {
  const pathname = usePathname()

  useEffect(() => {
    if (!SMOOTH_SCROLL_ENABLED) return

    const lenis = new Lenis(SMOOTH_SCROLL_OPTIONS)
    lenis.on('scroll', ScrollTrigger.update)

    const syncLenisWithGsapTicker = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(syncLenisWithGsapTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(syncLenisWithGsapTicker)
      lenis.destroy()
    }
  }, [])


  useEffect(() => {
    if (!SMOOTH_SCROLL_ENABLED) return
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
