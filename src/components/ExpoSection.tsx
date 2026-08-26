'use client'
import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, PhotoFrame, ActionLink } from './trailhead/Shared'

type Props = { data: EventData['sections']['expo']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function ExpoSection({ data, basePath = 'sections.expo', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <ExpoTrailhead data={data} basePath={basePath} editing={editing} />

  return (
    <section id="expo" className="py-16 md:py-24 px-6 md:px-12 bg-vr-offwhite text-vr-forest">
      <div className="max-w-4xl mx-auto">
        <p className="font-micro text-xs tracking-[0.25em] uppercase mb-2 text-vr-mid">Pre-Race Expo</p>
        <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-forest">Expo</h2>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Date</p>
            <div className="font-heading text-xl uppercase text-vr-forest mb-6">
              <EditableText as="div" value={data.date} path={`${basePath}.date`} />
            </div>

            <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">Location</p>
            {editing ? (
              <div className="font-heading text-xl uppercase text-vr-sandstone mb-6">
                <EditableText as="div" value={data.locationName} path={`${basePath}.locationName`} />
              </div>
            ) : (
              <a
                href={data.locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-xl uppercase text-vr-sandstone underline decoration-vr-sandstone/30 hover:decoration-vr-sandstone transition-all mb-6 block"
              >
                {data.locationName}
              </a>
            )}
            <EditableUrl path={`${basePath}.locationMapUrl`} label="Directions link" />
            <div className="h-4" />

            <div className="space-y-0 mb-2 border-t border-vr-forest/10">
              {data.hours.map((h, i) => (
                <div key={i} className="border-b border-vr-forest/10 py-3 flex items-start gap-2">
                  <div className="flex-1">
                    <EditableText as="div" className="font-micro text-xs tracking-[0.15em] uppercase text-vr-mid mb-0.5" value={h.label} path={`${basePath}.hours.${i}.label`} />
                    <EditableText as="div" className="font-label text-sm text-vr-forest tracking-wider" value={h.time} path={`${basePath}.hours.${i}.time`} />
                  </div>
                  <ListControls path={`${basePath}.hours`} index={i} count={data.hours.length} />
                </div>
              ))}
            </div>
            <AddButton path={`${basePath}.hours`} item={{ label: 'Label', time: 'Time' }} label="Add hours row" />

            {(data.notes.length > 0 || editing) && (
              <ul className="space-y-3 mb-2 mt-8">
                {data.notes.map((note, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-vr-floral mt-1 shrink-0">&#9658;</span>
                    <div className="font-body text-sm text-vr-forest/80 leading-relaxed flex-1">
                      <EditableText as="div" value={note} path={`${basePath}.notes.${i}`} />
                    </div>
                    <ListControls path={`${basePath}.notes`} index={i} count={data.notes.length} />
                  </li>
                ))}
              </ul>
            )}
            <AddButton path={`${basePath}.notes`} item="New note" label="Add note" />

            {((data.infoBlocks && data.infoBlocks.length > 0) || editing) && (
              <div className="space-y-6 border-t border-vr-forest/10 pt-6 mt-8">
                {(data.infoBlocks ?? []).map((block, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2">
                      <EditableText as="h3" className="font-heading text-sm uppercase tracking-wide text-vr-forest mb-2 flex-1" value={block.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                      <ListControls path={`${basePath}.infoBlocks`} index={i} count={data.infoBlocks!.length} />
                    </div>
                    <EditableText as="div" className="font-body text-sm text-vr-forest/80 leading-relaxed whitespace-pre-line" value={block.body} path={`${basePath}.infoBlocks.${i}.body`} />
                    {!editing && block.linkLabel && block.linkUrl && (
                      <a href={block.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-label text-sm font-bold tracking-[0.1em] uppercase text-vr-forest bg-vr-sandstone/15 hover:bg-vr-sandstone/25 border border-vr-sandstone/30 rounded-lg px-5 py-2.5 transition-colors">
                        {block.linkLabel} ↗
                      </a>
                    )}
                    {editing && (
                      <div className="mt-2">
                        <EditableText as="div" className="font-micro text-xs uppercase text-vr-sandstone" value={block.linkLabel ?? ''} path={`${basePath}.infoBlocks.${i}.linkLabel`} placeholder="Link label (optional)" />
                        <EditableUrl path={`${basePath}.infoBlocks.${i}.linkUrl`} label="Link URL" />
                      </div>
                    )}
                  </div>
                ))}
                <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
              </div>
            )}
          </div>

          <div>
            {editing ? (
              <EditableImage path={`${basePath}.mapImageUrl`} label="Expo map" />
            ) : data.mapImageUrl ? (
              <div className="rounded-lg overflow-hidden border border-vr-forest/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.mapImageUrl} alt={`${data.locationName} map`} className="w-full h-auto" />
                <div className="px-4 py-3 bg-vr-offwhite border-t border-vr-forest/10">
                  <a href={data.locationMapUrl} target="_blank" rel="noopener noreferrer" className="font-micro text-xs tracking-widest uppercase text-vr-sandstone hover:text-vr-forest transition-colors">
                    Get Directions — {data.locationName} ↗
                  </a>
                </div>
              </div>
            ) : (
              <MapEmbed lat={data.locationLat} lng={data.locationLng} label={data.locationName} mapsUrl={data.locationMapUrl} dark={false} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Trailhead view (renders in both view + edit mode) ── */
function ExpoTrailhead({ data, basePath, editing }: { data: EventData['sections']['expo']; basePath: string; editing: boolean }) {
  return (
    <section id="expo" className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <div className="mb-12">
          <div className="leading-[0.9]">
            <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>
              <EditableText as="span" value={data.eyebrow || 'Pre-race'} path={`${basePath}.eyebrow`} />
            </span>
          </div>
          <h2 className="font-display uppercase text-vr-forest leading-[0.9] mt-0.5 m-0" style={{ fontSize: 'clamp(40px,5.6vw,76px)' }}>
            <EditableText as="span" value={data.heading || 'Expo'} path={`${basePath}.heading`} />
          </h2>
        </div>
        <div className="font-body text-vr-forest leading-[1.65] max-w-[680px] mb-10" style={{ fontSize: '18px' }}>
          <EditableText as="div" value={data.locationAddress} path={`${basePath}.locationAddress`} />
        </div>

        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-start">
          {/* location card */}
          <div className="border border-vr-line bg-vr-white rounded-lg overflow-hidden">
            {editing ? (
              <div className="border-b border-vr-line p-4"><EditableImage path={`${basePath}.mapImageUrl`} label="Expo map" /></div>
            ) : data.mapImageUrl ? (
              <a href={data.locationMapUrl} target="_blank" rel="noopener noreferrer" className="block border-b border-vr-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.mapImageUrl} alt={`${data.locationName} map`} className="w-full h-auto block" />
              </a>
            ) : (
              <div className="border-b border-vr-line">
                <MapEmbed lat={data.locationLat} lng={data.locationLng} label={data.locationName} mapsUrl={data.locationMapUrl} dark={false} />
              </div>
            )}
            <div className="p-7">
              {editing ? (
                <div className="font-heading uppercase text-vr-forest" style={{ fontSize: '22px', letterSpacing: '0.02em' }}>
                  <EditableText as="div" value={data.locationName} path={`${basePath}.locationName`} />
                </div>
              ) : (
                <a href={data.locationMapUrl} target="_blank" rel="noopener noreferrer" className="font-heading uppercase text-vr-forest hover:text-vr-sky transition-colors" style={{ fontSize: '22px', letterSpacing: '0.02em' }}>
                  {data.locationName} ↗
                </a>
              )}
              {editing && <EditableUrl path={`${basePath}.locationMapUrl`} label="Directions link" />}
              {(data.hours.length > 0 || editing) && (
                <div className="flex flex-wrap gap-x-8 gap-y-4 mt-5">
                  {data.hours.map((h, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <div>
                        <EditableText as="div" className="font-micro uppercase text-vr-sky mb-1" value={h.label} path={`${basePath}.hours.${i}.label`} />
                        <EditableText as="div" className="font-heading text-vr-forest" value={h.time} path={`${basePath}.hours.${i}.time`} />
                      </div>
                      <ListControls path={`${basePath}.hours`} index={i} count={data.hours.length} />
                    </div>
                  ))}
                </div>
              )}
              <AddButton path={`${basePath}.hours`} item={{ label: 'Label', time: 'Time' }} label="Add hours row" />
            </div>
          </div>

          {/* notes as a side card */}
          {(data.notes.length > 0 || editing) && (
            <div className="border border-vr-line bg-vr-white rounded-lg p-7" style={{ borderLeft: '3px solid var(--vr-sky)' }}>
              <h3 className="font-heading uppercase text-vr-forest mb-4" style={{ fontSize: '15px', letterSpacing: '0.04em' }}>Good to know</h3>
              <ul className="flex flex-col gap-3">
                {data.notes.map((note, i) => (
                  <li key={i} className="flex gap-3 items-start font-body text-vr-forest/85 leading-relaxed" style={{ fontSize: '14px' }}>
                    <span className="text-vr-sky mt-0.5 shrink-0">✦</span>
                    <div className="flex-1"><EditableText as="div" value={note} path={`${basePath}.notes.${i}`} /></div>
                    <ListControls path={`${basePath}.notes`} index={i} count={data.notes.length} />
                  </li>
                ))}
              </ul>
              <AddButton path={`${basePath}.notes`} item="New note" label="Add note" />
            </div>
          )}
        </div>

        {/* info blocks as cards */}
        {((data.infoBlocks && data.infoBlocks.length > 0) || editing) && (
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {(data.infoBlocks ?? []).map((b, i) => (
              <div key={i} className="border border-vr-line bg-vr-white rounded-lg p-7">
                <div className="flex items-start gap-2">
                  <EditableText as="h3" className="font-heading uppercase text-vr-forest mb-3 flex-1" value={b.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                  <ListControls path={`${basePath}.infoBlocks`} index={i} count={data.infoBlocks!.length} />
                </div>
                <EditableText as="div" className="font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line" value={b.body} path={`${basePath}.infoBlocks.${i}.body`} />
                {!editing && b.linkLabel && b.linkUrl && (
                  <ActionLink href={b.linkUrl} label={b.linkLabel} />
                )}
                {editing && (
                  <div className="mt-2">
                    <EditableText as="div" className="font-micro text-xs uppercase text-vr-sky" value={b.linkLabel ?? ''} path={`${basePath}.infoBlocks.${i}.linkLabel`} placeholder="Link label (optional)" />
                    <EditableUrl path={`${basePath}.infoBlocks.${i}.linkUrl`} label="Link URL" />
                  </div>
                )}
              </div>
            ))}
            <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
          </div>
        )}

        {/* Titled images (e.g. the four "Road Trip" gateway-airport graphics).
            Each slot is an editable image control in /edit. */}
        {((data.images && data.images.length > 0) || editing) && (
          <div className="mt-14">
            <div className="leading-[0.9] mb-2">
              <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(18px,2vw,24px)' }}>
                <EditableText as="span" value={data.imagesHeading ?? ''} path={`${basePath}.imagesHeading`} placeholder="Images heading (optional)" />
              </span>
            </div>
            <EditableText
              as="p"
              className="font-body text-vr-forest/85 leading-[1.6] max-w-[620px] mb-7 text-[16px]"
              value={data.imagesIntro ?? ''}
              path={`${basePath}.imagesIntro`}
              placeholder="Images intro (optional)"
            />
            <div className="tl-expo-images grid gap-6 sm:grid-cols-2">
              {(data.images ?? []).map((img, i) => {
                const ip = `${basePath}.images.${i}`
                const ratio = img.ratio || '4 / 3'
                const frame = (
                  <div className="border border-vr-line rounded-lg overflow-hidden bg-vr-white">
                    <PhotoFrame src={img.imageUrl} label={img.title || 'Photo'} ratio={ratio} />
                  </div>
                )
                return (
                  <div key={i}>
                    <div className="flex items-start gap-2 mb-3">
                      <EditableText as="h3" className="font-heading uppercase text-vr-forest flex-1 text-[16px] tracking-[0.04em]" value={img.title} path={`${ip}.title`} placeholder="Image title" />
                      <ListControls path={`${basePath}.images`} index={i} count={data.images!.length} />
                    </div>
                    {editing ? (
                      <>
                        <EditableImage path={`${ip}.imageUrl`} label={`${img.title || 'Photo'} image`} ratio={ratio} />
                        <EditableUrl path={`${ip}.url`} label="Full-size / link URL (optional)" />
                      </>
                    ) : img.url ? (
                      <a href={img.url} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-90">{frame}</a>
                    ) : frame}
                  </div>
                )
              })}
              <div className="sm:col-span-2"><AddButton path={`${basePath}.images`} item={{ title: 'New image', imageUrl: '' }} label="Add image" /></div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
