import { ReactNode } from 'react'
import { StatTile, CardIcon } from '@/types/event'
import { hasMarkdown, renderMarkdown } from '@/lib/markdown'

/**
 * Derive a static route map image (PNG) from a RideWithGPS embed URL. The live
 * embed is an <iframe> that can't render in the PDF export, so the print view
 * falls back to RideWithGPS's own static render of the same route. Returns
 * undefined for non-RideWithGPS embeds (caller keeps its placeholder).
 */
export function rwgStaticMap(embedUrl?: string): string | undefined {
  if (!embedUrl || !/ridewithgps\.com/.test(embedUrl)) return undefined
  const m = embedUrl.match(/[?&]id=(\d+)/)
  return m ? `https://ridewithgps.com/routes/${m[1]}/full.png` : undefined
}

/** Render a body value: parse inline Markdown (links/bold/italic) for strings. */
export function RichBody({ value }: { value: ReactNode }) {
  if (typeof value === 'string' && hasMarkdown(value)) {
    return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
  }
  return <>{value}</>
}

/**
 * Shared presentational pieces for the Trailhead theme's public (view-mode)
 * renders. These are display-only — inline editing always falls back to each
 * section's classic render, so nothing here needs EditableText.
 */

/**
 * Icon library shared by cards, accordions and group headings.
 *
 * Direction comes from the references VR supplied — the NPS Zion Wilderness
 * Guide and VR's own 2024 Grand Circle guide — both of which put one simple
 * icon at the head of a topic and use short caps labels underneath. So these
 * are deliberately plain single-stroke glyphs at topic level, not decoration on
 * every line.
 */
export const CARD_ICONS: Record<CardIcon, string> = {
  coffee:   'M4 8h11v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8zM15 9h2a2.5 2.5 0 010 5h-2M4 21h12',
  meal:     'M5 3v8a2 2 0 004 0V3M7 11v10M17 3c-1.4 0-2.4 1.4-2.4 3.8S15.6 10 17 10s2.4-.8 2.4-3.2S18.4 3 17 3zM17 10v11',
  flame:    'M12 22c3.6 0 6-2.3 6-5.5 0-4.2-4.5-5.9-3.4-10.5C11.8 7 9 9.6 9 12c0-1.2-.6-2.3-1.5-3C6.5 10.4 6 12.3 6 14c0 4 2.7 8 6 8z',
  beer:     'M6 8h9v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8zM15 10h3v7h-3M6 8c0-2 1.5-3.5 3.5-3.5S13 6 15 6',
  wine:     'M8 3h8l-1 6a3 3 0 01-6 0L8 3zM12 15v6M9 21h6',
  truck:    'M2 8h11v8H2zM13 11h5l3 3v2h-8M6.5 19a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM17.5 19a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z',
  pin:      'M12 22s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11zM12 13a2.6 2.6 0 100-5.2 2.6 2.6 0 000 5.2z',
  snack:    'M4 9h16l-1.4 10a2 2 0 01-2 1.8H7.4a2 2 0 01-2-1.8L4 9zM8 9V6a4 4 0 018 0v3',
  ticket:   'M3 9V6h18v3a2.6 2.6 0 000 5.2V18H3v-3.8a2.6 2.6 0 000-5.2zM13 7v11',
  info:     'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.6v.6',
  music:    'M9 18V6l10-2v12M9 18a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM19 16a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  person:   'M12 6a2 2 0 100-4 2 2 0 000 4zM12 6v7M12 13l-3.5 8M12 13l3.5 8M6.5 9.5h11',
  sparkle:  'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8',
  stars:    'M7 3l1.3 2.9L11 7.2 8.3 8.5 7 11.4 5.7 8.5 3 7.2l2.7-1.3zM16.5 12l1.6 3.5L21.5 17l-3.4 1.5-1.6 3.5-1.6-3.5L11.5 17l3.4-1.5z',
  hands:    'M8 13V5.5a1.5 1.5 0 013 0V12M11 12V4.5a1.5 1.5 0 013 0V12M14 12V6.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7H9.5A5.5 5.5 0 014 15.5V12a1.5 1.5 0 013 0v1.5',
  timer:    'M12 21a8 8 0 100-16 8 8 0 000 16zM12 9.5V13l2.5 1.8M9.5 3h5',
  firstaid: 'M3.5 7h17v12h-17zM12 10v6M9 13h6M9 7V4.5h6V7',
  award:    'M12 14.5a5 5 0 100-10 5 5 0 000 10zM8.8 13.8L7.5 21l4.5-2.2L16.5 21l-1.3-7.2',
  shower:   'M12 3v4M7 11h10a5 5 0 00-10 0zM9 15v.01M12 17v.01M15 15v.01M9.5 20v.01M14.5 20v.01',
  drop:     'M12 21a6 6 0 006-6c0-4.2-6-12-6-12S6 10.8 6 15a6 6 0 006 6z',
  recycle:  'M12 3l2.8 4.8H9.2zM4.5 19l2.8-4.8 2.9 4.8zM19.5 19h-6l3-5zM7 8.5l-2.5 4.3M17 8.5l2.5 4.3M9.5 19h4',
  bag:      'M5 9h14v11H5zM9.5 9V6.4a2.5 2.5 0 015 0V9M5 13.5h14',
  camera:   'M4 8h3l1.5-2h7L17 8h3v11H4zM12 16.6a3.1 3.1 0 100-6.2 3.1 3.1 0 000 6.2z',
  bus:      'M4 6h16v9H4zM4 15v3h3v-3M17 15v3h3v-3M7.5 10h9M8.5 6V4h7v2',
  map:      'M9 3l6 2 6-2v15.5l-6 2-6-2-6 2V5zM9 3v15.5M15 5v15.5',
  tent:     'M12 5l8 15H4zM12 5v15M12 20l4.5-7M12 20l-4.5-7',
  film:     'M3.5 5h17v14h-17zM8 5v14M16 5v14M3.5 9.7h4.5M3.5 14.3h4.5M16 9.7h4.5M16 14.3h4.5',
  clock:    'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.6V12l3.4 2',
}

/**
 * Topic icon.
 *
 * `badge` renders the reference treatment: a solid rounded square with the
 * pictogram knocked out of it, as used by the NPS French Info Guide, the NPS
 * Zion Wilderness Guide and VR's own 2024 Grand Circle guide. `on` says what
 * ground it sits on, so the badge inverts to stay high-contrast.
 *
 * Without `badge` it's the plain glyph, used where it already sits on a filled
 * ground (inside a group label bar) or where a badge would be too heavy (the
 * per-row schedule categories).
 */
export function CardIconMark({
  icon,
  size = 15,
  className = 'text-vr-sky',
  badge = false,
  on = 'light',
}: {
  icon: CardIcon
  size?: number
  className?: string
  badge?: boolean
  on?: 'light' | 'dark'
}) {
  const glyph = (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
    >
      <path d={CARD_ICONS[icon]} />
    </svg>
  )
  if (!badge) return <span className={`shrink-0 inline-flex ${className}`}>{glyph}</span>
  const box = Math.round(size * 1.85)
  return (
    <span
      className={`tl-badge shrink-0 inline-flex items-center justify-center rounded-[3px] ${
        on === 'light' ? 'bg-vr-forest text-vr-cream' : 'bg-vr-cream text-vr-forest'
      }`}
      style={{ width: box, height: box }}
    >
      {glyph}
    </span>
  )
}

/** Two-part section header: small Fraunces eyebrow over a big Scale Condensed title. */
export function TrailHeader({
  eyebrow,
  title,
  dark = false,
  center = false,
  className = '',
}: {
  eyebrow: string
  title: string
  dark?: boolean
  center?: boolean
  className?: string
}) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <div className="leading-[0.9]">
        <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>{eyebrow}</span>
      </div>
      <h2
        className={`font-display uppercase leading-[0.9] mt-0.5 m-0 ${dark ? 'text-vr-cream' : 'text-vr-forest'}`}
        style={{ fontSize: 'clamp(40px,5.6vw,76px)' }}
      >
        {title}
      </h2>
    </div>
  )
}

/** Renders a free-form "a · b · c" stats string as a row of chips (no data-shape change). */
export function StatChips({ stats, dark = true }: { stats?: string; dark?: boolean }) {
  if (!stats) return null
  const parts = stats.split('·').map(s => s.trim()).filter(Boolean)
  if (!parts.length) return null
  return (
    <div className="flex flex-wrap gap-2.5">
      {parts.map((p, i) => (
        <span
          key={i}
          className={`font-label uppercase rounded-full px-4 py-2 ${
            dark ? 'text-vr-cream border border-vr-cream/25' : 'text-vr-forest border border-vr-forest/20'
          }`}
          style={{ fontSize: '12px', letterSpacing: '0.06em' }}
        >
          {p}
        </span>
      ))}
    </div>
  )
}

/** Big-number stat tile grid (2 cols, hairline dividers) — the design's signature stat block. */
export function StatTiles({ tiles, className = '' }: { tiles?: StatTile[]; className?: string }) {
  if (!tiles || tiles.length === 0) return null
  return (
    <div className={`grid grid-cols-2 gap-px bg-vr-cream/[0.16] border border-vr-cream/[0.16] rounded-lg overflow-hidden ${className}`}>
      {tiles.map((t, i) => (
        <div key={i} className="bg-vr-deep px-5 py-6">
          <div className="font-display text-vr-cream leading-none" style={{ fontSize: '38px' }}>{t.value}</div>
          <div className="font-micro uppercase text-vr-sky mt-2" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>{t.label}</div>
        </div>
      ))}
    </div>
  )
}

/** Image frame — renders a real image if `src` is set, else a hatched photo placeholder (design comp style). */
export function PhotoFrame({
  src,
  alt,
  label,
  ratio = '4 / 3',
  dark = false,
  className = '',
}: {
  src?: string
  alt?: string
  label: string
  ratio?: string
  dark?: boolean
  className?: string
}) {
  if (src) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || label} className="w-full h-full object-cover block" />
      </div>
    )
  }
  const hatch = dark
    ? 'var(--tl-hatch-dark)'
    : 'repeating-linear-gradient(135deg,#ece0cd,#ece0cd 12px,#e4d5be 12px,#e4d5be 24px)'
  return (
    <div className={`tl-photoph flex items-center justify-center ${className}`} style={{ aspectRatio: ratio, background: hatch }}>
      <span className="font-micro uppercase" style={{ fontSize: '11px', letterSpacing: '0.14em', color: dark ? 'var(--vr-sky)' : '#313832' }}>{label}</span>
    </div>
  )
}

/** Native <details> accordion list. Works with zero JS (progressive enhancement). */
export function Accordion({
  items,
  variant = 'cream',
}: {
  items: { heading: string; body: ReactNode; icon?: CardIcon }[]
  variant?: 'cream' | 'white'
}) {
  const wrap = variant === 'cream' ? 'bg-vr-cream' : 'bg-vr-white border border-vr-line'
  return (
    <div className="flex flex-col gap-2.5">
      {items.filter(it => it.heading || it.body).map((it, i) => (
        <details key={i} className={`${wrap} rounded-lg`}>
          <summary className="flex justify-between items-center gap-4 px-6 py-5">
            <span className="flex items-center gap-2.5 min-w-0">
              {it.icon && <CardIconMark icon={it.icon} size={15} badge on="light" />}
              <span className="font-heading uppercase text-vr-forest" style={{ fontSize: '15px', letterSpacing: '0.04em' }}>{it.heading}</span>
            </span>
            <span className="tl-plus text-vr-sky font-light transition-transform duration-200" style={{ fontSize: '22px' }}>+</span>
          </summary>
          <div className="px-6 pb-5 font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line" style={{ fontSize: '15px' }}>
            <RichBody value={it.body} />
          </div>
        </details>
      ))}
    </div>
  )
}

/**
 * Prominent outbound link for accordion bodies and info cards.
 *
 * This used to be small accent-coloured caps. That works on a cool accent, but
 * Grand Circle's accent is a light desert orange and the cards are cream, so
 * the "Driving Directions" link under each course was effectively invisible and
 * people were missing it. A filled pill with dark ink reads at a glance, keeps
 * its contrast when printed, and gives a proper tap target on a phone.
 */
export function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // `flex w-fit` not `inline-flex`: inside an accordion body this sits in a
      // run of text, and inline-flex let it wrap into the middle of a sentence.
      // Block-level puts it on its own line; w-fit keeps it hugging its label.
      className="flex w-fit items-center gap-1.5 mt-4 font-label text-sm font-bold tracking-[0.1em] uppercase text-vr-forest bg-vr-sky/25 hover:bg-vr-sky/40 border border-vr-sky/50 rounded-lg px-5 py-2.5 transition-colors"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

/** Light info card with heading + body. */
export function InfoCard({ heading, children, className = '' }: { heading: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border border-vr-line bg-vr-white rounded-lg p-7 ${className}`}>
      <h3 className="font-heading uppercase text-vr-forest mb-3" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>{heading}</h3>
      <div className="font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line" style={{ fontSize: '15px' }}><RichBody value={children} /></div>
    </div>
  )
}
