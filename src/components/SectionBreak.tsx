interface Props {
  bgImage?: string
  bgColor?: string
  eventSlug?: string
}

export default function SectionBreak({ bgImage, bgColor, eventSlug }: Props) {
  const bg = bgColor || '#1B3A24'

  return (
    <div
      className="relative h-28 md:h-36 overflow-hidden flex items-end justify-start"
      style={{
        backgroundColor: bg,
        ...(bgImage && {
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
    >
      {/* Gradient overlay — always present, stronger when there's a bg image */}
      <div
        className="absolute inset-0"
        style={{
          background: bgImage
            ? `linear-gradient(to top, ${bg} 0%, ${bg}cc 40%, ${bg}66 100%)`
            : `linear-gradient(to bottom right, ${bg}ee, ${bg}88)`,
        }}
      />

      {/* Event illustration — faint watermark */}
      {eventSlug && (
        <div className="absolute right-0 bottom-0 h-full flex items-end pointer-events-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/events/${eventSlug}-icon.png`}
            alt=""
            className="h-full w-auto object-contain object-bottom opacity-[0.08] brightness-0 invert"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      {/* Horizontal rule line */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-4">
        <div className="h-px w-full opacity-20" style={{ backgroundColor: '#f3e2cc' }} />
      </div>
    </div>
  )
}
