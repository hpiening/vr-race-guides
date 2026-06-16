'use client'
import { useState } from 'react'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['schedule']; eventSlug: string }

export default function ScheduleSection({ data, eventSlug }: Props) {
  const [activeDay, setActiveDay] = useState(data.days[0]?.id ?? '')
  const day = data.days.find(d => d.id === activeDay) ?? data.days[0]

  return (
    <section id="schedule" className="relative py-16 md:py-24 px-6 md:px-12 bg-vr-forest text-vr-cream overflow-hidden">

      <div
        className="absolute right-0 bottom-0 w-[55%] max-w-2xl opacity-[0.06] pointer-events-none select-none translate-x-[10%] translate-y-[5%]"
        aria-hidden="true"
      >
        <img
          src={`/images/events/${eventSlug}-icon.png`}
          alt=""
          className="w-full h-auto"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-cream/40 mb-2">Schedule</p>
        <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Schedule</h2>

        {data.days.length > 1 && (
          <div className="flex gap-0 mb-10 border-b border-vr-cream/15 print:hidden">
            {data.days.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                className={`
                  font-label text-xs tracking-[0.15em] uppercase px-6 py-3 border-b-2 transition-colors
                  ${activeDay === d.id
                    ? 'border-vr-cream text-vr-cream'
                    : 'border-transparent text-vr-cream/40 hover:text-vr-cream/70'
                  }
                `}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {/* On screen: the selected day (tabbed) */}
        {day && (
          <div className="print:hidden">
            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-8">
              {day.date}
            </p>
            <ol className="space-y-0">
              {day.items.map((item, i) => (
                <li key={i} className="flex gap-6 md:gap-10">
                  <div className="flex flex-col items-center pt-1.5">
                    <div className="w-2 h-2 rounded-full bg-vr-floral shrink-0" />
                    {i < day.items.length - 1 && (
                      <div className="w-px flex-1 bg-vr-cream/15 mt-1 mb-1" style={{ minHeight: '2.5rem' }} />
                    )}
                  </div>
                  <div className="pb-8 flex-1">
                    <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-1">
                      {item.time}
                    </p>
                    <p className="font-heading text-lg md:text-xl uppercase leading-tight text-vr-cream">
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="font-body text-sm text-vr-cream/55 mt-1 leading-relaxed">{item.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* In print/PDF: every day expanded — tabs can't be clicked on paper */}
        <div className="hidden print:block">
          {data.days.map(d => (
            <div key={d.id} className="mb-8">
              <p className="font-heading text-lg uppercase leading-tight text-vr-cream mb-1">{d.label}</p>
              <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-4">{d.date}</p>
              <ol className="space-y-0">
                {d.items.map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="pb-4 flex-1">
                      <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-1">{item.time}</p>
                      <p className="font-heading text-base uppercase leading-tight text-vr-cream">{item.label}</p>
                      {item.note && (
                        <p className="font-body text-sm text-vr-cream/55 mt-1 leading-relaxed">{item.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
