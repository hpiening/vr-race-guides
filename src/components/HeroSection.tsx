'use client'
import Image from 'next/image'
import { EventData } from '@/types/event'

export default function HeroSection({ event }: { event: EventData }) {
  const isN2S = event.brand === 'n2s'

  const heroBg       = isN2S ? '#2d1a26' : undefined
  const gradientFrom = isN2S ? 'from-[#2d1a26]' : 'from-vr-forest'
  const gradientVia  = isN2S ? 'via-[#2d1a26]/60' : 'via-vr-forest/50'
  const gradientTo   = isN2S ? 'to-transparent' : 'to-vr-forest/20'

  const h1Style = isN2S
    ? {
        fontFamily: "'Hubiron', 'Georgia', serif",
        fontWeight: 400,
        fontSize: 'clamp(3.5rem, 10vw, 8rem)',
        letterSpacing: '0.02em',
        lineHeight: 1.05,
      }
    : { fontSize: 'clamp(4rem, 12vw, 9rem)' }

  const labelStyle = isN2S
    ? { fontFamily: "'Avenir', 'Helvetica Neue', sans-serif", fontWeight: 900 }
    : {}

  const customBg = event.heroBgColor || heroBg

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
          className={`w-auto brightness-0 invert ${isN2S ? 'h-14' : 'h-8'}`}
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
