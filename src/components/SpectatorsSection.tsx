import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['spectators'] }

export default function SpectatorsSection({ data }: Props) {
  return (
    <SectionWrapper id="spectators" label="Spectators" dark>
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
