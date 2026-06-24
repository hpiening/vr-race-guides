'use client'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader } from './trailhead/Shared'

type Props = { data: NonNullable<EventData['partners']>; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function PartnersSection({ data, basePath = 'partners', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing
  const items = data.items ?? []

  // ── Trailhead view (display-only) ──
  if (theme === 'trailhead' && !editing) {
    return (
      <section className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-24 border-t border-[#e6dccb]">
        <div className="max-w-[1180px] mx-auto text-center">
          <TrailHeader center eyebrow="Proudly supported by" title="Our Partners" className="mb-10" />
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}>
            {items.map((p, i) => (
              <div
                key={i}
                className="h-[86px] bg-vr-white border border-[#e0d4c0] rounded-lg flex items-center justify-center text-center px-2 font-micro uppercase text-vr-forest/40"
                style={{ fontSize: '12px', letterSpacing: '0.06em' }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Classic + edit ──
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-vr-offwhite border-t border-vr-forest/10">
      <div className="max-w-4xl mx-auto">
        <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-mid mb-2">Partners</p>
        <h2 className="font-display text-4xl md:text-5xl uppercase text-vr-forest mb-8">Our Partners</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {items.map((p, i) => (
            <div key={i} className="flex items-center gap-1 border border-vr-forest/10 rounded-lg bg-vr-white px-3 py-4">
              <EditableText as="span" className="font-micro text-xs uppercase text-vr-forest/70 flex-1" value={p} path={`${basePath}.items.${i}`} />
              <ListControls path={`${basePath}.items`} index={i} count={items.length} />
            </div>
          ))}
        </div>
        <AddButton path={`${basePath}.items`} item="New partner" label="Add partner" />
      </div>
    </section>
  )
}
