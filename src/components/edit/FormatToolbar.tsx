'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Selection-based formatting toolbar for the inline editor. Select text in any
 * copy block and a small B / I / Link bar appears; buttons wrap the selection in
 * Markdown (**bold**, *italic*, [text](url)), which the page renders as real
 * formatting. Rendered once by the /edit page.
 *
 * The Link button opens a picker so anchor links are foolproof: choose a section
 * on the page (inserts the right #id) or paste a web address. No need to know
 * that "parking" lives under #race-morning.
 */

// React tracks textarea values, so set via the native setter + fire `input`
// so the controlled onChange (→ editContext) actually runs.
function setNativeValue(el: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

type Section = { id: string; label: string }

export default function FormatToolbar() {
  const [visible, setVisible] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [url, setUrl] = useState('')
  const targetRef = useRef<HTMLTextAreaElement | null>(null)
  const selRef = useRef<{ start: number; end: number } | null>(null)

  useEffect(() => {
    const onSelectionChange = () => {
      if (linkOpen) return // keep toolbar/picker while choosing a link
      const el = document.activeElement
      if (el instanceof HTMLTextAreaElement && el.classList.contains('editable-field')) {
        const { selectionStart: start, selectionEnd: end } = el
        if (end > start) {
          targetRef.current = el
          selRef.current = { start, end }
          setVisible(true)
          return
        }
      }
      setVisible(false)
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [linkOpen])

  const insert = (wrapped: string) => {
    const el = targetRef.current
    const sel = selRef.current
    if (!el || !sel) return
    const v = el.value
    setNativeValue(el, v.slice(0, sel.start) + wrapped + v.slice(sel.end))
    setVisible(false)
    setLinkOpen(false)
    setUrl('')
  }
  const chosen = () => {
    const el = targetRef.current, sel = selRef.current
    return el && sel ? el.value.slice(sel.start, sel.end) : ''
  }

  const openLink = () => {
    // Collect the page's linkable sections (those with an id + a heading).
    const secs = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
      .map(s => ({ id: s.id, label: (s.querySelector('h1,h2,h3')?.textContent || s.id).trim().replace(/\s+/g, ' ') }))
      .filter(s => s.id)
    setSections(secs)
    setLinkOpen(true)
  }

  if (!visible) return null
  const btn = 'px-3 py-1.5 hover:bg-vr-cream/15 rounded-full leading-none'
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
      <div className="flex items-center gap-1 bg-vr-forest text-vr-cream rounded-full shadow-xl border border-vr-cream/20 px-1.5 py-1">
        <button onMouseDown={e => { e.preventDefault(); insert(`**${chosen()}**`) }} className={`${btn} font-bold`} title="Bold">B</button>
        <button onMouseDown={e => { e.preventDefault(); insert(`*${chosen()}*`) }} className={`${btn} italic font-serif`} title="Italic">I</button>
        <button onMouseDown={e => { e.preventDefault(); linkOpen ? setLinkOpen(false) : openLink() }} className={`${btn} font-label text-xs tracking-[0.15em] uppercase ${linkOpen ? 'bg-vr-cream/15' : ''}`} title="Add link">Link</button>
      </div>

      {linkOpen && (
        <div className="mt-2 w-72 bg-vr-white text-vr-forest rounded-lg shadow-xl border border-vr-forest/15 p-3">
          <p className="font-micro text-[10px] tracking-widest uppercase text-vr-mid mb-1.5">Jump to a section</p>
          <div className="flex flex-wrap gap-1.5 mb-3 max-h-40 overflow-auto">
            {sections.length === 0 && <span className="text-xs text-vr-mid">No sections found</span>}
            {sections.map(s => (
              <button key={s.id} onClick={() => insert(`[${chosen()}](#${s.id})`)} className="font-label text-[11px] tracking-wide uppercase border border-vr-forest/20 rounded-full px-2.5 py-1 hover:bg-vr-offwhite">
                {s.label}
              </button>
            ))}
          </div>
          <p className="font-micro text-[10px] tracking-widest uppercase text-vr-mid mb-1.5">Or a web address</p>
          <div className="flex gap-1.5">
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://…"
              className="flex-1 text-xs border border-vr-forest/20 rounded px-2 py-1.5"
            />
            <button onClick={() => url && insert(`[${chosen()}](${url})`)} className="font-label text-[11px] tracking-wide uppercase bg-vr-forest text-vr-cream rounded px-3 hover:opacity-90">Add</button>
          </div>
        </div>
      )}
    </div>
  )
}
