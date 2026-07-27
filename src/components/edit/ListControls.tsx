'use client'
import { useEditOptional } from '@/lib/editContext'

/**
 * Reorder/remove controls for an item in a list. Renders nothing outside edit
 * mode. Uses currentColor opacity so it reads on both light and dark sections.
 */
export function ListControls({ path, index, count }: { path: string; index: number; count: number }) {
  const ctx = useEditOptional()
  if (!ctx?.editing) return null
  // Accent colour (not currentColor): the reorder arrows must stay legible on
  // BOTH light cards (sponsor tiles) and dark cards (schedule/course tiles).
  // currentColor inherited near-black body text and vanished on dark sections.
  const btn = 'px-1.5 text-sm leading-none text-vr-sky opacity-80 hover:opacity-100 disabled:opacity-25'
  return (
    <span className="shrink-0 inline-flex items-center gap-0.5 align-middle select-none">
      <button className={btn} disabled={index === 0} onClick={() => ctx.listMove(path, index, -1)} title="Move up" aria-label="Move up">↑</button>
      <button className={btn} disabled={index === count - 1} onClick={() => ctx.listMove(path, index, 1)} title="Move down" aria-label="Move down">↓</button>
      <button className="px-1.5 text-sm leading-none text-red-500 opacity-70 hover:opacity-100" onClick={() => ctx.listRemove(path, index)} title="Remove" aria-label="Remove">✕</button>
    </span>
  )
}

/** "+ Add …" button for a list. Renders nothing outside edit mode. */
export function AddButton({ path, item, label }: { path: string; item: unknown; label: string }) {
  const ctx = useEditOptional()
  if (!ctx?.editing) return null
  return (
    <button
      onClick={() => ctx.listAdd(path, item)}
      className="mt-4 font-label text-xs tracking-[0.15em] uppercase text-vr-floral border border-vr-floral/40 rounded-full px-4 py-2 hover:bg-vr-floral/10"
    >
      + {label}
    </button>
  )
}
