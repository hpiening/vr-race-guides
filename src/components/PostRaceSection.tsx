import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['postRace'] }

export default function PostRaceSection({ data }: Props) {
  return (
    <SectionWrapper id="post-race" label="Post-Race" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Post-Race</h2>

      {data.finishLineInfo && (
        <p className="font-body text-base text-vr-cream/80 leading-relaxed mb-12 max-w-2xl">
          {data.finishLineInfo}
        </p>
      )}

      {data.courseRecords.length > 0 && (
        <div>
          <h3 className="font-heading text-xl uppercase text-vr-cream mb-6 tracking-wide">
            Course Records
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.courseRecords.map((record, i) => (
              <div
                key={i}
                className="border border-vr-cream/10 rounded-lg p-5 bg-vr-cream/5"
              >
                <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">
                  {record.category}
                </p>
                <p className="font-heading text-2xl text-vr-cream uppercase mb-1">
                  {record.time}
                </p>
                <p className="font-body text-sm text-vr-cream/70">
                  {record.name} · {record.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
