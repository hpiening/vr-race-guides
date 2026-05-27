import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['expo'] }

export default function ExpoSection({ data }: Props) {
  return (
    <section id="expo" className="py-16 md:py-24 px-6 md:px-12 bg-vr-offwhite text-vr-forest">
      <div className="max-w-4xl mx-auto">
        <p className="font-micro text-xs tracking-[0.25em] uppercase mb-2 text-vr-mid">Pre-Race Expo</p>
        <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-forest">Expo</h2>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Date</p>
            <p className="font-heading text-xl uppercase text-vr-forest mb-6">{data.date}</p>

            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Location</p>
            <a
              href={data.locationMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xl uppercase text-vr-sandstone underline decoration-vr-sandstone/30 hover:decoration-vr-sandstone transition-all mb-6 block"
            >
              {data.locationName}
            </a>

            <div className="space-y-3 mb-8">
              {data.hours.map((h, i) => (
                <div key={i} className="flex justify-between border-b border-vr-forest/10 pb-3">
                  <span className="font-micro text-sm text-vr-mid">{h.label}</span>
                  <span className="font-label text-sm text-vr-forest tracking-wider">{h.time}</span>
                </div>
              ))}
            </div>

            {data.notes.length > 0 && (
              <ul className="space-y-3">
                {data.notes.map((note, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-vr-floral mt-1 shrink-0">&#9658;</span>
                    <p className="font-body text-sm text-vr-forest/80 leading-relaxed">{note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <MapEmbed
              lat={data.locationLat}
              lng={data.locationLng}
              label={data.locationName}
              mapsUrl={data.locationMapUrl}
              dark={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
