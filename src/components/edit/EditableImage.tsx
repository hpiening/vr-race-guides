'use client'
import { useState } from 'react'
import { useEditOptional } from '@/lib/editContext'
import { uploadImage } from '@/lib/gitGateway'

/**
 * Edit-mode image control: upload a photo from your computer OR paste a URL.
 * Uploads commit into the repo via Git Gateway and set the field to the new
 * path; a local preview shows instantly (the committed image appears on the
 * public page after Save & publish rebuilds). Sections render this only in edit
 * mode and keep their normal <img> for the public view.
 */
export default function EditableImage({
  path,
  label = 'Photo',
  ratio,
  className = '',
}: {
  path: string
  label?: string
  ratio?: string
  className?: string
}) {
  const ctx = useEditOptional()
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [err, setErr] = useState('')
  if (!ctx) return null

  const value = (ctx.value(path) as string) ?? ''
  const shown = preview ?? value

  async function onFile(file: File) {
    setErr('')
    setStatus('uploading')
    setPreview(URL.createObjectURL(file))
    try {
      const url = await uploadImage(file)
      ctx!.setValue(path, url)
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setErr(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  return (
    <div className={className}>
      <div className="rounded-lg overflow-hidden border border-current/20 bg-black/5" style={ratio ? { aspectRatio: ratio } : undefined}>
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt={label} className="w-full h-full object-cover block" />
        ) : (
          <div className="py-10 text-center font-micro text-xs uppercase tracking-widest opacity-50">No photo yet</div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        <label className="cursor-pointer font-label text-xs tracking-[0.15em] uppercase text-vr-floral border border-vr-floral/40 rounded-full px-4 py-2 hover:bg-vr-floral/10">
          {status === 'uploading' ? 'Uploading…' : shown ? 'Replace photo' : 'Upload photo'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }}
          />
        </label>
        <span className="font-micro text-[10px] uppercase tracking-widest opacity-50">or paste URL</span>
        <input
          value={value}
          onChange={e => ctx.setValue(path, e.target.value)}
          placeholder="https://…"
          className="editable-field text-xs flex-1 min-w-[140px]"
          style={{ font: 'inherit', color: 'inherit', background: 'transparent', padding: '4px 6px' }}
        />
      </div>
      {status === 'error' && <p className="text-red-500 text-xs mt-1">{err}</p>}
      {status === 'idle' && preview && <p className="font-micro text-[10px] uppercase tracking-widest opacity-50 mt-1">Uploaded ✓ — appears on the page after Save &amp; publish</p>}
    </div>
  )
}
