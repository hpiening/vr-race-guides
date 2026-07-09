'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Selection-based formatting toolbar for the inline editor. When you select
 * text inside any editable field, a small B / I / Link bar appears; clicking a
 * button wraps the selection in Markdown (**bold**, *italic*, [text](url)),
 * which the page renders as real formatting. Rendered once by the /edit page.
 *
 * Only appears when there IS a selection, so short fields (times, names) aren't
 * cluttered — you naturally only select text in copy blocks.
 */

// React tracks textarea values, so set via the native setter + fire `input`
// so the controlled onChange (→ editContext) actually runs.
function setNativeValue(el: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export default function FormatToolbar() {
  const [visible, setVisible] = useState(false)
  const targetRef = useRef<HTMLTextAreaElement | null>(null)
  const selRef = useRef<{ start: number; end: number } | null>(null)

  useEffect(() => {
    const onSelectionChange = () => {
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
  }, [])

  const apply = (kind: 'bold' | 'italic' | 'link') => {
    const el = targetRef.current
    const sel = selRef.current
    if (!el || !sel) return
    const v = el.value
    const chosen = v.slice(sel.start, sel.end)
    let wrapped: string
    if (kind === 'bold') wrapped = `**${chosen}**`
    else if (kind === 'italic') wrapped = `*${chosen}*`
    else {
      const url = window.prompt('Link to (URL, or #section-name to jump within the page):', 'https://')
      if (!url) return
      wrapped = `[${chosen}](${url})`
    }
    setNativeValue(el, v.slice(0, sel.start) + wrapped + v.slice(sel.end))
    setVisible(false)
  }

  if (!visible) return null
  const btn = 'px-3 py-1.5 hover:bg-vr-cream/15 rounded-full leading-none'
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 bg-vr-forest text-vr-cream rounded-full shadow-xl border border-vr-cream/20 px-1.5 py-1">
      {/* onMouseDown + preventDefault keeps the textarea focused/selected while clicking */}
      <button onMouseDown={e => { e.preventDefault(); apply('bold') }} className={`${btn} font-bold`} title="Bold">B</button>
      <button onMouseDown={e => { e.preventDefault(); apply('italic') }} className={`${btn} italic font-serif`} title="Italic">I</button>
      <button onMouseDown={e => { e.preventDefault(); apply('link') }} className={`${btn} font-label text-xs tracking-[0.15em] uppercase`} title="Add link">Link</button>
    </div>
  )
}
