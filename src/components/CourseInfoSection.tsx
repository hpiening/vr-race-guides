'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import RideWithGpsField from './edit/RideWithGpsField'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, StatChips, Accordion } from './trailhead/Shared'

type Props = { data: EventData['sections']['courseInfo']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function CourseInfoSection({ data, basePath = 'sections.courseInfo', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead' && !editing) return <CourseInfoTrailhead data={data} />

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

/* ── Trailhead view (display-only) ── */
function CourseInfoTrailhead({ data }: { data: EventData['sections']['courseInfo'] }) {
  return (
    <section id="course-info" className="relative bg-vr-deep overflow-hidden px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader dark eyebrow="The course" title={data.heading || 'Course Info'} className="mb-10" />

        {data.distances.map((d, i) => (
          <div key={i} className="grid gap-6 md:grid-cols-[1.5fr_1fr] items-start mb-10">
            <div className="border border-vr-cream/20 rounded-lg overflow-hidden">
              {d.embedUrl ? (
                <>
                  <iframe src={d.embedUrl} title={`${d.name} route map`} style={{ width: '100%', height: '440px', border: 'none', display: 'block' }} loading="lazy" scrolling="no" className="print:hidden" />
                  <div className="hidden print:block px-5 py-4 text-sm font-body text-vr-cream/70">View route at: {d.mapUrl}</div>
                </>
              ) : d.mapImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={d.mapImageUrl} alt={`${d.name} course map`} className="w-full object-cover aspect-[16/10]" />
              ) : null}
            </div>
            <div className="flex flex-col gap-5">
              <div className="font-heading uppercase text-vr-cream" style={{ fontSize: '20px', letterSpacing: '0.02em' }}>{d.name}</div>
              <StatChips stats={d.stats} dark />
              <a href={d.mapUrl} target="_blank" rel="noopener noreferrer" className="self-start font-label text-xs tracking-[0.12em] uppercase text-vr-sky hover:text-vr-cream transition-colors">
                View full route ↗
              </a>
            </div>
          </div>
        ))}

        {data.schedule && data.schedule.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {data.schedule.map((item, i) => (
              <div key={i} className="bg-vr-cream/5 border border-vr-cream/10 rounded-lg p-5">
                <div className="font-label text-xs tracking-[0.16em] uppercase text-vr-sky mb-2">{item.time}</div>
                <div className="font-heading text-sm uppercase leading-tight text-vr-cream">{item.label}</div>
                {item.note && <div className="font-body text-xs text-vr-cream/60 mt-1">{item.note}</div>}
              </div>
            ))}
          </div>
        )}

        {data.infoBlocks && data.infoBlocks.length > 0 && (
          <Accordion
            items={data.infoBlocks.map(b => ({
              heading: b.heading,
              body: (
                <>
                  {b.body}
                  {b.linkLabel && b.linkUrl && (
                    <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 font-micro text-xs tracking-widest uppercase text-vr-sky hover:text-vr-forest transition-colors">
                      {b.linkLabel} ↗
                    </a>
                  )}
                </>
              ),
            }))}
          />
        )}
      </div>
    </section>
  )
}
