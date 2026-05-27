'use client'
import Image from 'next/image'
import { EventData } from '@/types/event'

export default function HeroSection({ event }: { event: EventData }) {
  return (
    <header className="relative min-h-[80vh] flex flex-col justify-between bg-vr-forest overflow-hidden">

      {/* Background scenery photo */}
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

      {/* Gradient overlay — dark at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-vr-forest via-vr-forest/50 to-vr-forest/20" />

      {/* Top bar — VR logo */}
      <div className="relative z-10 px-6 pt-7 md:px-12 flex items-center justify-between">
        <Image
          src="/images/vr-logo.png"
          alt="Vacation Races"
          width={160}
          height={40}
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      {/* Bottom content — event name */}
      <div className="relative z-10 px-6 pb-12 md:px-12 md:pb-20 max-w-5xl">
        <p className="font-label text-vr-cream/70 text-xs tracking-[0.3em] uppercase mb-3">
          Race Day Guide
        </p>
        <h1
          className="font-display text-vr-white uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          {event.name}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <span className="font-label text-vr-cream text-base md:text-lg tracking-widest uppercase">
            {event.tagline}
          </span>
          <span className="text-vr-cream/40">·</span>
          <span className="font-label text-vr-cream text-base md:text-lg tracking-widest uppercase">
            {event.dates}
          </span>
        </div>
      </div>
    </header>
  )
}
