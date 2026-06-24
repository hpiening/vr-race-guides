'use client'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader } from './trailhead/Shared'

type Props = { data: NonNullable<EventData['partners']>; basePath?: string; theme?: 'classic' | 'trailhead' }

const NEW_PARTNER = { name: 'New partner', logoUrl: '' }

export default function PartnersSection({ data, basePath = 'partners', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing
  const items = data.items ?? []

  // ── Trailhead view (renders in both view + edit mode) ──
  if (theme === 'trailhead') {
    return (
      <section className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-24 border-t border-[#e6dccb]">
        <div className="max-w-[1180px] mx-auto text-center">
          <TrailHeader center eyebrow="Proudly supported by" title="Our Partners" className="mb-10" />
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))' }}>
            {items.map((partner, i) => (
              <div key={i} className="min-h-[100px] bg-vr-white border border-[#e0d4c0] rounded-lg flex flex-col items-center justify-center text-center gap-2 p-3">
                {!editing && partner.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={partner.logoUrl} alt={partner.name} className="max-h-[56px] max-w-full w-auto object-contain" />
                ) : !editing ? (
                  <span className="font-micro uppercase text-vr-forest/45 text-[12px] tracking-[0.06em]">{partner.name}</span>
                ) : (
                  <div className="w-full flex flex-col gap-1 items-stretch">
                    <div className="flex items-center gap-1">
                      <EditableText as="div" className="font-micro uppercase text-[12px] tracking-[0.06em] flex-1" value={partner.name} path={`${basePath}.items.${i}.name`} placeholder="Partner name" />
                      <ListControls path={`${basePath}.items`} index={i} count={items.length} />
                    </div>
                    <EditableUrl path={`${basePath}.items.${i}.logoUrl`} label="Logo image URL" />
                    {partner.logoUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={partner.logoUrl} alt={partner.name} className="max-h-[40px] w-auto object-contain mt-1 self-center" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4"><AddButton path={`${basePath}.items`} item={NEW_PARTNER} label="Add partner" /></div>
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
          {items.map((partner, i) => (
            <div key={i} className="border border-vr-forest/10 rounded-lg bg-vr-white p-3">
              {!editing && partner.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={partner.logoUrl} alt={partner.name} className="max-h-[48px] w-auto object-contain mx-auto" />
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <EditableText as="span" className="font-micro text-xs uppercase text-vr-forest/70 flex-1" value={partner.name} path={`${basePath}.items.${i}.name`} />
                    <ListControls path={`${basePath}.items`} index={i} count={items.length} />
                  </div>
                  {editing && <EditableUrl path={`${basePath}.items.${i}.logoUrl`} label="Logo image URL" />}
                </>
              )}
            </div>
          ))}
        </div>
        <AddButton path={`${basePath}.items`} item={NEW_PARTNER} label="Add partner" />
      </div>
    </section>
  )
}
