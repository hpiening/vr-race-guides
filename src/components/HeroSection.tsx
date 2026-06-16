'use client'
import Image from 'next/image'
import { EventData } from '@/types/event'

export default function HeroSection({ event }: { event: EventData }) {
  const gradientFrom = 'from-vr-forest'
  const gradientVia  = 'via-vr-forest/50'
  const gradientTo   = 'to-vr-forest/20'

  const h1Style = { fontSize: 'clamp(4rem, 12vw, 9rem)' }
  const labelStyle = {}

  const customBg = event.heroBgColor

  return (
    <header
      className="relative min-h-[80vh] flex flex-col justify-between bg-vr-forest overflow-hidden"
      style={customBg ? { backgroundColor: customBg } : undefined}
    >
      {event.heroImage && (
        <div className="absolute inset-0">
          <Image
            src={event.heroImage}
            alt={event.heroImageAlt || event.name}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      )}

      {/* Mountain cutout / overlay graphic — full-width silhouette at bottom of hero */}
      {event.heroOverlayImage && (
        <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none overflow-hidden" style={{ maxHeight: '55%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.heroOverlayImage}
            alt=""
            aria-hidden="true"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
      )}

      <div className={`absolute inset-0 z-[1] bg-gradient-to-t ${gradientFrom} ${gradientVia} ${gradientTo}`} />

      <div className="relative z-10 px-6 pt-7 md:px-12 flex items-center justify-between">
        <Image
          src={event.logo || '/images/vr-logo.png'}
          alt={event.logoAlt || 'Race Series Logo'}
          width={160}
          height={60}
          className="w-auto brightness-0 invert h-8"
        />
      </div>

      <div className="relative z-10 px-6 pb-12 md:px-12 md:pb-20 max-w-5xl">
        <p
          className="text-vr-cream/70 text-xs tracking-[0.3em] uppercase mb-3"
          style={labelStyle}
        >
          Race Day Guide
        </p>
        <h1
          className="font-display text-vr-white uppercase leading-none"
          style={h1Style}
        >
          {event.name}
        </h1>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span
            className="text-vr-cream text-base md:text-lg tracking-widest uppercase"
            style={labelStyle}
          >
            {event.tagline}
          </span>
          <span className="text-vr-cream/40">&#183;</span>
          <span
            className="text-vr-cream text-base md:text-lg tracking-widest uppercase"
            style={labelStyle}
          >
            {event.dates}
          </span>
        </div>
      </div>
    </header>
  )
}
