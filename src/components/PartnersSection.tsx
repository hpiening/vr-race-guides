'use client'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader } from './trailhead/Shared'

type Props = { data: NonNullable<EventData['partners']>; basePath?: string; theme?: 'classic' | 'trailhead' }

const NEW_PARTNER = { name: 'New partner', logoUrl: '', url: '' }

export default function PartnersSection({ data, basePath = 'partners', theme = 'classic' }: Props) {
  const editCtx = useEditOptional()
  const editing = !!editCtx?.editing
  const items = data.items ?? []

  // ── Trailhead view (renders in both view + edit mode) ──
  if (theme === 'trailhead') {
    // Keep the ORIGINAL index on every item: it is the edit path, so splitting
    // the list must not renumber anything.
    const indexed = items.map((p, i) => ({ p, i }))
    const featured = indexed.filter(({ p }) => p.presenting)
    const rest = indexed.filter(({ p }) => !p.presenting)

    const card = ({ p, i }: { p: typeof items[number]; i: number }, big: boolean) => {
      const pp = `${basePath}.items.${i}`
      const logo = p.logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={p.logoUrl}
          alt={p.name}
          className={`${big ? 'max-h-[104px]' : 'max-h-[56px]'} max-w-full w-auto object-contain`}
        />
      ) : (
        <span className={`font-micro uppercase text-vr-forest/45 tracking-[0.06em] ${big ? 'text-[15px]' : 'text-[12px]'}`}>{p.name}</span>
      )
      return (
        <div
          key={i}
          className={`bg-vr-white border rounded-lg flex flex-col items-center justify-center text-center gap-2 ${
            big
              ? 'min-h-[168px] border-[#d6c6ae] px-10 py-7 shadow-[0_1px_3px_rgba(43,20,48,0.06)]'
              : 'min-h-[100px] border-[#e0d4c0] p-3'
          }`}
        >
          {editing ? (
            <div className="w-full flex flex-col gap-1 items-stretch text-left">
              <div className="flex items-center gap-1">
                <EditableText as="div" className="font-micro uppercase text-[12px] tracking-[0.06em] flex-1" value={p.name} path={`${pp}.name`} placeholder="Partner name" />
                <ListControls path={`${basePath}.items`} index={i} count={items.length} />
              </div>
              <EditableImage path={`${pp}.logoUrl`} label="Logo" />
              <EditableUrl path={`${pp}.url`} label="Website link" />
              <label className="flex items-center gap-1.5 font-micro text-[10px] uppercase tracking-wider text-vr-forest/70 mt-1">
                <input
                  type="checkbox"
                  checked={!!p.presenting}
                  onChange={e => editCtx?.setValue(`${pp}.presenting`, e.target.checked || undefined)}
                />
                Presenting partner
              </label>
            </div>
          ) : p.url ? (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">{logo}</a>
          ) : logo}
        </div>
      )
    }

    return (
      <section className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-24 border-t border-[#e6dccb]">
        <div className="max-w-[1180px] mx-auto text-center">
          <TrailHeader center eyebrow="Proudly supported by" title="Our Partners" className="mb-10" />

          {/* Presenting sponsor: alone, centred, above everything else. */}
          {featured.length > 0 && (
            <div className="mb-10">
              <p className="font-micro font-bold uppercase text-vr-forest/55 mb-3.5" style={{ fontSize: '10px', letterSpacing: '0.22em' }}>
                {featured.length > 1 ? 'Presenting partners' : 'Presenting partner'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {featured.map(entry => (
                  <div key={entry.i} className="w-full max-w-[380px]">{card(entry, true)}</div>
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))' }}>
              {rest.map(entry => card(entry, false))}
            </div>
          )}
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
          {items.map((partner, i) => {
            const pp = `${basePath}.items.${i}`
            const logo = partner.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={partner.logoUrl} alt={partner.name} className="max-h-[48px] w-auto object-contain mx-auto" />
            ) : (
              <span className="font-micro text-xs uppercase text-vr-forest/70">{partner.name}</span>
            )
            return (
              <div key={i} className="border border-vr-forest/10 rounded-lg bg-vr-white p-3">
                {editing ? (
                  <>
                    <div className="flex items-center gap-1">
                      <EditableText as="span" className="font-micro text-xs uppercase text-vr-forest/70 flex-1" value={partner.name} path={`${pp}.name`} />
                      <ListControls path={`${basePath}.items`} index={i} count={items.length} />
                    </div>
                    <EditableImage path={`${pp}.logoUrl`} label="Logo" />
                    <EditableUrl path={`${pp}.url`} label="Website link" />
                  </>
                ) : partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block">{logo}</a>
                ) : logo}
              </div>
            )
          })}
        </div>
        <AddButton path={`${basePath}.items`} item={NEW_PARTNER} label="Add partner" />
      </div>
    </section>
  )
}
