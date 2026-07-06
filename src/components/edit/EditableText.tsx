'use client'
import { useLayoutEffect, useRef, ElementType } from 'react'
import { useEditOptional } from '@/lib/editContext'
import { hasMarkdown, renderMarkdown } from '@/lib/markdown'

/**
 * Renders `value` as plain text normally. Inside an EditProvider in edit mode,
 * renders an inline auto-growing textarea bound to `path`, styled to inherit
 * the surrounding typography so it reads like editing the page itself.
 */
export default function EditableText({
  value,
  path,
  as = 'span',
  className = '',
  placeholder = 'Empty',
}: {
  value: string
  path: string
  as?: ElementType
  className?: string
  placeholder?: string
}) {
  const ctx = useEditOptional()
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea to fit its content.
  const current = ctx?.editing ? ((ctx.value(path) as string) ?? '') : value
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [current])

  if (!ctx || !ctx.editing) {
    const Tag = as
    // Body copy can use [text](url|#anchor) and **bold**; render it as HTML when
    // present (headings/times never contain the syntax, so they stay plain).
    if (hasMarkdown(value)) {
      return <Tag className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
    }
    return <Tag className={className}>{value}</Tag>
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      value={current}
      placeholder={placeholder}
      onChange={e => ctx.setValue(path, e.target.value)}
      className={`${className} editable-field`}
      style={{
        font: 'inherit',
        color: 'inherit',
        letterSpacing: 'inherit',
        lineHeight: 'inherit',
        textTransform: 'inherit',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        width: '100%',
        display: 'block',
        padding: 0,
        margin: 0,
      }}
    />
  )
}
