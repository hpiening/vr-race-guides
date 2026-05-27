'use client'

interface MapEmbedProps {
  lat: number
  lng: number
  label: string
  mapsUrl: string
  zoom?: number
}

export default function MapEmbed({ lat, lng, label, mapsUrl, zoom = 15 }: MapEmbedProps) {
  const embedSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Koo&q=${lat},${lng}&zoom=${zoom}`

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Desktop: embedded map */}
      <div className="hidden md:block aspect-[4/3] w-full">
        <iframe
          title={label}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        />
      </div>

      {/* Mobile: tap-to-open link */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          md:hidden flex items-center gap-3
          bg-vr-cream/10 border border-vr-cream/20
          rounded-lg px-5 py-4
          text-vr-cream hover:bg-vr-cream/20 transition-colors
        "
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="font-label text-sm tracking-wider uppercase">Get Directions — {label}</span>
      </a>
    </div>
  )
}
