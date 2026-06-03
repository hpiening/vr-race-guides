import SectionWrapper from './SectionWrapper'
import { ChallengeEventsData } from '@/types/event'

type Props = { data: ChallengeEventsData }

export default function ChallengeEventsSection({ data }: Props) {
  return (
    <SectionWrapper id="challenge-events" label="Challenge Events" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-4 text-vr-cream">
        Challenge Events
      </h2>

      {data.intro && (
        <p className="font-body text-base text-vr-cream/70 leading-relaxed mb-10 max-w-2xl">
          {data.intro}
        </p>
      )}

      <div className="space-y-12">
        {data.events.map((evt, i) => (
          <div key={i} className="border border-vr-cream/15 rounded-xl overflow-hidden">
            {/* Event header */}
            <div className="bg-vr-cream/15 px-6 py-5 md:px-8">
              <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-cream/50 mb-1">
                Challenge Event
              </p>
              <h3 className="font-display text-3xl md:text-4xl uppercase text-vr-cream leading-none">
                {evt.name}
              </h3>
              {evt.tagline && (
                <p className="font-label text-sm tracking-widest uppercase text-vr-cream/60 mt-1">
                  {evt.tagline}
                </p>
              )}
            </div>

            <div className="p-6 md:p-8 bg-vr-cream/5">
              {/* Key stats row */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="border border-vr-cream/10 rounded-lg p-5 bg-vr-cream/5">
                  <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Dates</p>
                  <p className="font-heading text-base uppercase text-vr-cream">{evt.dates}</p>
                </div>
                {evt.totalMileage && (
                  <div className="border border-vr-cream/10 rounded-lg p-5 bg-vr-cream/5">
                    <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Total Mileage</p>
                    <p className="font-heading text-base uppercase text-vr-cream">{evt.totalMileage}</p>
                  </div>
                )}
              </div>

              <p className="font-body text-sm text-vr-cream/80 leading-relaxed mb-8">
                {evt.description}
              </p>

              {evt.includes.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-heading text-base uppercase text-vr-cream mb-4 tracking-wide">
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-2">
                    {evt.includes.map((item, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <span className="text-vr-floral mt-0.5 shrink-0">&#9658;</span>
                        <span className="font-body text-sm text-vr-cream/80 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6 p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Bib Pick-Up</p>
                <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{evt.bibPickup}</p>
              </div>

              <div className="mb-6 p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Medals</p>
                <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{evt.medals}</p>
              </div>

              {evt.swag && (
                <div className="p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                  <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Swag</p>
                  <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{evt.swag}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
