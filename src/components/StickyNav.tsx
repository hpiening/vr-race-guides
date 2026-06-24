'use client'
import { useState, useEffect } from 'react'

interface NavItem { id: string; label: string }

export default function StickyNav({ items, theme = 'classic' }: { items: NavItem[]; theme?: 'classic' | 'trailhead' }) {
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 }
    )
    items.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (theme === 'trailhead') {
    const openSearch = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
    return (
      <nav className="sticky top-0 z-50 bg-vr-pine border-b border-vr-cream/[0.14] print:hidden">
        <div className="flex items-center gap-4 md:gap-6 px-4 md:px-7 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/vr-shield.png" alt="Vacation Races" className="h-[26px] w-auto shrink-0" />
          <div className="flex gap-4 md:gap-[22px] flex-1 overflow-x-auto scrollbar-none">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`
                  font-label text-[12px] tracking-[0.14em] uppercase whitespace-nowrap
                  py-1 transition-colors duration-150
                  ${active === item.id ? 'text-vr-sky' : 'text-vr-cream/80 hover:text-vr-sky'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-2.5 shrink-0">
            <button
              onClick={openSearch}
              className="flex items-center gap-1.5 bg-transparent border border-vr-cream/35 text-vr-cream font-label text-[11px] tracking-[0.12em] uppercase px-3 py-2 rounded-full hover:border-vr-sky hover:text-vr-sky transition-colors"
            >
              <span aria-hidden="true">⌕</span> Search
            </button>
            <button
              onClick={() => window.print()}
              className="bg-vr-forest border border-vr-forest text-vr-cream font-label text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Export PDF
            </button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-vr-white border-b border-vr-forest/10 shadow-sm">
      <div className="overflow-x-auto scrollbar-none">
        <ul className="flex min-w-max px-4 md:px-8 lg:justify-center">
          {items.map(item => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`
                  font-label text-xs tracking-[0.15em] uppercase
                  px-4 py-4 whitespace-nowrap transition-colors duration-150
                  border-b-2
                  ${active === item.id
                    ? 'text-vr-forest border-vr-forest'
                    : 'text-vr-mid border-transparent hover:text-vr-forest hover:border-vr-forest/30'
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
