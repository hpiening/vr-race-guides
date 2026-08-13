'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import RideWithGpsField from './edit/RideWithGpsField'
import { ListControls, AddButton } from './edit/ListControls'
import { StatChips, StatTiles, Accordion, RichBody, rwgStaticMap } from './trailhead/Shared'

type Props = { data: EventData['sections']['courseInfo']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function CourseInfoSection({ data, basePath = 'sections.courseInfo', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <CourseInfoTrailhead data={data} basePath={basePath} editing={editing} />

  return (
    <SectionWrapper id="course-info" label={data.navLabel || data.heading || 'Course Info'} dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">
        <EditableText as="span" value={data.heading || 'Course Info'} path={`${basePath}.heading`} />
      </h2>

      {/* Schedule timeline */}
      {((data.schedule && data.schedule.length > 0) || editing) && (
        <div className="mb-12">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide text-vr-cream">Schedule</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(data.schedule ?? []).map((item, i) => (
              <div key={i} className="bg-vr-cream/5 rounded-lg p-5 border border-vr-cream/10">
                <div className="flex items-start gap-1">
                  <EditableText as="div" className="font-label text-xs tracking-[0.2em] uppercase text-vr-floral mb-2 flex-1" value={item.time} path={`${basePath}.schedule.${i}.time`} />
                  <ListControls path={`${basePath}.schedule`} index={i} count={data.schedule!.length} />
                </div>
                <EditableText as="div" className="font-heading text-sm uppercase leading-tight text-vr-cream" value={item.label} path={`${basePath}.schedule.${i}.label`} />
                <EditableText as="div" className="font-body text-xs text-vr-cream/55 mt-1 leading-relaxed" value={item.note ?? ''} path={`${basePath}.schedule.${i}.note`} />
              </div>
            ))}
          </div>
          <AddButton path={`${basePath}.schedule`} item={{ time: '', label: 'New item' }} label="Add schedule item" />
        </div>
      )}

      {/* Course maps (map embeds/links left as-is; name + stats editable) */}
      {data.distances.length > 0 && (
        <div className="space-y-6 mb-12">
          {data.distances.map((d, i) => (
            <div key={i} className="bg-vr-cream/5 rounded-lg overflow-hidden border border-vr-cream/10">
              <div className="px-5 py-4 flex justify-between items-center border-b border-vr-cream/10">
                <div className="flex-1">
                  <EditableText as="div" className="font-heading text-lg uppercase text-vr-cream" value={d.name} path={`${basePath}.distances.${i}.name`} />
                  <EditableText as="div" className="font-micro text-xs text-vr-cream/50 tracking-wider" value={d.stats ?? ''} path={`${basePath}.distances.${i}.stats`} />
                  {editing && (
                    <div className="mt-2 space-y-1">
                      <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-cream/40">Stat tiles (Trailhead)</p>
                      {(d.statTiles ?? []).map((t, ti) => (
                        <div key={ti} className="flex items-center gap-2">
                          <EditableText as="span" className="font-heading text-vr-cream text-sm w-20" value={t.value} path={`${basePath}.distances.${i}.statTiles.${ti}.value`} placeholder="3.1" />
                          <EditableText as="span" className="font-micro text-xs text-vr-cream/60 flex-1" value={t.label} path={`${basePath}.distances.${i}.statTiles.${ti}.label`} placeholder="Miles" />
                          <ListControls path={`${basePath}.distances.${i}.statTiles`} index={ti} count={d.statTiles!.length} />
                        </div>
                      ))}
                      <AddButton path={`${basePath}.distances.${i}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                    </div>
                  )}
                </div>
                {!editing && (
                  <a href={d.mapUrl} target="_blank" rel="noopener noreferrer" className="font-micro text-xs tracking-widest uppercase text-vr-amber hover:text-vr-cream transition-colors shrink-0 ml-4">
                    View Full Route ↗
                  </a>
                )}
              </div>
              {d.embedUrl && (
                <>
                  <iframe src={d.embedUrl} title={`${d.name} route map`} style={{ width: '100%', height: '500px', border: 'none', display: 'block' }} loading="lazy" scrolling="no" className="print:hidden" />
                  {!editing && <div className="hidden print:block px-5 py-4 text-sm font-body text-vr-cream/70">View route at: {d.mapUrl}</div>}
                </>
              )}
              {!d.embedUrl && d.mapImageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={d.mapImageUrl} alt={`${d.name} course map`} className="w-full object-cover aspect-[16/9]" />
              )}
              <RideWithGpsField itemPath={`${basePath}.distances.${i}`} />
            </div>
          ))}
        </div>
      )}

      {/* Policies grid */}
      {(editing || !data.infoBlocks?.length) && (
        <div className="grid sm:grid-cols-2 gap-6">
          {([
            { label: 'Aid Stations', key: 'aidStations', text: data.aidStations },
            { label: 'Recovery Food', key: 'recoveryFood', text: data.recoveryFood },
            { label: 'Strollers', key: 'strollerPolicy', text: data.strollerPolicy },
            { label: 'Dogs', key: 'dogPolicy', text: data.dogPolicy },
          ] as const).map(item => (
            <div key={item.key} className="border-t border-vr-cream/10 pt-4">
              <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-2">{item.label}</p>
              <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed" value={item.text} path={`${basePath}.${item.key}`} />
            </div>
          ))}
        </div>
      )}

      {/* Detailed info blocks */}
      {((data.infoBlocks && data.infoBlocks.length > 0) || editing) && (
        <div className="space-y-8 border-t border-vr-cream/10 pt-8 mt-8">
          {(data.infoBlocks ?? []).map((block, i) => (
            <div key={i} className="border-b border-vr-cream/10 pb-8 last:border-0">
              <div className="flex items-start gap-2">
                <EditableText as="h3" className="font-heading text-base uppercase text-vr-cream mb-3 tracking-wide flex-1" value={block.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                <ListControls path={`${basePath}.infoBlocks`} index={i} count={data.infoBlocks!.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed whitespace-pre-line" value={block.body} path={`${basePath}.infoBlocks.${i}.body`} />
              {!editing && block.linkLabel && block.linkUrl && (
                <a href={block.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 border border-vr-cream/30 text-vr-cream rounded hover:bg-vr-cream/10 transition-colors">
                  {block.linkLabel}
                </a>
              )}
              {editing && (
                <div className="mt-2">
                  <EditableText as="div" className="font-label text-xs uppercase text-vr-cream/70" value={block.linkLabel ?? ''} path={`${basePath}.infoBlocks.${i}.linkLabel`} placeholder="Button label (optional)" />
                  <EditableUrl path={`${basePath}.infoBlocks.${i}.linkUrl`} label="Button URL" />
                </div>
              )}
            </div>
          ))}
          <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
        </div>
      )}
    </SectionWrapper>
  )
}

/* ── Trailhead view (renders in both view + edit mode) ── */
function CourseInfoTrailhead({ data, basePath, editing }: { data: EventData['sections']['courseInfo']; basePath: string; editing: boolean }) {
  return (
    <section id="course-info" className="relative bg-vr-deep overflow-hidden px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <div className="mb-10">
          {/* Skip the "The course" eyebrow when the heading already says "course"
              (redundant, e.g. "Course Info"); keep it for headings like "5K Info". */}
          {!/course/i.test(data.heading || 'Course Info') && (
            <div className="leading-[0.9]"><span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>The course</span></div>
          )}
          <h2 className="font-display uppercase text-vr-cream leading-[0.9] mt-0.5 m-0" style={{ fontSize: 'clamp(40px,5.6vw,76px)' }}>
            <EditableText as="span" value={data.heading || 'Course Info'} path={`${basePath}.heading`} />
          </h2>
        </div>

        {data.distances.map((d, i) => {
          // Only reserve the map column when there's a route embed / image (or
          // in the editor, so the RideWithGPS paste field is always reachable).
          const hasMap = !!(d.embedUrl || d.mapImageUrl)
          return (
          <div key={i} className={`grid gap-6 items-start mb-10 ${(hasMap || editing) ? 'md:grid-cols-[1.5fr_1fr]' : ''}`}>
            {(hasMap || editing) && (
            <div className="border border-vr-cream/20 rounded-lg overflow-hidden">
              {d.embedUrl && (
                <iframe src={d.embedUrl} title={`${d.name} route map`} style={{ width: '100%', height: '440px', border: 'none', display: 'block' }} loading="lazy" scrolling="no" className="print:hidden" />
              )}
              {/* Static course map: on screen only when there's no live embed;
                  in the PDF it's shown in place of the (unprintable) iframe. */}
              {d.mapImageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={d.mapImageUrl} alt={`${d.name} course map`} className={`w-full object-cover aspect-[16/10] ${d.embedUrl ? 'hidden print:block' : ''}`} />
              )}
              {/* No manual static image: fall back to RideWithGPS's own static
                  render of the route so the PDF shows the same map as the live
                  embed (which can't print). Keep a labelled placeholder only if
                  the embed isn't a RideWithGPS route. */}
              {d.embedUrl && !d.mapImageUrl && (
                rwgStaticMap(d.embedUrl) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={rwgStaticMap(d.embedUrl)} alt={`${d.name} course map`} className="hidden print:block w-full object-contain aspect-[16/10] bg-white" />
                ) : (
                  <div className="hidden print:flex aspect-[16/10] items-center justify-center">
                    <span className="font-micro uppercase tracking-[0.14em] text-vr-cream/45 text-[11px]">Course map</span>
                  </div>
                )
              )}
              <RideWithGpsField itemPath={`${basePath}.distances.${i}`} />
              {editing && (
                <div className="px-3 pb-3"><EditableImage path={`${basePath}.distances.${i}.mapImageUrl`} label="Course map image (shows in the PDF export)" /></div>
              )}
            </div>
            )}
            <div className="flex flex-col gap-4">
              <EditableText as="div" className="font-heading uppercase text-vr-cream text-[20px] tracking-[0.02em]" value={d.name} path={`${basePath}.distances.${i}.name`} />
              {editing ? (
                <div className="space-y-1">
                  <EditableText as="div" className="font-micro text-xs text-vr-cream/75" value={d.stats ?? ''} path={`${basePath}.distances.${i}.stats`} placeholder="Fallback stats string" />
                  <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-cream/70 pt-1">Stat tiles</p>
                  {(d.statTiles ?? []).map((t, ti) => (
                    <div key={ti} className="flex items-center gap-2">
                      <div className="w-24 shrink-0"><EditableText as="div" className="font-heading text-sm" value={t.value} path={`${basePath}.distances.${i}.statTiles.${ti}.value`} placeholder="3.1" /></div>
                      <div className="flex-1"><EditableText as="div" className="font-micro text-xs" value={t.label} path={`${basePath}.distances.${i}.statTiles.${ti}.label`} placeholder="Miles" /></div>
                      <ListControls path={`${basePath}.distances.${i}.statTiles`} index={ti} count={d.statTiles!.length} />
                    </div>
                  ))}
                  <AddButton path={`${basePath}.distances.${i}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                </div>
              ) : d.statTiles && d.statTiles.length > 0 ? <StatTiles tiles={d.statTiles} /> : <StatChips stats={d.stats} dark />}
              {!editing && hasMap && (
                <a href={d.mapUrl} target="_blank" rel="noopener noreferrer" className="self-start font-label text-xs tracking-[0.12em] uppercase text-vr-sky hover:text-vr-cream transition-colors">
                  View full route ↗
                </a>
              )}
            </div>
          </div>
          )
        })}

        {(data.schedule && data.schedule.length > 0 || editing) && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {(data.schedule ?? []).map((item, i) => (
              <div key={i} className="bg-vr-cream/5 border border-vr-cream/10 rounded-lg p-5">
                <div className="flex items-start gap-1">
                  <EditableText as="div" className="font-label text-xs tracking-[0.16em] uppercase text-vr-sky mb-2 flex-1" value={item.time} path={`${basePath}.schedule.${i}.time`} />
                  <ListControls path={`${basePath}.schedule`} index={i} count={data.schedule!.length} />
                </div>
                <EditableText as="div" className="font-heading text-sm uppercase leading-tight text-vr-cream" value={item.label} path={`${basePath}.schedule.${i}.label`} />
                <EditableText as="div" className="font-body text-xs text-vr-cream/60 mt-1" value={item.note ?? ''} path={`${basePath}.schedule.${i}.note`} />
              </div>
            ))}
            <div className="col-span-full"><AddButton path={`${basePath}.schedule`} item={{ time: '', label: 'New item' }} label="Add schedule item" /></div>
          </div>
        )}

        {editing ? (
          <div className="flex flex-col gap-3">
            {(data.infoBlocks ?? []).map((b, i) => (
              <div key={i} className="bg-vr-cream rounded-lg p-5">
                <div className="flex items-start gap-2">
                  <EditableText as="h3" className="font-heading uppercase text-vr-forest flex-1" value={b.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                  <ListControls path={`${basePath}.infoBlocks`} index={i} count={data.infoBlocks!.length} />
                </div>
                <EditableText as="div" className="font-body text-vr-forest/85 mt-2 whitespace-pre-line" value={b.body} path={`${basePath}.infoBlocks.${i}.body`} />
              </div>
            ))}
            <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
          </div>
        ) : data.infoBlocks && data.infoBlocks.length > 0 ? (
          <Accordion
            items={data.infoBlocks.map(b => ({
              heading: b.heading,
              body: (
                <>
                  <RichBody value={b.body} />
                  {b.linkLabel && b.linkUrl && (
                    <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 font-micro text-xs tracking-widest uppercase text-vr-sky hover:text-vr-forest transition-colors">
                      {b.linkLabel} ↗
                    </a>
                  )}
                </>
              ),
            }))}
          />
        ) : null}
      </div>
    </section>
  )
}
