'use client'
import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['schedule'] }

export default function ScheduleSection({ data }: Props) {
  const [activeDay, setActiveDay] = useState(data.days[0]?.id ?? '')
  const day = data.days.find(d => d.id === activeDay) ?? data.days[0]

  return (
    <SectionWrapper id="schedule" label="Schedule">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8">Schedule</h2>

      {/* Day tabs */}
      {data.days.length > 1 && (
        <div className="flex gap-0 mb-10 border-b border-vr-forest/15">
          {data.days.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDay(d.id)}
              className={`
                font-label text-xs tracking-[0.15em] uppercase px-6 py-3 border-b-2 transition-colors
                ${activeDay === d.id
                  ? 'border-vr-forest text-vr-forest'
                  : 'border-transparent text-vr-mid hover:text-vr-forest'
                }
              `}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {day && (
        <>
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-8">
            {day.date}
          </p>
          <ol className="space-y-0">
            {day.items.map((item, i) => (
              <li
                key={i}
                className="flex gap-6 md:gap-10 group"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full bg-vr-forest shrink-0 mt-1" />
                  {i < day.items.length - 1 && (
                    <div className="w-px flex-1 bg-vr-forest/15 mt-1 mb-1" style={{ minHeight: '2.5rem' }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-1">
                    {item.time}
                  </p>
                  <p className="font-heading text-lg md:text-xl uppercase leading-tight">
                    {item.label}
                  </p>
                  {item.note && (
                    <p className="font-body text-sm text-vr-mid mt-1">{item.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </SectionWrapper>
  )
}
