import SectionWrapper from './SectionWrapper'
import { WineFestivalData } from '@/types/event'

type Props = { data: WineFestivalData }

export default function WineFestivalSection({ data }: Props) {
  return (
    <SectionWrapper id="wine-festival" label="Wine Festival">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-forest">
        Wine Festival
      </h2>

      {/* Key info row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-vr-forest/10 rounded-lg p-5 bg-vr-offwhite">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Date</p>
          <p className="font-heading text-base uppercase text-vr-forest">{data.date}</p>
        </div>
        <div className="border border-vr-forest/10 rounded-lg p-5 bg-vr-offwhite">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Hours</p>
          <p className="font-heading text-base uppercase text-vr-forest">{data.hours}</p>
        </div>
        <div className="border border-vr-forest/10 rounded-lg p-5 bg-vr-offwhite">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Location</p>
          <p className="font-heading text-base uppercase text-vr-forest">{data.location}</p>
        </div>
      </div>

      <p className="font-body text-base text-vr-forest/80 leading-relaxed mb-10 max-w-2xl">
        {data.description}
      </p>

      {/* Tips */}
      {data.tips.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase text-vr-forest mb-5 tracking-wide">
            Tips & Info
          </h3>
          <ul className="space-y-3">
            {data.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-vr-floral mt-1 shrink-0">&#9658;</span>
                <p className="font-body text-sm text-vr-forest/80 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Wineries */}
      {data.wineries && data.wineries.length > 0 && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase text-vr-forest mb-5 tracking-wide">
            Participating Wineries
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.wineries.map((winery, i) => (
              <span
                key={i}
                className="font-micro text-xs tracking-[0.15em] uppercase px-3 py-1.5 border border-vr-forest/20 rounded-full text-vr-forest/70 bg-vr-offwhite"
              >
                {winery}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Guest passes */}
      {data.guestPasses && (
        <div className="mb-8 p-5 border border-vr-forest/10 rounded-lg bg-vr-offwhite">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-2">
            Guest Passes
          </p>
          <p className="font-body text-sm text-vr-forest/80 leading-relaxed">{data.guestPasses}</p>
        </div>
      )}

      {/* Finish Line VIP callout */}
      {data.finishLineVIP && (
        <div className="p-6 rounded-lg bg-vr-forest text-vr-cream">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">
            Finish Line VIP
          </p>
          <p className="font-body text-sm text-vr-cream/80 leading-relaxed">{data.finishLineVIP}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
