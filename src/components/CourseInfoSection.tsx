import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['courseInfo'] }

export default function CourseInfoSection({ data }: Props) {
  return (
    <SectionWrapper id="course-info" label={data.navLabel || data.heading || 'Course Info'} dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">{data.heading || 'Course Info'}</h2>

      {/* Schedule timeline (e.g. 5K schedule) */}
      {data.schedule && data.schedule.length > 0 && (
        <div className="mb-12">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide text-vr-cream">Schedule</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.schedule.map((item, i) => (
              <div key={i} className="bg-vr-cream/5 rounded-lg p-5 border border-vr-cream/10">
                <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-2">{item.time}</p>
                <p className="font-heading text-sm uppercase leading-tight text-vr-cream">{item.label}</p>
                {item.note && <p className="font-body text-xs text-vr-cream/55 mt-1 leading-relaxed">{item.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

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
                <>
                  <iframe
                    src={d.embedUrl}
                    title={`${d.name} route map`}
                    style={{ width: '100%', height: '500px', border: 'none', display: 'block' }}
                    loading="lazy"
                    scrolling="no"
                    className="print:hidden"
                  />
                  <div className="hidden print:block px-5 py-4 text-sm font-body text-vr-cream/70">
                    View route at: {d.mapUrl}
                  </div>
                </>
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

      {/* Policies grid — only shown when there's no detailed infoBlocks */}
      {!data.infoBlocks?.length && (
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
      )}

      {/* Detailed info blocks */}
      {data.infoBlocks && data.infoBlocks.length > 0 && (
        <div className="space-y-8 border-t border-vr-cream/10 pt-8">
          {data.infoBlocks.map((block, i) => (
            <div key={i} className="border-b border-vr-cream/10 pb-8 last:border-0">
              <h3 className="font-heading text-base uppercase text-vr-cream mb-3 tracking-wide">
                {block.heading}
              </h3>
              <p className="font-body text-sm text-vr-cream/80 leading-relaxed whitespace-pre-line">
                {block.body}
              </p>
              {block.linkLabel && block.linkUrl && (
                <a
                  href={block.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 border border-vr-cream/30 text-vr-cream rounded hover:bg-vr-cream/10 transition-colors"
                >
                  {block.linkLabel}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
