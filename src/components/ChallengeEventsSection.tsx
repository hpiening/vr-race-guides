'use client'
import SectionWrapper from './SectionWrapper'
import { ChallengeEventsData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: ChallengeEventsData; basePath?: string }

export default function ChallengeEventsSection({ data, basePath = 'sections.challengeEvents' }: Props) {
  const editing = !!useEditOptional()?.editing

  return (
    <SectionWrapper id="challenge-events" label="Challenge Events" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-4 text-vr-cream">Challenge Events</h2>

      {(editing || data.intro) && (
        <div className="font-body text-base text-vr-cream/70 leading-relaxed mb-10 max-w-2xl">
          <EditableText as="div" value={data.intro ?? ''} path={`${basePath}.intro`} />
        </div>
      )}

      <div className="space-y-12">
        {data.events.map((evt, i) => {
          const ep = `${basePath}.events.${i}`
          return (
            <div key={i} className="border border-vr-cream/15 rounded-xl overflow-hidden">
              <div className="bg-vr-cream/15 px-6 py-5 md:px-8">
                <div className="flex items-start gap-2">
                  <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-cream/50 mb-1 flex-1">Challenge Event</p>
                  <ListControls path={`${basePath}.events`} index={i} count={data.events.length} />
                </div>
                <EditableText as="h3" className="font-display text-3xl md:text-4xl uppercase text-vr-cream leading-none" value={evt.name} path={`${ep}.name`} />
                {(editing || evt.tagline) && (
                  <EditableText as="div" className="font-label text-sm tracking-widest uppercase text-vr-cream/60 mt-1" value={evt.tagline ?? ''} path={`${ep}.tagline`} />
                )}
              </div>

              <div className="p-6 md:p-8 bg-vr-cream/5">
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="border border-vr-cream/10 rounded-lg p-5 bg-vr-cream/5">
                    <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Dates</p>
                    <EditableText as="div" className="font-heading text-base uppercase text-vr-cream" value={evt.dates} path={`${ep}.dates`} />
                  </div>
                  {(editing || evt.totalMileage) && (
                    <div className="border border-vr-cream/10 rounded-lg p-5 bg-vr-cream/5">
                      <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Total Mileage</p>
                      <EditableText as="div" className="font-heading text-base uppercase text-vr-cream" value={evt.totalMileage ?? ''} path={`${ep}.totalMileage`} />
                    </div>
                  )}
                </div>

                <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed mb-8" value={evt.description} path={`${ep}.description`} />

                {(evt.includes.length > 0 || editing) && (
                  <div className="mb-8">
                    <h4 className="font-heading text-base uppercase text-vr-cream mb-4 tracking-wide">What&apos;s Included</h4>
                    <ul className="space-y-2">
                      {evt.includes.map((item, j) => (
                        <li key={j} className="flex gap-3 items-start">
                          <span className="text-vr-floral mt-0.5 shrink-0">&#9658;</span>
                          <div className="font-body text-sm text-vr-cream/80 leading-relaxed flex-1">
                            <EditableText as="div" value={item} path={`${ep}.includes.${j}`} />
                          </div>
                          <ListControls path={`${ep}.includes`} index={j} count={evt.includes.length} />
                        </li>
                      ))}
                    </ul>
                    <AddButton path={`${ep}.includes`} item="New item" label="Add included item" />
                  </div>
                )}

                <div className="mb-6 p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                  <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Bib Pick-Up</p>
                  <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed" value={evt.bibPickup} path={`${ep}.bibPickup`} />
                </div>

                <div className="mb-6 p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                  <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Medals</p>
                  <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed" value={evt.medals} path={`${ep}.medals`} />
                </div>

                {(editing || evt.swag) && (
                  <div className="p-5 border border-vr-cream/10 rounded-lg bg-vr-cream/5">
                    <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">Swag</p>
                    <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed" value={evt.swag ?? ''} path={`${ep}.swag`} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AddButton path={`${basePath}.events`} item={{ name: 'New Challenge', description: '', dates: '', includes: [], bibPickup: '', medals: '' }} label="Add challenge event" />
    </SectionWrapper>
  )
}
