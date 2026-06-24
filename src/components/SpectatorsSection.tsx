'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader } from './trailhead/Shared'

type Props = { data: EventData['sections']['spectators']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function SpectatorsSection({ data, basePath = 'sections.spectators', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead' && !editing) return <SpectatorsTrailhead data={data} />

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

/* ── Trailhead view (display-only) ── */
function SpectatorsTrailhead({ data }: { data: EventData['sections']['spectators'] }) {
  return (
    <section id="spectators" className="bg-vr-deep px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader dark eyebrow="For" title="Spectators" className="mb-10" />

        {data.notes && (
          <p className="font-body text-vr-cream/[0.82] leading-[1.65] max-w-[760px] mb-9" style={{ fontSize: '17px' }}>
            {data.notes}
          </p>
        )}

        {data.warnings.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {data.warnings.map((w, i) => (
              <div key={i} className="border border-vr-cream/20 rounded-lg p-7 bg-vr-forest">
                <div className="font-display text-vr-sky mb-3" style={{ fontSize: '26px' }}>{String(i + 1).padStart(2, '0')}</div>
                <p className="font-body text-vr-cream/75 leading-[1.6]" style={{ fontSize: '14px' }}>{w}</p>
              </div>
            ))}
          </div>
        )}

        {data.shuttleAccess && (
          <div className="bg-vr-night rounded-lg px-7 py-6 flex flex-wrap gap-3.5 items-start">
            <span className="font-heading uppercase text-vr-sky shrink-0" style={{ fontSize: '14px', letterSpacing: '0.04em' }}>Shuttle access</span>
            <p className="font-body text-vr-cream/85 leading-[1.55] flex-1 min-w-[260px]" style={{ fontSize: '14px' }}>{data.shuttleAccess}</p>
          </div>
        )}
      </div>
    </section>
  )
}
