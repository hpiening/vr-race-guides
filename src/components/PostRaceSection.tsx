'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['postRace']; basePath?: string }

export default function PostRaceSection({ data, basePath = 'sections.postRace' }: Props) {
  const editing = !!useEditOptional()?.editing

  return (
    <SectionWrapper id="post-race" label="Post-Race">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-forest">Post-Race</h2>

      {(editing || data.finishLineInfo) && (
        <div className="font-body text-base text-vr-forest/80 leading-relaxed mb-12 max-w-2xl">
          <EditableText as="div" value={data.finishLineInfo} path={`${basePath}.finishLineInfo`} />
        </div>
      )}

      {(data.courseRecords.length > 0 || editing) && (
        <div className="mb-12">
          <h3 className="font-heading text-xl uppercase text-vr-forest mb-6 tracking-wide">Course Records</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.courseRecords.map((record, i) => (
              <div key={i} className="border border-vr-forest/10 rounded-lg p-5 bg-vr-offwhite">
                <div className="flex items-start gap-1">
                  <EditableText as="div" className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1 flex-1" value={record.category} path={`${basePath}.courseRecords.${i}.category`} />
                  <ListControls path={`${basePath}.courseRecords`} index={i} count={data.courseRecords.length} />
                </div>
                <EditableText as="div" className="font-heading text-2xl text-vr-forest uppercase mb-1" value={record.time} path={`${basePath}.courseRecords.${i}.time`} />
                <div className="font-body text-sm text-vr-mid flex flex-wrap gap-x-2">
                  <EditableText as="span" value={record.name} path={`${basePath}.courseRecords.${i}.name`} />
                  <span>·</span>
                  <EditableText as="span" value={record.year} path={`${basePath}.courseRecords.${i}.year`} />
                </div>
              </div>
            ))}
          </div>
          <AddButton path={`${basePath}.courseRecords`} item={{ category: 'Category', name: 'Name', time: '0:00:00', year: '2026' }} label="Add course record" />
        </div>
      )}

      {((data.infoSections && data.infoSections.length > 0) || editing) && (
        <div className="space-y-8 border-t border-vr-forest/10 pt-10">
          {(data.infoSections ?? []).map((section, i) => (
            <div key={i} className="border-b border-vr-forest/10 pb-8 last:border-0">
              <div className="flex items-start gap-2">
                <EditableText as="h3" className="font-heading text-xl uppercase text-vr-forest mb-4 tracking-wide flex-1" value={section.heading} path={`${basePath}.infoSections.${i}.heading`} />
                <ListControls path={`${basePath}.infoSections`} index={i} count={data.infoSections!.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-forest/80 leading-relaxed mb-4 max-w-2xl whitespace-pre-line" value={section.body} path={`${basePath}.infoSections.${i}.body`} />
              {editing ? (
                <div className="mt-4 space-y-2">
                  {(section.links ?? []).map((link, j) => (
                    <div key={j} className="flex items-start gap-2 border border-vr-forest/15 rounded p-2">
                      <div className="flex-1">
                        <EditableText as="div" className="font-label text-xs uppercase text-vr-forest" value={link.label} path={`${basePath}.infoSections.${i}.links.${j}.label`} placeholder="Button label" />
                        <EditableUrl path={`${basePath}.infoSections.${i}.links.${j}.url`} />
                      </div>
                      <ListControls path={`${basePath}.infoSections.${i}.links`} index={j} count={section.links!.length} />
                    </div>
                  ))}
                  <AddButton path={`${basePath}.infoSections.${i}.links`} item={{ label: 'Button', url: '' }} label="Add link button" />
                </div>
              ) : section.links && section.links.length > 0 ? (
                <div className="flex flex-wrap gap-3 mt-4">
                  {section.links.map((link, j) => (
                    <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 border border-vr-forest/20 text-vr-forest rounded hover:bg-vr-offwhite transition-colors">
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <AddButton path={`${basePath}.infoSections`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info section" />
        </div>
      )}
    </SectionWrapper>
  )
}
