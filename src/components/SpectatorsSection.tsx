'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['spectators']; eventSlug?: string }

export default function SpectatorsSection({ data, eventSlug }: Props) {
  return (
    <SectionWrapper id="spectators" label="Spectators" dark>

      {/* Tree watermark — same treatment as ScheduleSection */}
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

      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Spectators</h2>

      <p className="font-body text-base text-vr-cream/70 leading-relaxed mb-8 max-w-2xl">
        {data.notes}
      </p>

      {data.warnings.length > 0 && (
        <div className="bg-vr-cream/10 border border-vr-cream/15 rounded-lg p-6 mb-8 space-y-4">
          {data.warnings.map((w, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-vr-floral shrink-0 mt-0.5">&#9658;</span>
              <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      )}

      {data.shuttleAccess && (
        <div className="border-t border-vr-cream/10 pt-6">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-2">Shuttle Access</p>
          <p className="font-body text-sm text-vr-cream/70 leading-relaxed">{data.shuttleAccess}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
