'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, PhotoFrame } from './trailhead/Shared'

type Props = { data: EventData['sections']['spectators']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function SpectatorsSection({ data, basePath = 'sections.spectators', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead') return <SpectatorsTrailhead data={data} basePath={basePath} editing={editing} />

  return (
    <SectionWrapper id="spectators" label="Spectators" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">Spectators</h2>

      <div className="font-body text-base text-vr-cream/70 leading-relaxed mb-8 max-w-2xl">
        <EditableText as="div" value={data.notes} path={`${basePath}.notes`} />
      </div>

      {(data.warnings.length > 0 || editing) && (
        <div className="bg-vr-cream/10 border border-vr-cream/15 rounded-lg p-6 mb-8 space-y-4">
          {data.warnings.map((w, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-vr-floral shrink-0 mt-0.5">&#9658;</span>
              <div className="font-body text-sm text-vr-cream/80 leading-relaxed flex-1">
                <EditableText as="div" value={w} path={`${basePath}.warnings.${i}`} />
              </div>
              <ListControls path={`${basePath}.warnings`} index={i} count={data.warnings.length} />
            </div>
          ))}
          <AddButton path={`${basePath}.warnings`} item="New warning" label="Add warning" />
        </div>
      )}

      {(editing || data.shuttleAccess) && (
        <div className="border-t border-vr-cream/10 pt-6">
          <p className="font-label text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-2">Shuttle Access</p>
          <div className="font-body text-sm text-vr-cream/70 leading-relaxed">
            <EditableText as="div" value={data.shuttleAccess ?? ''} path={`${basePath}.shuttleAccess`} />
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}

/* ── Trailhead view (renders in both view + edit mode) ── */
function SpectatorsTrailhead({ data, basePath, editing }: { data: EventData['sections']['spectators']; basePath: string; editing: boolean }) {
  return (
    <section id="spectators" className="bg-vr-deep px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader dark eyebrow="For" title="Spectators" className="mb-10" />

        <div className="font-body text-vr-cream/[0.82] leading-[1.65] max-w-[760px] mb-9" style={{ fontSize: '17px' }}>
          <EditableText as="div" value={data.notes} path={`${basePath}.notes`} />
        </div>

        {(data.warnings.length > 0 || editing) && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {data.warnings.map((w, i) => {
              // View mode: split "Lead-in — body" so the lead-in reads as a bold
              // uppercase subheading. Edit mode keeps the single editable string.
              const dash = w.indexOf('—')
              const split = !editing && dash > -1
              const head = split ? w.slice(0, dash).trim() : ''
              const rest = split ? w.slice(dash + 1).trim() : ''
              return (
                <div key={i} className="border border-vr-cream/20 rounded-lg p-7 bg-vr-forest">
                  <div className="flex items-start gap-1">
                    <div className="font-display text-vr-sky mb-3 flex-1" style={{ fontSize: '26px' }}>{String(i + 1).padStart(2, '0')}</div>
                    <ListControls path={`${basePath}.warnings`} index={i} count={data.warnings.length} />
                  </div>
                  {split ? (
                    <>
                      <h3 className="font-heading uppercase text-vr-cream mb-1.5" style={{ fontSize: '16px', letterSpacing: '0.03em' }}>{head}</h3>
                      <p className="font-body text-vr-cream/75 leading-[1.6] m-0">{rest}</p>
                    </>
                  ) : (
                    <EditableText as="div" className="font-body text-vr-cream/75 leading-[1.6]" value={w} path={`${basePath}.warnings.${i}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}
        <div className="mb-6"><AddButton path={`${basePath}.warnings`} item="New note" label="Add note" /></div>

        {(data.shuttleAccess || editing) && (
          <div className="bg-vr-night rounded-lg px-7 py-6 flex flex-wrap gap-3.5 items-start">
            <span className="font-heading uppercase text-vr-sky shrink-0" style={{ fontSize: '14px', letterSpacing: '0.04em' }}>Shuttle access</span>
            <div className="font-body text-vr-cream/85 leading-[1.55] flex-1 min-w-[260px]" style={{ fontSize: '14px' }}>
              <EditableText as="div" value={data.shuttleAccess ?? ''} path={`${basePath}.shuttleAccess`} />
            </div>
          </div>
        )}

        {/* Titled photos (e.g. Spectator Parking, Finish Line). Each slot has an
            editable image "add/change" control in /edit. */}
        {((data.images && data.images.length > 0) || editing) && (
          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            {(data.images ?? []).map((img, i) => {
              const ip = `${basePath}.images.${i}`
              return (
                <div key={i}>
                  <div className="flex items-start gap-2 mb-3">
                    <EditableText as="h3" className="font-heading uppercase text-vr-cream flex-1 text-[16px] tracking-[0.04em]" value={img.title} path={`${ip}.title`} placeholder="Image title" />
                    <ListControls path={`${basePath}.images`} index={i} count={data.images!.length} />
                  </div>
                  {editing ? (
                    <EditableImage path={`${ip}.imageUrl`} label={`${img.title || 'Photo'} image`} ratio="4 / 3" />
                  ) : (
                    <div className="border border-vr-cream/20 rounded-lg overflow-hidden">
                      <PhotoFrame src={img.imageUrl} label={img.title || 'Photo'} ratio="4 / 3" dark />
                    </div>
                  )}
                </div>
              )
            })}
            <div className="sm:col-span-2"><AddButton path={`${basePath}.images`} item={{ title: 'New image', imageUrl: '' }} label="Add image" /></div>
          </div>
        )}
      </div>
    </section>
  )
}
