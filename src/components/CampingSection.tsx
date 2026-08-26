'use client'
import { EventData, CardIcon } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'
import { RichBody, PhotoFrame, CardIconMark, CARD_ICONS } from './trailhead/Shared'

/**
 * VR Campground section — overview + optional photo + a reservation button, then
 * reference cards (Pricing, Check-In, Check-Out, Rules). Renders between Expo and
 * On-the-Course. Fully editable in /edit. Trailhead-styled; used on trailhead
 * guides (falls back gracefully on classic via the shared vr-* tokens).
 */
type Props = {
  data: NonNullable<EventData['sections']['camping']>
  basePath?: string
  theme?: 'classic' | 'trailhead'
}

export default function CampingSection({ data, basePath = 'sections.camping' }: Props) {
  const editCtx = useEditOptional()
  const editing = !!editCtx?.editing
  const blocks = data.infoBlocks ?? []

  return (
    <section id="camping" className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="leading-[0.9]">
            <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>
              <EditableText as="span" value={data.eyebrow || 'Stay with us'} path={`${basePath}.eyebrow`} />
            </span>
          </div>
          <h2 className="font-display uppercase text-vr-forest leading-[0.9] mt-0.5 m-0" style={{ fontSize: 'clamp(40px,5.6vw,76px)' }}>
            <EditableText as="span" value={data.heading || 'VR Campground'} path={`${basePath}.heading`} />
          </h2>
        </div>

        {/* Overview + photo */}
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] items-start mb-10">
          <div>
            <EditableText
              as="div"
              className="font-body text-vr-forest leading-[1.7] whitespace-pre-line text-[18px]"
              value={data.overview}
              path={`${basePath}.overview`}
            />
            {editing ? (
              <div className="mt-4 space-y-1">
                <EditableUrl path={`${basePath}.bookingUrl`} label="Reservation URL (optional)" />
                <EditableText as="div" className="font-micro text-xs uppercase text-vr-mid" value={data.bookingLabel ?? ''} path={`${basePath}.bookingLabel`} placeholder="Button label (optional)" />
              </div>
            ) : data.bookingUrl ? (
              <a
                href={data.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 font-label text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-full bg-vr-forest text-vr-cream hover:opacity-90 transition-opacity"
              >
                {data.bookingLabel || 'Reserve your spot'} ↗
              </a>
            ) : null}
          </div>
          {editing ? (
            <EditableImage path={`${basePath}.imageUrl`} label="Campground photo" ratio="4 / 3" />
          ) : (
            <PhotoFrame src={data.imageUrl} label="Campground photo" ratio="4 / 3" />
          )}
        </div>

        {/* Reference cards: Pricing / Check-In / Check-Out / Rules */}
        {(blocks.length > 0 || editing) && (
          <div className="grid gap-6 md:grid-cols-2">
            {blocks.map((b, i) => (
              <div key={i} className="border border-vr-line bg-vr-white rounded-lg p-7">
                <div className="flex items-start gap-2 mb-3">
                  {b.icon && <CardIconMark icon={b.icon} size={18} />}
                  <EditableText as="h3" className="font-heading uppercase text-vr-forest flex-1 text-[18px] tracking-[0.04em]" value={b.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                  <ListControls path={`${basePath}.infoBlocks`} index={i} count={blocks.length} />
                </div>
                <EditableText
                  as="div"
                  className="font-body text-vr-forest/85 leading-[1.65] whitespace-pre-line text-[15px]"
                  value={b.body}
                  path={`${basePath}.infoBlocks.${i}.body`}
                />
                {!editing && b.linkLabel && b.linkUrl && (
                  <a href={b.linkUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-label text-xs tracking-[0.12em] uppercase text-vr-sky hover:text-vr-forest transition-colors">
                    {b.linkLabel} ↗
                  </a>
                )}
                {editing && (
                  <div className="mt-2">
<div className="mt-2 flex items-center gap-2">
                  <span className="font-micro text-[10px] uppercase tracking-wider text-vr-mid">Icon</span>
                  <select
                    value={b.icon ?? ''}
                    onChange={e => editCtx?.setValue(`${basePath}.infoBlocks.${i}.icon`, e.target.value || undefined)}
                    aria-label="Icon"
                    className="bg-vr-forest/10 border border-vr-forest/25 rounded text-vr-forest font-micro text-[10px] uppercase tracking-wider px-1.5 py-1"
                  >
                    <option value="">No icon</option>
                    {(Object.keys(CARD_ICONS) as CardIcon[]).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <EditableText as="div" className="font-micro text-xs uppercase text-vr-mid" value={b.linkLabel ?? ''} path={`${basePath}.infoBlocks.${i}.linkLabel`} placeholder="Button label (optional)" />
                    <EditableUrl path={`${basePath}.infoBlocks.${i}.linkUrl`} label="Button URL (optional)" />
                  </div>
                )}
              </div>
            ))}
            <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
          </div>
        )}
      </div>
    </section>
  )
}
