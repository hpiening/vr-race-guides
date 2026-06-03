import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['courseInfo'] }

export default function CourseInfoSection({ data }: Props) {
  return (
    <SectionWrapper id="course-info" label="Course" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">{data.heading || 'Course Info'}</h2>

      {/* Course maps */}
      {data.distances.length > 0 && (
        <div className="space-y-6 mb-12">
          {data.distances.map((d, i) => (
            <div key={i} className="bg-vr-cream/5 rounded-lg overflow-hidden border border-vr-cream/10">
              {/* Header row */}
              <div className="px-5 py-4 flex justify-between items-center border-b border-vr-cream/10">
                <div>
                  <span className="font-heading text-lg uppercase text-vr-cream">{d.name}</span>
                  {d.stats && (
                    <span className="font-micro text-xs text-vr-cream/50 ml-3 tracking-wider">{d.stats}</span>
                  )}
                </div>
                <a
                  href={d.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-micro text-xs tracking-widest uppercase text-vr-amber hover:text-vr-cream transition-colors shrink-0 ml-4"
                >
                  View Full Route ↗
                </a>
              </div>

              {/* RideWithGPS embed */}
              {d.embedUrl && (
                <iframe
                  src={d.embedUrl}
                  title={`${d.name} route map`}
                  style={{ width: '100%', height: '500px', border: 'none', display: 'block' }}
                  loading="lazy"
                  scrolling="no"
                />
              )}

              {/* Static image fallback */}
              {!d.embedUrl && d.mapImageUrl && (
                <img
                  src={d.mapImageUrl}
                  alt={`${d.name} course map`}
                  className="w-full object-cover aspect-[16/9]"
                />
              )}
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
