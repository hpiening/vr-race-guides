'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['spectators']; basePath?: string }

export default function SpectatorsSection({ data, basePath = 'sections.spectators' }: Props) {
  const editing = !!useEditOptional()?.editing

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
