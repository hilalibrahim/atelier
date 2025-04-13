// components/SmoothScroll.jsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from '@studio-freight/lenis'

export const SmoothScroll = ({ children }) => {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      normalizeWheel: true
    })

    // RAF loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    // Reset scroll position on route change
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}