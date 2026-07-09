'use client'
import { useEffect } from 'react'

/**
 * Ensures the PDF/print export shows all content. The trailhead theme uses
 * native <details> accordions; modern browsers keep closed-<details> content
 * hidden via content-visibility, which print CSS can't reliably override. So
 * we force every <details> open just before printing, and restore afterwards.
 * Covers the Export PDF button AND the browser's own Ctrl/Cmd+P.
 */
export default function PrintExpand() {
  useEffect(() => {
    let opened: HTMLDetailsElement[] = []
    const before = () => {
      opened = Array.from(document.querySelectorAll<HTMLDetailsElement>('details:not([open])'))
      opened.forEach(d => { d.open = true })
    }
    const after = () => {
      opened.forEach(d => { d.open = false })
      opened = []
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [])
  return null
}
