'use client'
import SectionWrapper from './SectionWrapper'
import { ChallengeEventsData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, Accordion } from './trailhead/Shared'

type Props = { data: ChallengeEventsData; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function ChallengeEventsSection({ data, basePath = 'sections.challengeEvents', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <ChallengeEventsTrailhead data={data} basePath={basePath} editing={editing} />

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

                {editing && (
                  <div className="mb-8 space-y-1">
                    <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-cream/40">Stat tiles (Trailhead)</p>
                    {(evt.statTiles ?? []).map((t, ti) => (
                      <div key={ti} className="flex items-center gap-2">
                        <EditableText as="span" className="font-heading text-vr-cream text-sm w-20" value={t.value} path={`${ep}.statTiles.${ti}.value`} placeholder="16.2" />
                        <EditableText as="span" className="font-micro text-xs text-vr-cream/60 flex-1" value={t.label} path={`${ep}.statTiles.${ti}.label`} placeholder="Total Miles" />
                        <ListControls path={`${ep}.statTiles`} index={ti} count={evt.statTiles!.length} />
                      </div>
                    ))}
                    <AddButton path={`${ep}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                  </div>
                )}

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

/* ── Trailhead view (renders in both view + edit mode) ── */
function ChallengeEventsTrailhead({ data, basePath, editing }: { data: ChallengeEventsData; basePath: string; editing: boolean }) {
  return (
    <section id="challenge-events" className="bg-vr-night px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader dark eyebrow="Go further · Challenge event" title="Challenge Events" className="mb-10" />
        {(data.intro || editing) && (
          <div className="font-body text-vr-cream/[0.82] leading-[1.7] max-w-[720px] mb-10" style={{ fontSize: '17px' }}>
            <EditableText as="div" value={data.intro ?? ''} path={`${basePath}.intro`} />
          </div>
        )}

        {data.events.map((evt, i) => {
          const ep = `${basePath}.events.${i}`
          return (
            <div key={i} className="mb-12 last:mb-0">
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr] items-stretch">
                <div className="border border-vr-cream/20 rounded-lg p-9" style={{ background: 'linear-gradient(140deg,#264533,#1a2f23)' }}>
                  <div className="flex items-start gap-2">
                    <h3 className="font-display uppercase text-vr-cream leading-none m-0 flex-1" style={{ fontSize: 'clamp(30px,4vw,46px)' }}>
                      <EditableText as="span" value={evt.name} path={`${ep}.name`} />
                    </h3>
                    <ListControls path={`${basePath}.events`} index={i} count={data.events.length} />
                  </div>
                  {(evt.tagline || editing) && (
                    <EditableText as="div" className="font-label uppercase text-vr-cream/60 mt-2 mb-5 text-[13px] tracking-[0.1em]" value={evt.tagline ?? ''} path={`${ep}.tagline`} />
                  )}
                  <EditableText as="div" className="font-body text-vr-cream/85 leading-[1.7] max-w-[560px] mb-6 text-[16px]" value={evt.description} path={`${ep}.description`} />
                  {editing ? (
                    <div className="space-y-1">
                      <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-cream/70">Stat tiles</p>
                      {(evt.statTiles ?? []).map((t, k) => (
                        <div key={k} className="flex items-center gap-2">
                          <EditableText as="span" className="font-heading text-vr-cream text-sm w-24" value={t.value} path={`${ep}.statTiles.${k}.value`} placeholder="16.2" />
                          <EditableText as="span" className="font-micro text-xs text-vr-cream/85 flex-1" value={t.label} path={`${ep}.statTiles.${k}.label`} placeholder="Total Miles" />
                          <ListControls path={`${ep}.statTiles`} index={k} count={evt.statTiles!.length} />
                        </div>
                      ))}
                      <AddButton path={`${ep}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                    </div>
                  ) : (
                    <div className="flex gap-9 flex-wrap">
                      {(evt.statTiles && evt.statTiles.length > 0
                        ? evt.statTiles
                        : [
                            ...(evt.totalMileage ? [{ value: evt.totalMileage.replace(/\s*miles?/i, ''), label: 'Total Miles' }] : []),
                            ...(evt.dates ? [{ value: '2', label: 'Races · 1 Weekend' }] : []),
                          ]
                      ).map((t, k) => (
                        <div key={k}>
                          <div className="font-display text-vr-sky leading-none" style={{ fontSize: '44px' }}>{t.value}</div>
                          <div className="font-micro uppercase text-vr-cream/60 mt-1.5" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>{t.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(evt.includes.length > 0 || editing) && (
                  <div className="border border-vr-cream/20 rounded-lg p-8 bg-vr-deep">
                    <h4 className="font-heading uppercase text-vr-cream mb-4" style={{ fontSize: '15px', letterSpacing: '0.06em' }}>Includes</h4>
                    <div className="flex flex-col gap-3.5">
                      {evt.includes.map((it, j) => (
                        <div key={j} className="flex gap-3 items-start">
                          <span className="text-vr-sky font-extrabold shrink-0">✦</span>
                          <div className="font-body text-vr-cream/85 leading-[1.5] flex-1" style={{ fontSize: '15px' }}>
                            <EditableText as="div" value={it} path={`${ep}.includes.${j}`} />
                          </div>
                          <ListControls path={`${ep}.includes`} index={j} count={evt.includes.length} />
                        </div>
                      ))}
                    </div>
                    <AddButton path={`${ep}.includes`} item="New item" label="Add included item" />
                  </div>
                )}
              </div>

              <div className="mt-6">
                {editing ? (
                  <div className="flex flex-col gap-3">
                    {([
                      { label: 'Bib Pickup', key: 'bibPickup', val: evt.bibPickup },
                      { label: 'Medals', key: 'medals', val: evt.medals },
                      { label: 'Swag', key: 'swag', val: evt.swag ?? '' },
                    ] as const).map(f => (
                      <div key={f.key} className="bg-vr-cream rounded-lg p-5">
                        <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-forest/50 mb-1">{f.label}</p>
                        <EditableText as="div" className="font-body text-vr-forest/85 whitespace-pre-line" value={f.val} path={`${ep}.${f.key}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Accordion
                    items={[
                      { heading: 'Bib Pickup', body: evt.bibPickup },
                      { heading: 'Medals', body: evt.medals },
                      ...(evt.swag ? [{ heading: 'Swag', body: evt.swag }] : []),
                    ]}
                  />
                )}
              </div>
            </div>
          )
        })}
        <AddButton path={`${basePath}.events`} item={{ name: 'New Challenge', description: '', dates: '', includes: [], bibPickup: '', medals: '' }} label="Add challenge event" />
      </div>
    </section>
  )
}
