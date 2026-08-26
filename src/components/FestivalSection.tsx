'use client'
import { FestivalSectionData, CardGroup, FeatureCard, CardIcon } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import EditableImage from './edit/EditableImage'
import { ListControls, AddButton } from './edit/ListControls'
import { RichBody, PhotoFrame, Accordion, ActionLink, CardIconMark, CARD_ICONS } from './trailhead/Shared'

/**
 * Festival section — a repeatable content section for multi-day festival events
 * (Grand Circle Trailfest's Basecamp / Meals & Dining / Performers), which have
 * no home in the single-race section set. Renders between Camping and
 * On-the-Course, one <section> per entry in `sections.festival`.
 *
 * Content is a list of titled card groups, each in one of three layouts
 * (`cards` / `photos` / `rows`), plus optional accordions at the foot. Fully
 * editable in /edit. Guides without a `festival` array never render this.
 */
type Props = {
  data: FestivalSectionData
  /** Index into sections.festival — the edit path root for this section. */
  index: number
  theme?: 'classic' | 'trailhead'
}


const EMPTY_CARD: FeatureCard = { title: 'New card', body: '' }
const EMPTY_GROUP: CardGroup = { heading: 'New group', cards: [EMPTY_CARD] }

export default function FestivalSection({ data, index }: Props) {
  const editCtx = useEditOptional()
  const editing = !!editCtx?.editing
  const basePath = `sections.festival.${index}`
  const groups = data.groups ?? []
  const blocks = data.infoBlocks ?? []

  const tone = data.tone ?? 'light'
  const dark = tone !== 'light'
  const sectionBg = tone === 'darkest' ? 'bg-vr-night' : tone === 'dark' ? 'bg-vr-deep' : 'bg-vr-offwhite'
  const headingColor = dark ? 'text-vr-cream' : 'text-vr-forest'
  const bodyColor = dark ? 'text-vr-cream/80' : 'text-vr-forest/85'
  const introColor = dark ? 'text-vr-cream/90' : 'text-vr-forest'
  const cardShell = dark
    ? 'border border-vr-cream/20 bg-vr-cream/[0.04] rounded-lg'
    : 'border border-vr-line bg-vr-white rounded-lg'
  // Filled label bar for group headings — the device both reference documents
  // use (NPS Zion guide, VR's own 2024 Grand Circle guide): a solid bar with
  // contrasting caps, optionally led by a pictogram. Far easier to scan past
  // than the small caps heading this replaced.
  const barBg = dark ? 'bg-vr-cream' : 'bg-vr-forest'
  const barText = dark ? 'text-vr-forest' : 'text-vr-cream'

  /** eyebrow / title / body / optional link — the shared card innards. */
  const cardBody = (card: FeatureCard, gi: number, ci: number) => {
    const cp = `${basePath}.groups.${gi}.cards.${ci}`
    return (
      <>
        <div className="flex items-start gap-2">
          <EditableText
            as="div"
            className="font-micro uppercase text-vr-sky mb-1.5 flex-1 text-[10px] tracking-[0.12em]"
            value={card.eyebrow ?? ''}
            path={`${cp}.eyebrow`}
            placeholder="Eyebrow (optional)"
          />
          {editing && <ListControls path={`${basePath}.groups.${gi}.cards`} index={ci} count={groups[gi].cards.length} />}
        </div>
        <div className="flex items-start gap-2 mb-1.5">
          {card.icon && <CardIconMark icon={card.icon} size={16} />}
          <EditableText
            as="h4"
            className={`font-heading uppercase flex-1 text-[17px] tracking-[0.02em] ${headingColor}`}
            value={card.title}
            path={`${cp}.title`}
          />
        </div>
        <EditableText
          as="div"
          className={`font-body leading-[1.55] text-[14px] whitespace-pre-line ${bodyColor}`}
          value={card.body ?? ''}
          path={`${cp}.body`}
          placeholder="Body (optional)"
        />
        {editing && <EditableUrl path={`${cp}.url`} label="Link URL (optional)" />}
      </>
    )
  }

  const renderGroup = (group: CardGroup, gi: number) => {
    const gp = `${basePath}.groups.${gi}`
    const layout = group.layout ?? 'cards'
    const cards = group.cards ?? []

    return (
      <div key={gi} className="mb-11">
        <div className="flex items-stretch gap-2 mb-[18px]">
          <div className={`flex items-center gap-2.5 flex-1 min-w-0 px-4 py-2.5 rounded ${barBg}`}>
            {group.icon && <CardIconMark icon={group.icon} size={17} className={barText} />}
            <EditableText
              as="h3"
              className={`font-heading uppercase flex-1 text-[16px] tracking-[0.08em] ${barText}`}
              value={group.heading}
              path={`${gp}.heading`}
            />
            {editing && (
              <select
                value={group.icon ?? ''}
                onChange={e => editCtx?.setValue(`${gp}.icon`, e.target.value || undefined)}
                title="Icon for this group heading"
                aria-label="Group icon"
                className="bg-black/20 border border-current/30 rounded font-micro text-[10px] uppercase tracking-wider px-1.5 py-1"
              >
                <option value="">No icon</option>
                {(Object.keys(CARD_ICONS) as CardIcon[]).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            )}
          </div>
          {editing && <ListControls path={`${basePath}.groups`} index={gi} count={groups.length} />}
        </div>
        <EditableText
          as="div"
          className={`font-body leading-[1.65] text-[15px] mb-5 max-w-3xl whitespace-pre-line ${bodyColor}`}
          value={group.intro ?? ''}
          path={`${gp}.intro`}
          placeholder="Group intro (optional)"
        />

        {/* rows — compact eyebrow-left / title+body-right lines (menus, price lists) */}
        {layout === 'rows' && (
          <div className="flex flex-col gap-2.5">
            {cards.map((card, ci) => {
              const cp = `${gp}.cards.${ci}`
              const inner = (
                <>
                  <EditableText
                    as="div"
                    className="font-label uppercase text-vr-sky text-[12px] tracking-[0.12em]"
                    value={card.eyebrow ?? ''}
                    path={`${cp}.eyebrow`}
                    placeholder="When / label"
                  />
                  <div>
                    {/* Title and meta share a row in view mode. While editing they
                        stack: an auto-growing textarea is width:100%, so as a flex
                        sibling it claimed the whole row and collapsed the flex-1
                        title to zero width — which rendered the heading one
                        character per line. */}
                    {editing ? (
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <EditableText
                            as="div"
                            className={`font-heading uppercase flex-1 text-[15px] tracking-[0.04em] ${headingColor}`}
                            value={card.title}
                            path={`${cp}.title`}
                          />
                          <select
                            value={card.icon ?? ''}
                            onChange={e => editCtx?.setValue(`${cp}.icon`, e.target.value || undefined)}
                            title="Icon shown before the title"
                            aria-label="Card icon"
                            className="bg-vr-cream/10 border border-vr-cream/25 rounded text-vr-cream font-micro text-[10px] uppercase tracking-wider px-1.5 py-1"
                          >
                            <option value="">No icon</option>
                            {(Object.keys(CARD_ICONS) as CardIcon[]).map(k => <option key={k} value={k}>{k}</option>)}
                          </select>
                          <ListControls path={`${gp}.cards`} index={ci} count={cards.length} />
                        </div>
                        <EditableText
                          as="div"
                          className={`font-heading text-[15px] ${dark ? 'text-vr-cream' : 'text-vr-forest'}`}
                          value={card.meta ?? ''}
                          path={`${cp}.meta`}
                          placeholder="Price (optional)"
                        />
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2.5">
                        {card.icon && <CardIconMark icon={card.icon} />}
                        <h4 className={`font-heading uppercase flex-1 text-[15px] tracking-[0.04em] ${headingColor}`}>{card.title}</h4>
                        {card.meta && (
                          <div className={`font-heading text-[15px] shrink-0 ${dark ? 'text-vr-cream' : 'text-vr-forest'}`}>{card.meta}</div>
                        )}
                      </div>
                    )}
                    <EditableText
                      as="div"
                      className={`font-body leading-[1.6] text-[14px] mt-1 whitespace-pre-line ${bodyColor}`}
                      value={card.body ?? ''}
                      path={`${cp}.body`}
                      placeholder="Detail (optional)"
                    />
                    {!editing && card.url && (
                      <span className="inline-block mt-2 font-label text-xs tracking-[0.12em] uppercase text-vr-sky">Visit ↗</span>
                    )}
                    {editing && <EditableUrl path={`${cp}.url`} label="Link URL (optional)" />}
                  </div>
                </>
              )
              const shell = `${cardShell} px-6 py-5 grid gap-4 sm:grid-cols-[150px_1fr] items-baseline`
              return !editing && card.url ? (
                <a key={ci} href={card.url} target="_blank" rel="noopener noreferrer" className={`${shell} transition-opacity hover:opacity-90`}>
                  {inner}
                </a>
              ) : (
                <div key={ci} className={shell}>{inner}</div>
              )
            })}
          </div>
        )}

        {/* photos — image-topped cards */}
        {layout === 'photos' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, ci) => {
              const cp = `${gp}.cards.${ci}`
              const inner = (
                <>
                  {editing ? (
                    <EditableImage path={`${cp}.imageUrl`} label="Card photo" ratio="4 / 3" />
                  ) : (
                    <PhotoFrame src={card.imageUrl} label={`${card.title} photo`} ratio="4 / 3" dark={dark} />
                  )}
                  <div className="p-6">{cardBody(card, gi, ci)}</div>
                </>
              )
              return !editing && card.url ? (
                <a key={ci} href={card.url} target="_blank" rel="noopener noreferrer" className={`${cardShell} overflow-hidden block transition-opacity hover:opacity-90`}>
                  {inner}
                </a>
              ) : (
                <div key={ci} className={`${cardShell} overflow-hidden`}>{inner}</div>
              )
            })}
          </div>
        )}

        {/* cards — text cards (default). A photo is optional here: unlike the
            `photos` layout it only appears once one is set, so a text-only group
            stays text-only and there's no empty placeholder in every card. */}
        {layout === 'cards' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, ci) => {
              const inner = (
                <>
                  {card.imageUrl && !editing && (
                    <PhotoFrame src={card.imageUrl} label={`${card.title} photo`} ratio="16 / 10" dark={dark} />
                  )}
                  <div className="p-7">
                    {cardBody(card, gi, ci)}
                    {editing && (
                      <div className="mt-3">
                        <EditableImage path={`${gp}.cards.${ci}.imageUrl`} label="Card photo (optional)" compact />
                      </div>
                    )}
                  </div>
                </>
              )
              return !editing && card.url ? (
                <a key={ci} href={card.url} target="_blank" rel="noopener noreferrer" className={`${cardShell} block overflow-hidden transition-opacity hover:opacity-90`}>
                  {inner}
                </a>
              ) : (
                <div key={ci} className={`${cardShell} overflow-hidden`}>{inner}</div>
              )
            })}
          </div>
        )}

        {editing && (
          <div className="mt-4"><AddButton path={`${gp}.cards`} item={EMPTY_CARD} label="Add card" /></div>
        )}
      </div>
    )
  }

  return (
    <section id={data.id} className={`${sectionBg} px-6 md:px-12 py-20 md:py-[104px]`}>
      <div className="max-w-[1180px] mx-auto">
        {/* Header */}
        <div className="mb-7">
          <div className="leading-[0.9]">
            <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>
              <EditableText as="span" value={data.eyebrow ?? ''} path={`${basePath}.eyebrow`} placeholder="Eyebrow" />
            </span>
          </div>
          <h2 className={`font-display uppercase leading-[0.9] mt-0.5 m-0 ${headingColor}`} style={{ fontSize: 'clamp(40px,5.6vw,76px)' }}>
            <EditableText as="span" value={data.heading} path={`${basePath}.heading`} />
          </h2>
        </div>

        <EditableText
          as="div"
          className={`font-body leading-[1.7] text-[18px] max-w-3xl mb-10 whitespace-pre-line ${introColor}`}
          value={data.intro ?? ''}
          path={`${basePath}.intro`}
          placeholder="Intro (optional)"
        />

        {(data.imageUrl || editing) && (
          <div className="mb-11">
            {editing ? (
              <EditableImage path={`${basePath}.imageUrl`} label="Section photo (optional)" ratio="21 / 9" />
            ) : (
              <PhotoFrame src={data.imageUrl} label={`${data.heading} photo`} ratio="21 / 9" dark={dark} className="rounded-lg" />
            )}
          </div>
        )}

        {groups.map(renderGroup)}
        {editing && (
          <div className="mb-10"><AddButton path={`${basePath}.groups`} item={EMPTY_GROUP} label="Add card group" /></div>
        )}

        {/* Accordions: flattened to cards while editing so the text stays reachable. */}
        {editing ? (
          <div className="flex flex-col gap-3">
            {blocks.map((b, i) => (
              <div key={i} className={`rounded-lg p-5 ${dark ? 'bg-vr-cream' : 'bg-vr-white border border-vr-line'}`}>
                <div className="flex items-start gap-2">
                  <EditableText as="h3" className="font-heading uppercase text-vr-forest flex-1" value={b.heading} path={`${basePath}.infoBlocks.${i}.heading`} />
                  <ListControls path={`${basePath}.infoBlocks`} index={i} count={blocks.length} />
                </div>
                <EditableText as="div" className="font-body text-vr-forest/85 mt-2 whitespace-pre-line" value={b.body} path={`${basePath}.infoBlocks.${i}.body`} />
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-micro text-[10px] uppercase tracking-wider text-vr-mid">Icon</span>
                  <select
                    value={b.icon ?? ''}
                    onChange={e => editCtx?.setValue(`${basePath}.infoBlocks.${i}.icon`, e.target.value || undefined)}
                    aria-label="Info block icon"
                    className="bg-vr-forest/10 border border-vr-forest/25 rounded text-vr-forest font-micro text-[10px] uppercase tracking-wider px-1.5 py-1"
                  >
                    <option value="">No icon</option>
                    {(Object.keys(CARD_ICONS) as CardIcon[]).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <EditableText as="div" className="font-micro text-xs uppercase text-vr-mid mt-2" value={b.linkLabel ?? ''} path={`${basePath}.infoBlocks.${i}.linkLabel`} placeholder="Button label (optional)" />
                <EditableUrl path={`${basePath}.infoBlocks.${i}.linkUrl`} label="Button URL (optional)" />
              </div>
            ))}
            <AddButton path={`${basePath}.infoBlocks`} item={{ heading: 'Heading', body: 'Body text' }} label="Add info block" />
          </div>
        ) : blocks.length > 0 ? (
          <Accordion
            variant={dark ? 'cream' : 'white'}
            items={blocks.map(b => ({
              heading: b.heading,
              icon: b.icon,
              body: (
                <>
                  <RichBody value={b.body} />
                  {b.linkLabel && b.linkUrl && (
                    <ActionLink href={b.linkUrl} label={b.linkLabel} />
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
