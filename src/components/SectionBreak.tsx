'use client'

interface Props {
  bgImage?: string
  eventSlug?: string
}

export default function SectionBreak({ bgImage, eventSlug }: Props) {
  return (
    <div
      className="relative py-12 md:py-16 px-6 md:px-12 bg-vr-forest overflow-hidden"
      style={bgImage ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Same gradient overlay as hero when a bg image is set */}
      {bgImage && (
        <div className="absolute inset-0 bg-vr-forest/70" />
      )}

      {/* Pine tree watermark — identical treatment to ScheduleSection */}
      {eventSlug && (
        <div
          className="absolute right-0 bottom-0 w-[55%] max-w-2xl opacity-[0.06] pointer-events-none select-none translate-x-[10%] translate-y-[5%]"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/events/${eventSlug}-icon.png`}
            alt=""
            className="w-full h-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      {/* Subtle cream divider line */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="h-px w-full bg-vr-cream opacity-10" />
      </div>
    </div>
  )
}
