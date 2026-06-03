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

      {/* Drop-off note */}
      {data.dropOffNote && (
        <div className="bg-vr-cream/50 rounded-lg p-6 border-l-4 border-vr-amber">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2">Runner Drop-Off</p>
          <p className="font-body text-sm text-vr-forest leading-relaxed">{data.dropOffNote}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
