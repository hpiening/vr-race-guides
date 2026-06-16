'use client'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './EditableText'

/**
 * A small labelled URL field, shown only in edit mode. The public render keeps
 * its normal link/button — this just lets editors change where it points.
 */
export default function EditableUrl({ path, label = 'Link URL' }: { path: string; label?: string }) {
  const ctx = useEditOptional()
  if (!ctx?.editing) return null
  return (
    <div className="mt-2 flex items-baseline gap-2">
      <span className="font-micro text-[10px] tracking-widest uppercase opacity-40 shrink-0">{label}</span>
      <EditableText
        as="span"
        value={(ctx.value(path) as string) ?? ''}
        path={path}
        placeholder="https://…"
        className="text-xs opacity-80 flex-1"
      />
    </div>
  )
}
