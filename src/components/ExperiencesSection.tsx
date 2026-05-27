import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['experiences'] }

export default function ExperiencesSection({ data }: Props) {
  return (
    <SectionWrapper id="experiences" label="Experiences">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-12">Experiences</h2>

      {/* Lodging */}
      <div className="bg-vr-forest text-vr-cream rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Official Lodging Partner</p>
          <p className="font-heading text-2xl uppercase mb-2">{data.lodging.partner}</p>
          <p className="font-body text-sm text-vr-cream/80 max-w-md leading-relaxed">{data.lodging.description}</p>
        </div>
        <a
          href={data.lodging.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 bg-vr-cream text-vr-forest rounded hover:bg-vr-cream/90 transition-colors"
        >
          Book Your Stay
        </a>
      </div>

      {/* Activities */}
      {data.activities.map((act, i) => (
        <div key={i} className="bg-vr-offwhite rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-heading text-xl uppercase mb-2">{act.name}</p>
            <p className="font-body text-sm text-vr-mid leading-relaxed max-w-md mb-3">{act.description}</p>
            {act.discountCode && (
              <p className="font-micro text-sm">
                Use code{' '}
                <span className="font-label tracking-widest bg-vr-forest text-vr-cream px-2 py-0.5 rounded text-xs">
                  {act.discountCode}
                </span>
                {' '}to save
              </p>
            )}
          </div>
          <a
            href={act.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 bg-vr-forest text-vr-cream rounded hover:bg-vr-forest/90 transition-colors"
          >
            Learn More
          </a>
        </div>
      ))}

      {/* Hikes */}
      {data.hikes.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Top Hikes</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.hikes.map((hike, i) => (
              <a
                key={i}
                href={hike.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vr-forest/10 rounded-lg p-5 hover:border-vr-forest/30 transition-colors group"
              >
                <p className="font-heading text-base uppercase mb-3 group-hover:text-vr-amber transition-colors">
                  {hike.name}
                </p>
                <div className="space-y-1">
                  <p className="font-micro text-xs text-vr-mid">{hike.distance}</p>
                  <p className="font-micro text-xs text-vr-mid">{hike.elevation} elevation</p>
                  <p className="font-micro text-xs text-vr-mid">{hike.difficulty}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Restaurants */}
      {data.restaurants.length > 0 && (
        <div>
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Where to Eat</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.restaurants.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-vr-forest/10 rounded-lg p-5 hover:border-vr-forest/30 transition-colors group"
              >
                <p className="font-heading text-base uppercase mb-2 group-hover:text-vr-amber transition-colors">
                  {r.name}
                </p>
                <p className="font-body text-sm text-vr-mid leading-relaxed">{r.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}
