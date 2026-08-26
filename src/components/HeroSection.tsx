'use client'
import Image from 'next/image'
import { EventData } from '@/types/event'
import EditableText from './edit/EditableText'
import EditableImage from './edit/EditableImage'
import { useEditOptional } from '@/lib/editContext'

export default function HeroSection({ event, theme = 'classic' }: { event: EventData; theme?: 'classic' | 'trailhead' }) {
  if (theme === 'trailhead') return <HeroTrailhead event={event} />

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
        <div className="tl-hero-photo absolute inset-0">
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
          <EditableText as="span" value={event.name} path="name" />
        </h1>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span
            className="text-vr-cream text-base md:text-lg tracking-widest uppercase"
            style={labelStyle}
          >
            <EditableText as="span" value={event.tagline} path="tagline" />
          </span>
          <span className="text-vr-cream/40">&#183;</span>
          <span
            className="text-vr-cream text-base md:text-lg tracking-widest uppercase"
            style={labelStyle}
          >
            <EditableText as="span" value={event.dates} path="dates" />
          </span>
        </div>
      </div>
    </header>
  )
}

/* ── Trailhead hero — cinematic radial gradient, inset frame, editorial type ── */
function HeroTrailhead({ event }: { event: EventData }) {
  const editing = !!useEditOptional()?.editing
  return (
    <header
      className="relative flex flex-col justify-end overflow-hidden min-h-[78vh] md:min-h-[82vh]"
      style={{ background: 'var(--tl-hero-grad)' }}
    >
      {event.heroImage && (
        <div className="tl-hero-photo absolute inset-0">
          <Image
            src={event.heroImage}
            alt={event.heroImageAlt || event.name}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
      )}

      {/* faint event-mark watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/events/${event.slug}-icon.png`}
        alt=""
        aria-hidden="true"
        className="tl-watermark absolute right-[4%] bottom-[-4%] h-[104%] w-auto opacity-[0.07] pointer-events-none"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      {/* bottom scrim for legibility over photo/gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'var(--tl-hero-scrim)' }}
      />
      {/* inset cream frame */}
      <div className="absolute z-[2] pointer-events-none border border-vr-cream/30" style={{ inset: '22px' }} />

      {/* event shield, top-right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.shieldImage || `/images/events/${event.slug}-shield.png`}
        alt={event.name}
        className="tl-hero-shield absolute z-[3] top-[10%] right-[5%] md:right-[6%] w-auto pointer-events-none drop-shadow-[0_14px_34px_rgba(0,0,0,0.4)]"
        style={{ height: 'clamp(120px,22vh,260px)' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div className="relative z-[3] px-6 pb-16 md:px-12 md:pb-20 pt-28 w-full max-w-[1180px] mx-auto">
        <div className="max-w-[88%] md:max-w-[84%]">
          <p className="font-micro font-bold uppercase text-vr-cream/[0.78] mb-3.5" style={{ fontSize: '13px', letterSpacing: '0.32em' }}>
            Race Day Guide
          </p>
          <h1
            className="font-display uppercase text-vr-cream m-0"
            style={{ lineHeight: 0.84, letterSpacing: '0.005em', fontSize: 'clamp(48px,8.2vw,116px)' }}
          >
            <EditableText as="span" value={event.name} path="name" />
          </h1>
          <p
            className="font-accent text-vr-sky mt-5"
            style={{ fontSize: 'clamp(20px,2.7vw,34px)', letterSpacing: '-0.01em' }}
          >
            <EditableText as="span" value={event.tagline} path="tagline" />
          </p>
          <div
            className="flex items-center gap-4 mt-7 flex-wrap font-label uppercase text-vr-cream"
            style={{ fontSize: 'clamp(13px,1.3vw,16px)', letterSpacing: '0.16em' }}
          >
            <span className="bg-vr-sky inline-block" style={{ width: 5, height: 5, transform: 'rotate(45deg)' }} />
            <EditableText as="span" value={event.dates} path="dates" />
          </div>

          {editing && (
            <div className="mt-8 max-w-md grid gap-4 rounded-lg bg-vr-night/70 border border-vr-cream/20 p-4">
              <EditableImage path="heroImage" label="Hero background photo" compact />
              <EditableImage path="shieldImage" label="Event badge (top-right)" compact />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
