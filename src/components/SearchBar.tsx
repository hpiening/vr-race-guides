'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export interface SearchItem {
  section: string
  sectionId: string
  text: string
}

type Props = { index: SearchItem[] }

export default function SearchBar({ index }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length > 1
    ? index.filter(item =>
        item.text.toLowerCase().includes(query.toLowerCase())
      ).reduce<SearchItem[]>((acc, item) => {
        // Deduplicate by sectionId
        if (!acc.find(r => r.sectionId === item.sectionId)) acc.push(item)
        return acc
      }, []).slice(0, 8)
    : []

  const scrollTo = useCallback((id: string) => {
    setOpen(false)
    setQuery('')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search guide"
        className="
          fixed bottom-20 right-6 z-50
          flex items-center gap-2
          bg-vr-forest text-vr-cream
          font-label text-xs tracking-[0.15em] uppercase
          px-4 py-3 rounded-full shadow-lg
          hover:bg-vr-deep transition-colors
          print:hidden
        "
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.25"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
        Search
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-vr-forest/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 print:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery('') } }}
        >
          <div className="w-full max-w-xl bg-vr-white rounded-xl shadow-2xl overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-vr-forest/10">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="text-vr-mid shrink-0" aria-hidden="true">
                <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.25"/>
                <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search the race guide…"
                className="flex-1 font-body text-base text-vr-forest placeholder:text-vr-mid/50 outline-none bg-transparent"
              />
              <button
                onClick={() => { setOpen(false); setQuery('') }}
                className="font-micro text-xs tracking-widest uppercase text-vr-mid hover:text-vr-forest transition-colors"
              >
                Close
              </button>
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <ul className="py-2 max-h-80 overflow-y-auto">
                {results.map((r, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollTo(r.sectionId)}
                      className="w-full text-left px-5 py-3.5 hover:bg-vr-offwhite transition-colors"
                    >
                      <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-0.5">
                        {r.section}
                      </p>
                      <p className="font-body text-sm text-vr-forest leading-snug line-clamp-2">
                        {highlight(r.text, query)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.trim().length > 1 ? (
              <p className="px-5 py-6 font-body text-sm text-vr-mid text-center">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <p className="px-5 py-6 font-body text-sm text-vr-mid text-center">
                Type to search schedules, parking, course info, FAQs and more
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function highlight(text: string, query: string): string {
  // Return a plain truncated snippet around the match
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, 120)
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 80)
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
}
