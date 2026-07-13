'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, Accordion, RichBody } from './trailhead/Shared'

type Props = { data: EventData['sections']['postRace']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function PostRaceSection({ data, basePath = 'sections.postRace', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <PostRaceTrailhead data={data} basePath={basePath} editing={editing} />

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

/* ── Trailhead view (renders in both view + edit mode) ── */
function PostRaceTrailhead({ data, basePath, editing }: { data: EventData['sections']['postRace']; basePath: string; editing: boolean }) {
  return (
    <section id="post-race" className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader eyebrow="Post-race" title="Information" className="mb-6" />
        <div className="font-body text-vr-forest leading-[1.7] max-w-[680px] mb-7" style={{ fontSize: '18px' }}>
          <EditableText as="div" value={data.finishLineInfo} path={`${basePath}.finishLineInfo`} />
        </div>
        {/* Course records — sky panel */}
        {(data.courseRecords.length > 0 || editing) && (
          <div className="rounded-xl p-9 md:p-11 mb-6" style={{ background: 'var(--vr-sky)' }}>
            <span className="font-accent text-vr-forest/75" style={{ fontSize: '18px' }}>Free race entry while the record stands</span>
            <h3 className="font-display uppercase text-vr-forest leading-[0.92] m-0 mb-6" style={{ fontSize: 'clamp(28px,3.6vw,46px)' }}>Course Records</h3>
            <div className="grid sm:grid-cols-2 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(49,56,50,0.2)', border: '1px solid rgba(49,56,50,0.2)' }}>
              {data.courseRecords.map((r, i) => (
                <div key={i} className="bg-vr-sky p-6">
                  <div className="flex items-start gap-1 mb-2">
                    <div className="flex gap-1.5 font-micro uppercase text-vr-forest/70 flex-1" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                      <EditableText as="span" value={r.category} path={`${basePath}.courseRecords.${i}.category`} />
                      <span>·</span>
                      <EditableText as="span" value={r.year} path={`${basePath}.courseRecords.${i}.year`} />
                    </div>
                    <ListControls path={`${basePath}.courseRecords`} index={i} count={data.courseRecords.length} />
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <EditableText as="span" className="font-heading text-vr-forest text-[16px]" value={r.name} path={`${basePath}.courseRecords.${i}.name`} />
                    <EditableText as="span" className="font-display text-vr-forest text-[30px]" value={r.time} path={`${basePath}.courseRecords.${i}.time`} />
                  </div>
                </div>
              ))}
            </div>
            <AddButton path={`${basePath}.courseRecords`} item={{ category: 'Category', name: 'Name', time: '0:00:00', year: '2026' }} label="Add course record" />
          </div>
        )}

        {/* Detailed info — editable list when editing, accordion when viewing */}
        {editing ? (
          <div className="flex flex-col gap-3">
            {(data.infoSections ?? []).map((s, i) => (
              <div key={i} className="bg-vr-white border border-vr-line rounded-lg p-5">
                <div className="flex items-start gap-2">
                  <EditableText as="h3" className="font-heading uppercase text-vr-forest flex-1" value={s.heading} path={`${basePath}.infoSections.${i}.heading`} />
                  <ListControls path={`${basePath}.infoSections`} index={i} count={data.infoSections!.length} />
                </div>
                <EditableText as="div" className="font-body text-vr-forest/85 mt-2 whitespace-pre-line" value={s.body} path={`${basePath}.infoSections.${i}.body`} />
                <div className="mt-2 space-y-2">
                  {(s.links ?? []).map((link, j) => (
                    <div key={j} className="flex items-start gap-2 border border-vr-forest/15 rounded p-2">
                      <div className="flex-1">
                        <EditableText as="div" className="font-label text-xs uppercase text-vr-forest" value={link.label} path={`${basePath}.infoSections.${i}.links.${j}.label`} placeholder="Button label" />
                        <EditableUrl path={`${basePath}.infoSections.${i}.links.${j}.url`} />
                      </div>
                      <ListControls path={`${basePath}.infoSections.${i}.links`} index={j} count={s.links!.length} />
                    </div>
                  ))}
                  <AddButton path={`${basePath}.infoSections.${i}.links`} item={{ label: 'Button', url: '' }} label="Add link button" />
                </div>
              </div>
            ))}
            <AddButton path={`${basePath}.infoSections`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info section" />
          </div>
        ) : data.infoSections && data.infoSections.length > 0 ? (
          <Accordion
            variant="white"
            items={data.infoSections.map(s => ({
              heading: s.heading,
              body: (
                <>
                  <RichBody value={s.body} />
                  {s.links && s.links.length > 0 && (
                    <span className="flex flex-wrap gap-3 mt-4">
                      {s.links.map((link, j) => (
                        <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="font-label text-xs tracking-[0.16em] uppercase px-5 py-2.5 border border-vr-forest/25 text-vr-forest rounded-full hover:bg-vr-offwhite transition-colors">
                          {link.label}
                        </a>
                      ))}
                    </span>
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
