'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import RideWithGpsField from './edit/RideWithGpsField'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, StatChips, StatTiles, Accordion } from './trailhead/Shared'

type Props = { data: EventData['sections']['raceMorning']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function RaceMorningSection({ data, basePath = 'sections.raceMorning', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <RaceMorningTrailhead data={data} basePath={basePath} editing={editing} />

  return (
    <SectionWrapper id="race-morning" label={data.navLabel || 'Race Morning'}>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8">{data.navLabel || 'Race Morning'}</h2>

      {/* Course route maps (embeds/links left as-is; name + stats editable) */}
      {data.courses && data.courses.length > 0 && (
        <div className="mb-12">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Course Map</h3>
          <div className="space-y-6">
            {data.courses.map((c, i) => (
              <div key={i} className="bg-vr-offwhite rounded-lg overflow-hidden border border-vr-forest/10">
                <div className="px-5 py-4 flex justify-between items-center border-b border-vr-forest/10">
                  <div className="flex-1">
                    <EditableText as="div" className="font-heading text-lg uppercase" value={c.name} path={`${basePath}.courses.${i}.name`} />
                    <EditableText as="div" className="font-micro text-xs text-vr-mid tracking-wider" value={c.stats ?? ''} path={`${basePath}.courses.${i}.stats`} />
                    {editing && (
                      <div className="mt-2 space-y-1">
                        <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-mid">Stat tiles (Trailhead)</p>
                        {(c.statTiles ?? []).map((t, ti) => (
                          <div key={ti} className="flex items-center gap-2">
                            <EditableText as="span" className="font-heading text-vr-forest text-sm w-20" value={t.value} path={`${basePath}.courses.${i}.statTiles.${ti}.value`} placeholder="13.1" />
                            <EditableText as="span" className="font-micro text-xs text-vr-mid flex-1" value={t.label} path={`${basePath}.courses.${i}.statTiles.${ti}.label`} placeholder="Miles" />
                            <ListControls path={`${basePath}.courses.${i}.statTiles`} index={ti} count={c.statTiles!.length} />
                          </div>
                        ))}
                        <AddButton path={`${basePath}.courses.${i}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                      </div>
                    )}
                  </div>
                  {!editing && (
                    <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="font-micro text-xs tracking-widest uppercase text-vr-sandstone hover:text-vr-forest transition-colors shrink-0 ml-4">
                      View Full Route ↗
                    </a>
                  )}
                </div>
                {c.embedUrl && (
                  <>
                    <iframe src={c.embedUrl} title={`${c.name} route map`} style={{ width: '100%', height: '500px', border: 'none', display: 'block' }} loading="lazy" scrolling="no" className="print:hidden" />
                    {!editing && <div className="hidden print:block px-5 py-4 text-sm font-body text-vr-mid">View route at: {c.mapUrl}</div>}
                  </>
                )}
                {!c.embedUrl && c.mapImageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={c.mapImageUrl} alt={`${c.name} course map`} className="w-full h-auto" />
                )}
                <RideWithGpsField itemPath={`${basePath}.courses.${i}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-12">
        <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">{data.timelineLabel || 'Shuttle Schedule'}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {data.shuttleDetails.map((item, i) => (
            <div key={i} className="bg-vr-offwhite rounded-lg p-5">
              <div className="flex items-start gap-1">
                <EditableText as="div" className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2 flex-1" value={item.time} path={`${basePath}.shuttleDetails.${i}.time`} />
                <ListControls path={`${basePath}.shuttleDetails`} index={i} count={data.shuttleDetails.length} />
              </div>
              <EditableText as="div" className="font-heading text-base uppercase leading-tight" value={item.label} path={`${basePath}.shuttleDetails.${i}.label`} />
            </div>
          ))}
        </div>
        <AddButton path={`${basePath}.shuttleDetails`} item={{ time: '', label: 'New item' }} label="Add timeline item" />
      </div>

      {/* Parking */}
      <div className="mb-12">
        <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Parking</h3>
        {editing ? (
          <div className="mb-6"><EditableImage path={`${basePath}.parkingMapImageUrl`} label="Parking map" /></div>
        ) : data.parkingMapImageUrl ? (
          <div className="rounded-lg overflow-hidden border border-vr-forest/10 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.parkingMapImageUrl} alt="Parking map" className="w-full h-auto" />
          </div>
        ) : null}
        <div className="space-y-6">
          {data.parkingOptions.map((option, i) => (
            <div key={i} className="border-t border-vr-forest/10 pt-6">
              <div className="flex items-start gap-2">
                <EditableText as="div" className="font-heading text-lg uppercase mb-2 flex-1" value={option.name} path={`${basePath}.parkingOptions.${i}.name`} />
                <ListControls path={`${basePath}.parkingOptions`} index={i} count={data.parkingOptions.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed" value={option.details} path={`${basePath}.parkingOptions.${i}.details`} />
              {editing ? (
                <EditableUrl path={`${basePath}.parkingOptions.${i}.mapUrl`} label="Directions link" />
              ) : option.mapUrl ? (
                <a href={option.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-label text-xs tracking-[0.12em] uppercase text-vr-sandstone hover:text-vr-forest transition-colors">Directions ↗</a>
              ) : null}
            </div>
          ))}
        </div>
        <AddButton path={`${basePath}.parkingOptions`} item={{ name: 'New lot', details: '', mapUrl: '' }} label="Add parking option" />
      </div>

      {/* Drop-off note */}
      {(editing || data.dropOffNote) && (
        <div className="bg-vr-cream/50 rounded-lg p-6 border-l-4 border-vr-amber mb-12">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2">Runner Drop-Off</p>
          <EditableText as="div" className="font-body text-sm text-vr-forest leading-relaxed" value={data.dropOffNote ?? ''} path={`${basePath}.dropOffNote`} />
        </div>
      )}

      {/* Drop-off map (below the callout) */}
      {(data.dropOffImageUrl || editing) && (
        editing ? (
          <div className="mb-12"><EditableImage path={`${basePath}.dropOffImageUrl`} label="Runner drop-off map" /></div>
        ) : (
          <div className="rounded-lg overflow-hidden border border-vr-forest/10 mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.dropOffImageUrl} alt="Runner drop-off map" className="w-full h-auto" />
          </div>
        )
      )}

      {/* Detailed info blocks */}
      {((data.infoBlocks && data.infoBlocks.length > 0) || editing) && (
        <div className="space-y-8 border-t border-vr-forest/10 pt-10 mt-4">
          {(data.infoBlocks ?? []).map((block, i) => (
            <div key={i} className="border-b border-vr-forest/10 pb-8 last:border-0">
              <div className="flex items-start gap-2">
                <EditableText as="h3" className="font-heading text-base uppercase text-vr-forest mb-3 tracking-wide flex-1" value={block.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                <ListControls path={`${basePath}.infoBlocks`} index={i} count={data.infoBlocks!.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed whitespace-pre-line" value={block.body} path={`${basePath}.infoBlocks.${i}.body`} />
            </div>
          ))}
          <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
        </div>
      )}
    </SectionWrapper>
  )
}

/* ── Trailhead view (renders in both view + edit mode; keeps RideWithGPS + MapEmbed functional) ── */
function RaceMorningTrailhead({ data, basePath, editing }: { data: EventData['sections']['raceMorning']; basePath: string; editing: boolean }) {
  return (
    <section id="race-morning" className="bg-vr-deep px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader dark eyebrow="Getting to the" title={data.navLabel || 'Race Morning'} className="mb-10" />

        {/* Course route + stats */}
        {data.courses && data.courses.length > 0 && data.courses.map((c, i) => (
          <div key={i} className="grid gap-6 md:grid-cols-[1.5fr_1fr] items-start mb-10">
            <div className="border border-vr-cream/20 rounded-lg overflow-hidden">
              {c.embedUrl ? (
                <>
                  <iframe src={c.embedUrl} title={`${c.name} route map`} style={{ width: '100%', height: '440px', border: 'none', display: 'block' }} loading="lazy" scrolling="no" className="print:hidden" />
                  <div className="hidden print:block px-5 py-4 text-sm font-body text-vr-cream/70">View route at: {c.mapUrl}</div>
                </>
              ) : c.mapImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.mapImageUrl} alt={`${c.name} course map`} className="w-full object-cover aspect-[16/10]" />
              ) : null}
              <RideWithGpsField itemPath={`${basePath}.courses.${i}`} />
            </div>
            <div className="flex flex-col gap-4">
              <EditableText as="div" className="font-heading uppercase text-vr-cream text-[20px] tracking-[0.02em]" value={c.name} path={`${basePath}.courses.${i}.name`} />
              {editing ? (
                <div className="space-y-1">
                  <EditableText as="div" className="font-micro text-xs text-vr-cream/75" value={c.stats ?? ''} path={`${basePath}.courses.${i}.stats`} placeholder="Fallback stats string" />
                  <p className="font-micro text-[10px] tracking-[0.2em] uppercase text-vr-cream/70 pt-1">Stat tiles</p>
                  {(c.statTiles ?? []).map((t, ti) => (
                    <div key={ti} className="flex items-center gap-2">
                      <div className="w-24 shrink-0"><EditableText as="div" className="font-heading text-sm" value={t.value} path={`${basePath}.courses.${i}.statTiles.${ti}.value`} placeholder="13.1" /></div>
                      <div className="flex-1"><EditableText as="div" className="font-micro text-xs" value={t.label} path={`${basePath}.courses.${i}.statTiles.${ti}.label`} placeholder="Miles" /></div>
                      <ListControls path={`${basePath}.courses.${i}.statTiles`} index={ti} count={c.statTiles!.length} />
                    </div>
                  ))}
                  <AddButton path={`${basePath}.courses.${i}.statTiles`} item={{ value: '', label: '' }} label="Add stat tile" />
                </div>
              ) : c.statTiles && c.statTiles.length > 0 ? <StatTiles tiles={c.statTiles} /> : <StatChips stats={c.stats} dark />}
              {!editing && (
                <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="self-start font-label text-xs tracking-[0.12em] uppercase text-vr-sky hover:text-vr-cream transition-colors">
                  View full route ↗
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Morning schedule tiles */}
        {(data.shuttleDetails.length > 0 || editing) && (
          <>
            <h3 className="font-heading uppercase text-vr-cream mb-4" style={{ fontSize: '16px', letterSpacing: '0.06em' }}>{data.timelineLabel || 'Morning Schedule'}</h3>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {data.shuttleDetails.map((item, i) => (
                <div key={i} className="border border-vr-cream/10 bg-vr-cream/5 rounded-lg p-5">
                  <div className="flex items-start gap-1">
                    <EditableText as="div" className="font-label text-xs tracking-[0.16em] uppercase text-vr-sky mb-2 flex-1" value={item.time} path={`${basePath}.shuttleDetails.${i}.time`} />
                    <ListControls path={`${basePath}.shuttleDetails`} index={i} count={data.shuttleDetails.length} />
                  </div>
                  <EditableText as="div" className="font-heading text-sm uppercase leading-tight text-vr-cream" value={item.label} path={`${basePath}.shuttleDetails.${i}.label`} />
                </div>
              ))}
            </div>
            <div className="mb-12"><AddButton path={`${basePath}.shuttleDetails`} item={{ time: '', label: 'New item' }} label="Add timeline item" /></div>
          </>
        )}

        {/* Parking */}
        <h3 className="font-heading uppercase text-vr-cream mb-4" style={{ fontSize: '16px', letterSpacing: '0.06em' }}>Parking</h3>
        {editing ? (
          <div className="mb-6"><EditableImage path={`${basePath}.parkingMapImageUrl`} label="Parking map" /></div>
        ) : data.parkingMapImageUrl ? (
          <div className="border border-vr-cream/20 rounded-lg overflow-hidden mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.parkingMapImageUrl} alt="Parking map" className="w-full h-auto block" />
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {data.parkingOptions.map((option, i) => (
            <div key={i} className="border border-vr-cream/20 rounded-lg p-6 bg-vr-cream/5">
              <div className="flex items-start gap-2">
                <EditableText as="h4" className="font-heading uppercase text-vr-cream mb-2 flex-1" value={option.name} path={`${basePath}.parkingOptions.${i}.name`} />
                <ListControls path={`${basePath}.parkingOptions`} index={i} count={data.parkingOptions.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-cream/75 leading-relaxed" value={option.details} path={`${basePath}.parkingOptions.${i}.details`} />
              {editing ? (
                <EditableUrl path={`${basePath}.parkingOptions.${i}.mapUrl`} label="Directions link" />
              ) : option.mapUrl ? (
                <a href={option.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-label text-xs tracking-[0.12em] uppercase text-vr-sky hover:text-vr-cream transition-colors">Directions ↗</a>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mb-6"><AddButton path={`${basePath}.parkingOptions`} item={{ name: 'New lot', details: '', mapUrl: '' }} label="Add parking option" /></div>

        {/* Drop-off callout */}
        {(data.dropOffNote || editing) && (
          <div className="bg-vr-night rounded-lg px-6 py-5 mb-10" style={{ borderLeft: '3px solid var(--vr-sky)' }}>
            <p className="font-label text-xs tracking-[0.16em] uppercase text-vr-sky mb-2">Runner Drop-Off</p>
            <EditableText as="div" className="font-body text-sm text-vr-cream/85 leading-relaxed" value={data.dropOffNote ?? ''} path={`${basePath}.dropOffNote`} />
          </div>
        )}

        {/* Drop-off map (below the callout) */}
        {(data.dropOffImageUrl || editing) && (
          editing ? (
            <div className="mb-10"><EditableImage path={`${basePath}.dropOffImageUrl`} label="Runner drop-off map" /></div>
          ) : (
            <div className="border border-vr-cream/20 rounded-lg overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.dropOffImageUrl} alt="Runner drop-off map" className="w-full h-auto block" />
            </div>
          )
        )}

        {/* Course detail accordions */}
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
          <Accordion items={data.infoBlocks.map(b => ({ heading: b.heading, body: b.body }))} />
        ) : null}
      </div>
    </section>
  )
}
