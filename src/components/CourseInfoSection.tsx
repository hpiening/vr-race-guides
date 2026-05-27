import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['courseInfo'] }

export default function CourseInfoSection({ data }: Props) {
  return (
    <SectionWrapper id="course-info" label="Course" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Course Info</h2>

      {/* Course maps */}
      {data.distances.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {data.distances.map((d, i) => (
            <div key={i} className="bg-vr-cream/5 rounded-lg overflow-hidden border border-vr-cream/10">
              {d.mapImageUrl && (
                <img
                  src={d.mapImageUrl}
                  alt={`${d.name} course map`}
                  className="w-full object-cover aspect-[16/9]"
                />
              )}
              <div className="p-4 flex justify-between items-center">
                <span className="font-heading text-base uppercase text-vr-cream">{d.name}</span>
                <a
                  href={d.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-micro text-xs tracking-widest uppercase text-vr-amber hover:text-vr-cream transition-colors"
                >
                  View Course ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Policies grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {[
          { label: 'Aid Stations', text: data.aidStations },
          { label: 'Recovery Food', text: data.recoveryFood },
          { label: 'Strollers', text: data.strollerPolicy },
          { label: 'Dogs', text: data.dogPolicy },
        ].map((item, i) => (
          <div key={i} className="border-t border-vr-cream/10 pt-4">
            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">{item.label}</p>
            <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
