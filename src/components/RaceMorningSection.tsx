import SectionWrapper from './SectionWrapper'
import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['raceMorning'] }

export default function RaceMorningSection({ data }: Props) {
  return (
    <SectionWrapper id="race-morning" label="Race Morning">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8">Race Morning</h2>

      {/* Timeline */}
      <div className="mb-12">
        <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">{data.timelineLabel || 'Shuttle Schedule'}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {data.shuttleDetails.map((item, i) => (
            <div key={i} className="bg-vr-offwhite rounded-lg p-5">
              <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2">{item.time}</p>
              <p className="font-heading text-base uppercase leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Parking options */}
      <div className="mb-12">
        <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Parking</h3>
        <div className="space-y-8">
          {data.parkingOptions.map((option, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-6 border-t border-vr-forest/10 pt-6">
              <div>
                <p className="font-heading text-lg uppercase mb-2">{option.name}</p>
                <p className="font-body text-sm text-vr-mid leading-relaxed">{option.details}</p>
              </div>
              <MapEmbed
                lat={option.lat}
                lng={option.lng}
                label={option.name}
                mapsUrl={option.mapUrl}
                zoom={14}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Parking map image */}
      {data.parkingMapImageUrl && (
        <div className="mb-12 rounded-lg overflow-hidden border border-vr-forest/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.parkingMapImageUrl}
            alt="Parking map"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Drop-off note */}
      {data.dropOffNote && (
        <div className="bg-vr-cream/50 rounded-lg p-6 border-l-4 border-vr-amber mb-12">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2">Runner Drop-Off</p>
          <p className="font-body text-sm text-vr-forest leading-relaxed">{data.dropOffNote}</p>
        </div>
      )}

      {/* Course route maps */}
      {data.courses && data.courses.length > 0 && (
        <div>
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Course Map</h3>
          <div className="space-y-6">
            {data.courses.map((c, i) => (
              <div key={i} className="bg-vr-offwhite rounded-lg overflow-hidden border border-vr-forest/10">
                <div className="px-5 py-4 flex justify-between items-center border-b border-vr-forest/10">
                  <div>
                    <span className="font-heading text-lg uppercase">{c.name}</span>
                    {c.stats && (
                      <span className="font-micro text-xs text-vr-mid ml-3 tracking-wider">{c.stats}</span>
                    )}
                  </div>
                  <a
                    href={c.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-micro text-xs tracking-widest uppercase text-vr-sandstone hover:text-vr-forest transition-colors shrink-0 ml-4"
                  >
                    View Full Route ↗
                  </a>
                </div>
                {c.embedUrl && (
                  <iframe
                    src={c.embedUrl}
                    title={`${c.name} route map`}
                    style={{ width: '100%', height: '500px', border: 'none', display: 'block' }}
                    loading="lazy"
                    scrolling="no"
                  />
                )}
                {!c.embedUrl && c.mapImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.mapImageUrl} alt={`${c.name} course map`} className="w-full h-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
