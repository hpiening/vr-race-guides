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

  const btnClass = dark
    ? 'bg-vr-cream/10 border border-vr-cream/20 text-vr-cream hover:bg-vr-cream/20'
    : 'bg-vr-forest/10 border border-vr-forest/20 text-vr-forest hover:bg-vr-forest/20'

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-vr-forest/10">
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
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-3 rounded-lg px-5 py-4 transition-colors ${btnClass}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="font-label text-sm tracking-wider uppercase">Get Directions — {label}</span>
      </a>
    </div>
  )
}
