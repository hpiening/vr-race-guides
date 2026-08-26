'use client'
import { useState } from 'react'
import { RichBody } from './trailhead/Shared'
import { EventData, ScheduleKind } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['schedule']; eventSlug: string; basePath?: string; theme?: 'classic' | 'trailhead' }

/**
 * Keep the meridiem glued to the time it belongs to. The time column is a fixed
 * width, so a range like "2:00 - 8:00 PM" wraps — and it was breaking before the
 * "PM", orphaning it on its own line. A non-breaking space moves the break
 * earlier instead, so it reads "2:00 -" / "8:00 PM".
 */
function keepMeridiem(time: string): string {
  return time.replace(/\s+(AM|PM)\b/gi, '\u00a0$1')
}


/**
 * Schedule categories. Each row can carry a `kind`, which colours a left rule
 * and shows an icon, so a five-day festival timetable can be scanned for "where
 * are the races / the clinics / the food" without reading every line. Colour is
 * never the only cue: every category has an icon and a legend entry, and the
 * colours come from CSS vars so a brand can retint them.
 */
const KINDS: Record<ScheduleKind, { label: string; color: string; path: string }> = {
  race:          { label: 'Race',          color: 'var(--tl-kind-race)',          path: 'M4 2v20M4 3h11l-1.5 3.5L15 10H4' },
  clinic:        { label: 'Clinics',       color: 'var(--tl-kind-clinic)',        path: 'M12 21c0-6 3-9 8-10-1 6-4 9-8 10zM12 21C12 15 9 12 4 11c1 6 4 9 8 10z' },
  entertainment: { label: 'Entertainment', color: 'var(--tl-kind-entertainment)', path: 'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z' },
  food:          { label: 'Food & drink',  color: 'var(--tl-kind-food)',          path: 'M6 3v8a2 2 0 004 0V3M8 11v10M18 3c-1.5 0-2.5 1.5-2.5 4s1 3.5 2.5 3.5 2.5-1 2.5-3.5S19.5 3 18 3zM18 11v10' },
  essential:     { label: 'Essentials',    color: 'var(--tl-kind-essential)',     path: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3.5 2' },
}

const KIND_ORDER: ScheduleKind[] = ['race', 'clinic', 'entertainment', 'food', 'essential']

function KindIcon({ kind, size = 15 }: { kind: ScheduleKind; size?: number }) {
  const k = KINDS[kind]
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke={k.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
      className="shrink-0"
      style={{ marginTop: 1 }}
    >
      <path d={k.path} />
    </svg>
  )
}

export default function ScheduleSection({ data, eventSlug, basePath = 'sections.schedule', theme = 'classic' }: Props) {
  const [activeDay, setActiveDay] = useState(data.days[0]?.id ?? '')
  const day = data.days.find(d => d.id === activeDay) ?? data.days[0]
  // Only show the legend for categories this guide actually uses.
  const usedKinds = KIND_ORDER.filter(k => data.days.some(d => d.items.some(i => i.kind === k)))
  const ctx = useEditOptional()
  const editing = !!ctx?.editing
  const dp = `${basePath}.days`
  const isHighlighted = (item: EventData['sections']['schedule']['days'][number]['items'][number]) =>
    item.highlight ?? /\bstart/i.test(item.label)

  // Optional faint full-section background photo (sits behind the corner
  // watermark and the content; content is z-10 so text stays legible).
  const bgPhoto = data.backgroundImage ? (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={data.backgroundImage} alt="" className="w-full h-full object-cover opacity-[0.15]" />
    </div>
  ) : null

  const watermark = (
    <div
      className="tl-watermark absolute right-0 bottom-0 w-[55%] max-w-2xl opacity-[0.06] pointer-events-none select-none translate-x-[10%] translate-y-[5%]"
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
  )

  // ── Shared edit branch — identical inline-editing UX for both themes ──
  if (editing) {
    return (
      <section id="schedule" className="relative py-16 md:py-24 px-6 md:px-12 bg-vr-forest text-vr-cream overflow-hidden">
        {bgPhoto}
        {watermark}
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-cream/40 mb-2">Schedule</p>
          <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Schedule</h2>
          <div className="mb-8"><EditableImage path={`${basePath}.backgroundImage`} label="Schedule background photo (shown faint)" /></div>
          <div>
            {data.days.map((d, di) => (
              <div key={di} className="mb-10 border-b border-vr-cream/10 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <EditableText as="div" className="font-heading text-lg uppercase text-vr-cream flex-1" value={d.label} path={`${dp}.${di}.label`} />
                  <ListControls path={dp} index={di} count={data.days.length} />
                </div>
                <EditableText as="div" className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-4" value={d.date} path={`${dp}.${di}.date`} />
                <ol className="space-y-3">
                  {d.items.map((item, ii) => {
                    const hl = isHighlighted(item)
                    return (
                      <li
                        key={ii}
                        className="flex gap-4 items-start rounded px-2 py-1.5"
                        style={hl ? { background: 'var(--tl-row-highlight)' } : undefined}
                      >
                        <div className="flex-1">
                          <EditableText as="div" className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-1" value={item.time} path={`${dp}.${di}.items.${ii}.time`} />
                          <EditableText as="div" className="font-heading text-base uppercase leading-tight text-vr-cream" value={item.label} path={`${dp}.${di}.items.${ii}.label`} />
                          <EditableText as="div" className="font-body text-sm text-vr-cream/55 mt-1" value={item.note ?? ''} path={`${dp}.${di}.items.${ii}.note`} />
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 align-middle select-none">
                          <select
                            value={item.kind ?? ''}
                            onChange={e => ctx?.setValue(`${dp}.${di}.items.${ii}.kind`, e.target.value || undefined)}
                            title="Category — colours the row and adds an icon on the published page"
                            aria-label="Schedule category"
                            className="bg-vr-cream/10 border border-vr-cream/25 rounded text-vr-cream font-micro text-[10px] uppercase tracking-wider px-1.5 py-1"
                          >
                            <option value="">No category</option>
                            {KIND_ORDER.map(k => <option key={k} value={k}>{KINDS[k].label}</option>)}
                          </select>
                          <button
                            type="button"
                            onClick={() => ctx?.setValue(`${dp}.${di}.items.${ii}.highlight`, !hl)}
                            title={hl ? 'Highlighted — click to remove' : 'Not highlighted — click to highlight'}
                            aria-label="Toggle highlight"
                            className={`px-1.5 text-sm leading-none ${hl ? 'text-vr-sky opacity-100' : 'text-vr-cream opacity-40 hover:opacity-80'}`}
                          >
                            {hl ? '★' : '☆'}
                          </button>
                          <ListControls path={`${dp}.${di}.items`} index={ii} count={d.items.length} />
                        </span>
                      </li>
                    )
                  })}
                </ol>
                <AddButton path={`${dp}.${di}.items`} item={{ time: '', label: 'New item' }} label="Add item" />
              </div>
            ))}
            <AddButton path={dp} item={{ id: `day-${data.days.length + 1}`, label: 'New Day', date: '', items: [] }} label="Add day" />
          </div>
        </div>
      </section>
    )
  }

  // ── Trailhead view — centered, day pills, time-rail timeline ──
  if (theme === 'trailhead') {
    return (
      <section id="schedule" className="relative bg-vr-forest overflow-hidden px-6 md:px-12 py-20 md:py-[104px]">
        {bgPhoto}
        {watermark}
        <div className="relative z-10 max-w-[880px] mx-auto text-center">
          <div className="leading-[0.9]">
            <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>Race weekend</span>
          </div>
          <h2 className="font-display uppercase text-vr-cream leading-[0.9] mt-0.5 mb-10" style={{ fontSize: 'clamp(40px,6vw,80px)' }}>Schedule</h2>

          {usedKinds.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-7">
              {usedKinds.map(k => (
                <span key={k} className="inline-flex items-center gap-2 font-micro uppercase text-vr-cream/70"
                      style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
                  <KindIcon kind={k} size={13} />
                  {KINDS[k].label}
                </span>
              ))}
            </div>
          )}

          {data.days.length > 1 && (
            <div className="inline-flex flex-wrap justify-center gap-1.5 p-1.5 mb-12 rounded-full bg-vr-cream/[0.08] border border-vr-cream/[0.16] print:hidden">
              {data.days.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDay(d.id)}
                  className={`font-label text-xs tracking-[0.12em] uppercase px-4 md:px-5 py-2.5 rounded-full transition-colors ${
                    activeDay === d.id ? 'bg-vr-cream text-vr-forest' : 'text-vr-cream/55 hover:text-vr-cream'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {/* Selected day gets the same filled label bar as the group headings
              elsewhere in the guide. It also carries the date, which the screen
              schedule never showed - the pills only say "Day 2 · Bryce Canyon". */}
          {day && (
            <div className="tl-day-bar max-w-[580px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 rounded bg-vr-cream text-vr-forest print:hidden">
              <span className="font-heading uppercase text-[15px] tracking-[0.08em]">{day.label}</span>
              <span className="font-micro uppercase text-[11px] tracking-[0.16em] opacity-70">{day.date}</span>
            </div>
          )}

          {/* on screen: selected day */}
          {day && (
            <div className="max-w-[580px] mx-auto text-left flex flex-col print:hidden">
              {day.items.map((item, i) => {
                const highlight = item.highlight ?? /\bstart/i.test(item.label)
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[112px_1fr] md:grid-cols-[136px_1fr] gap-3 md:gap-5 pl-3 pr-2 py-[18px] border-b border-vr-cream/[0.12] border-l-[3px]"
                    style={{
                      background: highlight ? 'var(--tl-row-highlight)' : undefined,
                      borderLeftColor: item.kind ? KINDS[item.kind].color : 'transparent',
                    }}
                  >
                    <span className="font-label text-vr-sky text-right text-[13px] md:text-[15px]" style={{ letterSpacing: '0.02em' }}>{keepMeridiem(item.time)}</span>
                    <div>
                      <div className="flex items-start gap-2">
                        {item.kind && <KindIcon kind={item.kind} />}
                        <div className="font-heading uppercase text-vr-cream leading-tight flex-1" style={{ fontSize: '15px', letterSpacing: '0.04em' }}>{item.label}</div>
                      </div>
                      {item.note && <div className="text-vr-cream/60 mt-1 whitespace-pre-line break-words" style={{ fontSize: '13px' }}><RichBody value={item.note} /></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* print: every day expanded */}
          <div className="hidden print:block text-left max-w-[580px] mx-auto">
            {data.days.map(d => (
              <div key={d.id} className="tl-print-day mb-6">
                <div className="tl-day-bar flex flex-wrap items-baseline justify-between gap-x-4 px-4 py-2 rounded bg-vr-cream text-vr-forest mb-3">
                  <span className="font-heading text-lg uppercase">{d.label}</span>
                  <span className="font-micro text-xs tracking-[0.2em] uppercase opacity-70">{d.date}</span>
                </div>
                {d.items.map((item, i) => (
                  <div key={i} className="tl-print-row grid grid-cols-[132px_1fr] gap-6 py-2 border-b border-vr-cream/[0.12]">
                    <span className="font-label text-vr-sky text-right text-sm">{keepMeridiem(item.time)}</span>
                    <div>
                      <div className="flex items-start gap-2">
                        {item.kind && <KindIcon kind={item.kind} size={13} />}
                        <div className="font-heading uppercase text-vr-cream text-sm flex-1">{item.label}</div>
                      </div>
                      {item.note && <div className="text-vr-cream/60 text-xs mt-0.5 whitespace-pre-line break-words"><RichBody value={item.note} /></div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Classic view ──
  return (
    <section id="schedule" className="relative py-16 md:py-24 px-6 md:px-12 bg-vr-forest text-vr-cream overflow-hidden">
      {watermark}
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
                      {keepMeridiem(item.time)}
                    </p>
                    <p className="font-heading text-lg md:text-xl uppercase leading-tight text-vr-cream">
                      {item.label}
                    </p>
                    {item.note && (
                      <p className="font-body text-sm text-vr-cream/55 mt-1 leading-relaxed whitespace-pre-line break-words"><RichBody value={item.note} /></p>
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
                      <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-1">{keepMeridiem(item.time)}</p>
                      <p className="font-heading text-base uppercase leading-tight text-vr-cream">{item.label}</p>
                      {item.note && (
                        <p className="font-body text-sm text-vr-cream/55 mt-1 leading-relaxed whitespace-pre-line break-words"><RichBody value={item.note} /></p>
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
