import SectionWrapper from './SectionWrapper'
import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['expo'] }

export default function ExpoSection({ data }: Props) {
  return (
    <SectionWrapper id="expo" label="Pre-Race Expo" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Expo</h2>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Details */}
        <div>
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Date</p>
          <p className="font-heading text-xl uppercase text-vr-cream mb-6">{data.date}</p>

          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Location</p>
          <a
            href={data.locationMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-xl uppercase text-vr-cream underline decoration-vr-cream/30 hover:decoration-vr-cream transition-all mb-6 block"
          >
            {data.locationName}
          </a>

          <div className="space-y-3 mb-8">
            {data.hours.map((h, i) => (
              <div key={i} className="flex justify-between border-b border-vr-cream/10 pb-3">
                <span className="font-micro text-sm text-vr-cream/70">{h.label}</span>
                <span className="font-label text-sm text-vr-cream tracking-wider">{h.time}</span>
              </div>
            ))}
          </div>

          {data.notes.length > 0 && (
            <ul className="space-y-3">
              {data.notes.map((note, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-vr-amber mt-1 shrink-0">▸</span>
                  <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{note}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map */}
        <MapEmbed
          lat={data.locationLat}
          lng={data.locationLng}
          label={data.locationName}
          mapsUrl={data.locationMapUrl}
        />
      </div>
    </SectionWrapper>
  )
}
