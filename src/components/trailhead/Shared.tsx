import { ReactNode } from 'react'

/**
 * Shared presentational pieces for the Trailhead theme's public (view-mode)
 * renders. These are display-only — inline editing always falls back to each
 * section's classic render, so nothing here needs EditableText.
 */

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

/** Native <details> accordion list. Works with zero JS (progressive enhancement). */
export function Accordion({
  items,
  variant = 'cream',
}: {
  items: { heading: string; body: ReactNode }[]
  variant?: 'cream' | 'white'
}) {
  const wrap = variant === 'cream' ? 'bg-vr-cream' : 'bg-vr-white border border-vr-line'
  return (
    <div className="flex flex-col gap-2.5">
      {items.filter(it => it.heading || it.body).map((it, i) => (
        <details key={i} className={`${wrap} rounded-lg`}>
          <summary className="flex justify-between items-center gap-4 px-6 py-5">
            <span className="font-heading uppercase text-vr-forest" style={{ fontSize: '15px', letterSpacing: '0.04em' }}>{it.heading}</span>
            <span className="tl-plus text-vr-sky font-light transition-transform duration-200" style={{ fontSize: '22px' }}>+</span>
          </summary>
          <div className="px-6 pb-5 font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line" style={{ fontSize: '15px' }}>
            {it.body}
          </div>
        </details>
      ))}
    </div>
  )
}

/** Light info card with heading + body. */
export function InfoCard({ heading, children, className = '' }: { heading: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border border-vr-line bg-vr-white rounded-lg p-7 ${className}`}>
      <h3 className="font-heading uppercase text-vr-forest mb-3" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>{heading}</h3>
      <div className="font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line" style={{ fontSize: '15px' }}>{children}</div>
    </div>
  )
}
