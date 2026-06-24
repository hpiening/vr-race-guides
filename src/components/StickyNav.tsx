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
    return (
      <nav className="sticky top-0 z-50 bg-vr-pine border-b border-vr-cream/[0.14] print:hidden">
        <div className="overflow-x-auto scrollbar-none">
          <ul className="flex min-w-max items-center gap-1 px-4 md:px-7 lg:justify-center">
            {items.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`
                    font-label text-[12px] tracking-[0.14em] uppercase whitespace-nowrap
                    px-3 py-3.5 transition-colors duration-150
                    ${active === item.id ? 'text-vr-sky' : 'text-vr-cream/80 hover:text-vr-sky'}
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
