'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['experiences']; eventSlug?: string }

export default function ExperiencesSection({ data, eventSlug }: Props) {
  return (
    <SectionWrapper id="experiences" label="Experiences" dark>

      {/* Tree watermark */}
      {eventSlug && (
        <div
          className="absolute right-0 bottom-0 w-[55%] max-w-2xl opacity-[0.06] pointer-events-none select-none translate-x-[10%] translate-y-[5%]"
          aria-hidden="true"
        >
          <img
            src={`/images/events/${eventSlug}-icon.png`}
            alt=""
            className="w-full h-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      <h2 className="font-display text-5xl md:text-6xl uppercase mb-12 text-vr-cream">Experiences</h2>

      {/* Lodging */}
      <div className="bg-vr-cream/10 border border-vr-cream/15 rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-1">Official Lodging Partner</p>
          <p className="font-heading text-2xl uppercase text-vr-cream mb-2">{data.lodging.partner}</p>
          <p className="font-body text-sm text-vr-cream/70 max-w-md leading-relaxed">{data.lodging.description}</p>
        </div>
        <a
          href={data.lodging.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 bg-vr-cream text-vr-forest rounded hover:bg-vr-cream/90 transition-colors"
        >
          Book Your Stay
        </a>
      </div>

      {/* Activities */}
      {data.activities.map((act, i) => (
        <div key={i} className="bg-vr-cream/10 border border-vr-cream/10 rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-heading text-xl uppercase text-vr-cream mb-2">{act.name}</p>
            <p className="font-body text-sm text-vr-cream/70 leading-relaxed max-w-md mb-3">{act.description}</p>
            {act.discountCode && (
              <p className="font-micro text-sm text-vr-cream/70">
                Use code{' '}
                <span className="font-label tracking-widest bg-vr-cream/20 text-vr-cream px-2 py-0.5 rounded text-xs">
                  {act.discountCode}
                </span>
                {' '}to save
              </p>
            )}
          </div>
          <a
            href={act.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 border border-vr-cream/30 text-vr-cream rounded hover:bg-vr-cream/10 transition-colors"
          >
            Learn More
          </a>
        </div>
      ))}

      {/* Hikes */}
      {data.hikes.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide text-vr-cream">Top Hikes</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.hikes.map((hike, i) => (
              <a
                key={i}
                href={hike.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vr-cream/15 rounded-lg p-5 hover:border-vr-cream/40 transition-colors group"
              >
                <p className="font-heading text-base uppercase mb-3 text-vr-cream group-hover:text-vr-floral transition-colors">
                  {hike.name}
                </p>
                <div className="space-y-1">
                  <p className="font-micro text-xs text-vr-cream/50">{hike.distance}</p>
                  <p className="font-micro text-xs text-vr-cream/50">{hike.elevation} elevation</p>
                  <p className="font-micro text-xs text-vr-cream/50">{hike.difficulty}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Iconic Sights */}
      {data.sights && data.sights.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide text-vr-cream">Iconic Views & Sights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.sights.map((s, i) => (
              <div key={i} className="border border-vr-cream/15 rounded-lg p-5">
                <p className="font-heading text-base uppercase mb-2 text-vr-cream">{s.name}</p>
                <p className="font-body text-sm text-vr-cream/60 leading-relaxed">{s.description}</p>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 font-micro text-xs tracking-widest uppercase text-vr-floral hover:text-vr-cream transition-colors">
                    Learn More ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurants */}
      {data.restaurants.length > 0 && (
        <div>
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide text-vr-cream">Where to Eat</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.restaurants.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vr-cream/15 rounded-lg p-5 hover:border-vr-cream/40 transition-colors group"
              >
                <p className="font-heading text-base uppercase mb-2 text-vr-cream group-hover:text-vr-floral transition-colors">
                  {r.name}
                </p>
                <p className="font-body text-sm text-vr-cream/60 leading-relaxed">{r.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
