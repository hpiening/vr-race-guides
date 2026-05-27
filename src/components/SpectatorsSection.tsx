import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['spectators'] }

export default function SpectatorsSection({ data }: Props) {
  return (
    <SectionWrapper id="spectators" label="Spectators">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8">Spectators</h2>

      <p className="font-body text-base text-vr-mid leading-relaxed mb-8 max-w-2xl">
        {data.notes}
      </p>

      {data.warnings.length > 0 && (
        <div className="bg-vr-forest text-vr-cream rounded-lg p-6 mb-8 space-y-3">
          {data.warnings.map((w, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-vr-amber shrink-0 mt-0.5">⚠</span>
              <p className="font-body text-sm leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      )}

      {data.shuttleAccess && (
        <div className="border-t border-vr-forest/10 pt-6">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-mid mb-2">Shuttle Access</p>
          <p className="font-body text-sm text-vr-mid leading-relaxed">{data.shuttleAccess}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
