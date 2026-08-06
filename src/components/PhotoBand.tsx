'use client'
import { useEditOptional } from '@/lib/editContext'
import EditableImage from './edit/EditableImage'

/**
 * Full-bleed titled divider band between sections (Trailhead only; hidden in
 * print). Shows a landscape background photo (with a dark scrim for legibility)
 * when `image` is set, otherwise the default diagonal-stripe texture. In the
 * editor an image control is shown so the photo can be uploaded/swapped.
 */
export default function PhotoBand({
  title,
  image,
  imagePath,
}: {
  title: string
  image?: string
  imagePath?: string
}) {
  const editing = !!useEditOptional()?.editing
  return (
    <div className="tl-photoband relative bg-vr-night px-6 md:px-12 py-16 md:py-[74px] text-center overflow-hidden border-y border-vr-cream/10">
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-vr-night/60" />
        </>
      ) : (
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ background: 'var(--tl-band-stripe)' }} />
      )}
      <h2 className="relative font-display uppercase tracking-[0.02em] text-vr-cream m-0" style={{ fontSize: 'clamp(34px,5vw,64px)' }}>
        {title}
      </h2>
      {editing && imagePath && (
        <div className="relative mt-4 max-w-md mx-auto text-left">
          <EditableImage path={imagePath} label="Band background photo (landscape)" ratio="16 / 5" />
        </div>
      )}
    </div>
  )
}
