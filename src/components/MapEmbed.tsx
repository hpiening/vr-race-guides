'use client'

interface MapEmbedProps {
  lat: number
  lng: number
  label: string
  mapsUrl: string
  zoom?: number
  dark?: boolean
}

export default function MapEmbed({ lat, lng, label, mapsUrl, zoom = 15, dark = true }: MapEmbedProps) {
  const buf = zoom >= 15 ? 0.012 : 0.025
  const embedSrc =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${lng - buf},${lat - buf},${lng + buf},${lat + buf}` +
    `&layer=mapnik&marker=${lat},${lng}`

  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`

  const pinIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )

  const btnBase = 'flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors flex-1'
  const btnGoogle = dark
    ? `${btnBase} bg-white/10 border border-white/20 text-white hover:bg-white/20`
    : `${btnBase} bg-[#2d1a26] text-white hover:bg-[#3d2536]`
  const btnApple = dark
    ? `${btnBase} bg-white/10 border border-white/20 text-white hover:bg-white/20`
    : `${btnBase} bg-[#2d1a26]/10 border border-[#2d1a26]/30 text-[#2d1a26] hover:bg-[#2d1a26]/20`

  return (
    <div className="flex flex-col gap-3">
      <div className="map-embed-frame aspect-[4/3] w-full rounded-lg overflow-hidden border border-vr-forest/10">
        <iframe
          title={label}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          className="rounded-lg"
        />
      </div>
      <div className="flex gap-2">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={btnGoogle}>
          {pinIcon}
          Google Maps
        </a>
        <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer" className={btnApple}>
          {pinIcon}
          Apple Maps
        </a>
      </div>
    </div>
  )
}
