'use client'
import { EventData } from '@/types/event'

export default function HeroSection({ event }: { event: EventData }) {
  return (
    <header
      className="relative min-h-[70vh] flex flex-col justify-end bg-vr-forest overflow-hidden"
      style={event.heroImage ? {
        backgroundImage: `url(${event.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      } : {}}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-vr-forest via-vr-forest/60 to-transparent" />

      {/* VR Logo */}
      <div className="relative z-10 px-6 pt-8 md:px-12">
        <p
          className="font-micro text-vr-cream/70 text-xs tracking-[0.2em] uppercase"
        >
          Vacation Races
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-10 md:px-12 md:pb-16 max-w-4xl">
        <p
          className="font-label text-vr-cream/70 text-sm tracking-[0.25em] uppercase mb-2"
        >
          Race Day Guide
        </p>
        <h1
          className="font-display text-vr-white uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
        >
          {event.name}
        </h1>
        <p
          className="font-label text-vr-cream text-lg md:text-xl tracking-widest uppercase mt-3"
        >
          {event.tagline} &nbsp;·&nbsp; {event.dates}
        </p>
      </div>
    </header>
  )
}
