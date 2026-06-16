'use client'
import SectionWrapper from './SectionWrapper'
import MapEmbed from './MapEmbed'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import RideWithGpsField from './edit/RideWithGpsField'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['raceMorning']; basePath?: string }

export default function RaceMorningSection({ data, basePath = 'sections.raceMorning' }: Props) {
  const editing = !!useEditOptional()?.editing

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

      {/* Parking options (map embeds left as-is; name + details editable) */}
      <div className="mb-12">
        <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Parking</h3>
        <div className="space-y-8">
          {data.parkingOptions.map((option, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-6 border-t border-vr-forest/10 pt-6">
              <div>
                <div className="flex items-start gap-2">
                  <EditableText as="div" className="font-heading text-lg uppercase mb-2 flex-1" value={option.name} path={`${basePath}.parkingOptions.${i}.name`} />
                  <ListControls path={`${basePath}.parkingOptions`} index={i} count={data.parkingOptions.length} />
                </div>
                <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed" value={option.details} path={`${basePath}.parkingOptions.${i}.details`} />
                <EditableUrl path={`${basePath}.parkingOptions.${i}.mapUrl`} label="Directions link" />
              </div>
              <MapEmbed lat={option.lat} lng={option.lng} label={option.name} mapsUrl={option.mapUrl} zoom={14} />
            </div>
          ))}
        </div>
        <AddButton path={`${basePath}.parkingOptions`} item={{ name: 'New lot', details: '', mapUrl: '', lat: 0, lng: 0 }} label="Add parking option" />
      </div>

      {/* Parking map image */}
      {(data.parkingMapImageUrl || editing) && (
        <div className="mb-12">
          {data.parkingMapImageUrl && (
            <div className="rounded-lg overflow-hidden border border-vr-forest/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.parkingMapImageUrl} alt="Parking map" className="w-full h-auto" />
            </div>
          )}
          <EditableUrl path={`${basePath}.parkingMapImageUrl`} label="Parking map image URL" />
        </div>
      )}

      {/* Drop-off note */}
      {(editing || data.dropOffNote) && (
        <div className="bg-vr-cream/50 rounded-lg p-6 border-l-4 border-vr-amber mb-12">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-amber mb-2">Runner Drop-Off</p>
          <EditableText as="div" className="font-body text-sm text-vr-forest leading-relaxed" value={data.dropOffNote ?? ''} path={`${basePath}.dropOffNote`} />
        </div>
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
