import { WelcomeData } from '@/types/event'

type Props = { data: WelcomeData }

export default function WelcomeSection({ data }: Props) {
  if (!data.enabled) return null

  return (
    <section className="py-14 md:py-20 px-6 md:px-12 bg-vr-offwhite border-b border-vr-forest/10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl uppercase text-vr-forest mb-6 leading-tight">
          {data.heading}
        </h2>

        <p className="font-body text-base text-vr-forest/80 leading-relaxed mb-8 whitespace-pre-line">
          {data.body}
        </p>

        {data.quote && (
          <blockquote className="border-l-4 border-vr-floral pl-6 my-8">
            <p className="font-accent text-xl md:text-2xl text-vr-forest leading-snug mb-3">
              &ldquo;{data.quote}&rdquo;
            </p>
            {data.quoteAttribution && (
              <cite className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid not-italic">
                — {data.quoteAttribution}
              </cite>
            )}
          </blockquote>
        )}

        {data.closing && (
          <p className="font-body text-base text-vr-forest/80 leading-relaxed mb-8 whitespace-pre-line">
            {data.closing}
          </p>
        )}

        {data.note && (
          <div className="mt-8 p-5 bg-vr-cream/60 border border-vr-forest/10 rounded-lg">
            <p className="font-body text-sm text-vr-forest/70 leading-relaxed italic">
              {data.note}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
