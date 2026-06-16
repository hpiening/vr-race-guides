'use client'
import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['expo']; basePath?: string }

export default function ExpoSection({ data, basePath = 'sections.expo' }: Props) {
  const editing = !!useEditOptional()?.editing

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
                      <a href={block.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-micro text-xs tracking-widest uppercase text-vr-sandstone hover:text-vr-forest transition-colors">
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
            {data.mapImageUrl ? (
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
            <EditableUrl path={`${basePath}.mapImageUrl`} label="Map image URL (optional)" />
          </div>
        </div>
      </div>
    </section>
  )
}
