'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader, PhotoFrame } from './trailhead/Shared'

type Props = { data: EventData['sections']['experiences']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function ExperiencesSection({ data, basePath = 'sections.experiences', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing

  if (theme === 'trailhead' && !editing) return <ExperiencesTrailhead data={data} />

  return (
    <SectionWrapper id="experiences" label="Experiences">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-12">Experiences</h2>

      {/* Lodging */}
      <div className="bg-vr-forest text-vr-cream rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Official Lodging Partner</p>
          <EditableText as="div" className="font-heading text-2xl uppercase mb-2" value={data.lodging.partner} path={`${basePath}.lodging.partner`} />
          <EditableText as="div" className="font-body text-sm text-vr-cream/80 max-w-md leading-relaxed" value={data.lodging.description} path={`${basePath}.lodging.description`} />
          {editing && <EditableText as="div" className="font-micro text-xs text-vr-cream/50 mt-2" value={data.lodging.url} path={`${basePath}.lodging.url`} placeholder="Booking URL" />}
          {editing && <EditableUrl path={`${basePath}.lodging.imageUrl`} label="Lodging image URL (optional)" />}
        </div>
        {!editing && (
          <a href={data.lodging.url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 bg-vr-cream text-vr-forest rounded hover:bg-vr-cream/90 transition-colors">
            Book Your Stay
          </a>
        )}
      </div>

      {/* Activities */}
      {data.activities.map((act, i) => {
        const ap = `${basePath}.activities.${i}`
        return (
          <div key={i} className="bg-vr-offwhite rounded-lg p-6 md:p-8 mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <EditableText as="div" className="font-heading text-xl uppercase mb-2 flex-1" value={act.name} path={`${ap}.name`} />
                <ListControls path={`${basePath}.activities`} index={i} count={data.activities.length} />
              </div>
              <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed max-w-md mb-3" value={act.description} path={`${ap}.description`} />
              {(editing || act.discountCode) && (
                <p className="font-micro text-sm">
                  Use code{' '}
                  <span className="font-label tracking-widest bg-vr-forest text-vr-cream px-2 py-0.5 rounded text-xs inline-block">
                    <EditableText as="span" value={act.discountCode ?? ''} path={`${ap}.discountCode`} />
                  </span>{' '}to save
                </p>
              )}
              {editing && <EditableText as="div" className="font-micro text-xs text-vr-mid mt-2" value={act.url} path={`${ap}.url`} placeholder="Link URL" />}
            </div>
            {!editing && (
              <a href={act.url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-label text-xs tracking-[0.2em] uppercase px-6 py-3 bg-vr-forest text-vr-cream rounded hover:bg-vr-forest/90 transition-colors">
                Learn More
              </a>
            )}
          </div>
        )
      })}
      <AddButton path={`${basePath}.activities`} item={{ name: 'New activity', description: '', url: '' }} label="Add activity" />

      {/* Hikes */}
      {(data.hikes.length > 0 || editing) && (
        <div className="mb-10 mt-10">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Top Hikes</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.hikes.map((hike, i) => {
              const hp = `${basePath}.hikes.${i}`
              const inner = (
                <>
                  <div className="flex items-start gap-1">
                    <EditableText as="div" className="font-heading text-base uppercase mb-3 flex-1 group-hover:text-vr-floral transition-colors" value={hike.name} path={`${hp}.name`} />
                    {editing && <ListControls path={`${basePath}.hikes`} index={i} count={data.hikes.length} />}
                  </div>
                  <div className="space-y-1">
                    <EditableText as="div" className="font-micro text-xs text-vr-mid" value={hike.distance} path={`${hp}.distance`} />
                    <EditableText as="div" className="font-micro text-xs text-vr-mid" value={hike.elevation} path={`${hp}.elevation`} />
                    <EditableText as="div" className="font-micro text-xs text-vr-mid" value={hike.difficulty} path={`${hp}.difficulty`} />
                    {editing && <EditableText as="div" className="font-micro text-xs text-vr-sandstone mt-1" value={hike.url} path={`${hp}.url`} placeholder="URL" />}
                    {editing && <EditableUrl path={`${hp}.imageUrl`} label="Photo URL (optional)" />}
                  </div>
                </>
              )
              return editing ? (
                <div key={i} className="border border-vr-forest/10 rounded-lg p-5 group">{inner}</div>
              ) : (
                <a key={i} href={hike.url} target="_blank" rel="noopener noreferrer" className="border border-vr-forest/10 rounded-lg p-5 hover:border-vr-forest/30 transition-colors group">{inner}</a>
              )
            })}
          </div>
          <AddButton path={`${basePath}.hikes`} item={{ name: 'New hike', distance: '', elevation: '', difficulty: '', url: '' }} label="Add hike" />
        </div>
      )}

      {/* Iconic Sights */}
      {((data.sights && data.sights.length > 0) || editing) && (
        <div className="mb-10">
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Iconic Views &amp; Sights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(data.sights ?? []).map((s, i) => {
              const sp = `${basePath}.sights.${i}`
              return (
                <div key={i} className="border border-vr-forest/10 rounded-lg p-5">
                  <div className="flex items-start gap-2">
                    <EditableText as="div" className="font-heading text-base uppercase mb-2 flex-1" value={s.name} path={`${sp}.name`} />
                    <ListControls path={`${basePath}.sights`} index={i} count={data.sights!.length} />
                  </div>
                  <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed" value={s.description} path={`${sp}.description`} />
                  {editing ? (
                    <EditableText as="div" className="font-micro text-xs text-vr-sandstone mt-2" value={s.url ?? ''} path={`${sp}.url`} placeholder="URL (optional)" />
                  ) : s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-micro text-xs tracking-widest uppercase text-vr-sandstone hover:text-vr-forest transition-colors">Learn More ↗</a>
                  ) : null}
                </div>
              )
            })}
          </div>
          <AddButton path={`${basePath}.sights`} item={{ name: 'New sight', description: '' }} label="Add sight" />
        </div>
      )}

      {/* Know Before You Go (park pass note) */}
      {(editing || data.parkNote) && (
        <div className="mt-8 mb-2 bg-vr-forest text-vr-cream rounded-lg p-5">
          <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/50 mb-1">Know Before You Go</p>
          <EditableText as="div" className="font-body text-sm text-vr-cream/80 leading-relaxed" value={data.parkNote ?? ''} path={`${basePath}.parkNote`} placeholder="Park pass / timed-entry note" />
        </div>
      )}

      {/* Restaurants */}
      {(data.restaurants.length > 0 || editing) && (
        <div>
          <h3 className="font-heading text-xl uppercase mb-6 tracking-wide">Where to Eat</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {data.restaurants.map((r, i) => {
              const rp = `${basePath}.restaurants.${i}`
              const inner = (
                <>
                  <div className="flex items-start gap-1">
                    <EditableText as="div" className="font-heading text-base uppercase mb-2 flex-1 group-hover:text-vr-floral transition-colors" value={r.name} path={`${rp}.name`} />
                    {editing && <ListControls path={`${basePath}.restaurants`} index={i} count={data.restaurants.length} />}
                  </div>
                  <EditableText as="div" className="font-body text-sm text-vr-mid leading-relaxed" value={r.description} path={`${rp}.description`} />
                  {editing && (
                    <div className="mt-1 space-y-0.5">
                      <EditableText as="div" className="font-micro text-xs text-vr-mid" value={r.url} path={`${rp}.url`} placeholder="Website URL" />
                      <EditableText as="div" className="font-micro text-xs text-vr-mid" value={r.icon ?? ''} path={`${rp}.icon`} placeholder="Emoji (optional)" />
                      <EditableText as="div" className="font-micro text-xs text-vr-mid" value={r.address ?? ''} path={`${rp}.address`} placeholder="Address (optional)" />
                      <EditableText as="div" className="font-micro text-xs text-vr-mid" value={r.phone ?? ''} path={`${rp}.phone`} placeholder="Phone (optional)" />
                    </div>
                  )}
                </>
              )
              return editing ? (
                <div key={i} className="border border-vr-forest/10 rounded-lg p-5 group">{inner}</div>
              ) : (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="border border-vr-forest/10 rounded-lg p-5 hover:border-vr-forest/30 transition-colors group">{inner}</a>
              )
            })}
          </div>
          <AddButton path={`${basePath}.restaurants`} item={{ name: 'New restaurant', description: '', url: '' }} label="Add restaurant" />
        </div>
      )}
    </SectionWrapper>
  )
}

/* ── Trailhead view (display-only) ── */
function ExperiencesTrailhead({ data }: { data: EventData['sections']['experiences'] }) {
  const subhead = 'font-heading uppercase text-vr-forest mb-[18px]'
  const subStyle = { fontSize: '16px', letterSpacing: '0.06em' }
  return (
    <section id="experiences" className="bg-vr-offwhite px-6 md:px-12 py-20 md:py-[104px]">
      <div className="max-w-[1180px] mx-auto">
        <TrailHeader eyebrow="Beyond the race" title="Experiences" className="mb-9" />

        {/* Lodging banner */}
        <div className="grid md:grid-cols-[1.3fr_1fr] border border-vr-line rounded-lg overflow-hidden bg-vr-white mb-9">
          <div className="p-9 flex flex-col justify-center">
            <span className="font-micro uppercase text-vr-sky block mb-2" style={{ fontSize: '11px', letterSpacing: '0.14em' }}>
              Official lodging partner · {data.lodging.partner}
            </span>
            <h3 className="font-heading uppercase text-vr-forest mb-3" style={{ fontSize: '24px', letterSpacing: '0.02em' }}>Book your weekend stay</h3>
            <p className="font-body text-vr-forest/85 leading-[1.6] max-w-[460px] mb-5" style={{ fontSize: '15px' }}>{data.lodging.description}</p>
            <a href={data.lodging.url} target="_blank" rel="noopener noreferrer" className="self-start font-label text-xs tracking-[0.12em] uppercase px-6 py-3 rounded-full bg-vr-forest text-vr-cream hover:opacity-90 transition-opacity">
              Book lodging ↗
            </a>
          </div>
          <PhotoFrame src={data.lodging.imageUrl} label="Lodging photo" ratio="16 / 10" className="min-h-[200px] h-full" />
        </div>

        {/* Activities */}
        {data.activities.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {data.activities.map((act, i) => (
              <div key={i} className="border border-vr-line bg-vr-white rounded-lg p-7 flex flex-col">
                <h3 className="font-heading uppercase text-vr-forest mb-3" style={{ fontSize: '18px', letterSpacing: '0.02em' }}>{act.name}</h3>
                <p className="font-body text-vr-forest/85 leading-[1.6] mb-4 flex-1" style={{ fontSize: '15px' }}>{act.description}</p>
                {act.discountCode && (
                  <p className="font-micro text-sm mb-3">
                    Use code{' '}
                    <span className="font-label tracking-widest bg-vr-forest text-vr-cream px-2 py-0.5 rounded text-xs inline-block">{act.discountCode}</span>
                  </p>
                )}
                <a href={act.url} target="_blank" rel="noopener noreferrer" className="self-start font-label text-xs tracking-[0.12em] uppercase text-vr-sandstone hover:text-vr-forest transition-colors">
                  Learn more ↗
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Hikes */}
        {data.hikes.length > 0 && (
          <>
            <h3 className={subhead} style={subStyle}>Hikes</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-11">
              {data.hikes.map((hike, i) => (
                <a key={i} href={hike.url} target="_blank" rel="noopener noreferrer" className="border border-vr-line bg-vr-white rounded-lg overflow-hidden transition-shadow hover:shadow-[0_14px_30px_rgba(38,69,51,0.14)] block">
                  <PhotoFrame src={hike.imageUrl} label={`${hike.name} photo`} ratio="4 / 3" />
                  <div className="p-6">
                    <div className="font-micro uppercase text-vr-sky mb-1.5" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>
                      {[hike.distance, hike.difficulty].filter(Boolean).join(' · ')}
                    </div>
                    <h4 className="font-heading uppercase text-vr-forest mb-1.5" style={{ fontSize: '17px', letterSpacing: '0.02em' }}>{hike.name}</h4>
                    {hike.elevation && <p className="font-body text-vr-forest/70" style={{ fontSize: '13px' }}>{hike.elevation}</p>}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        {/* Sights */}
        {data.sights && data.sights.length > 0 && (
          <>
            <h3 className={subhead} style={subStyle}>Iconic Views &amp; Sights</h3>
            <div className="grid gap-4 mb-11" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))' }}>
              {data.sights.map((s, i) => {
                const body = (
                  <>
                    <h4 className="font-heading uppercase text-vr-forest mb-1.5" style={{ fontSize: '16px', letterSpacing: '0.02em' }}>{s.name}</h4>
                    <p className="font-body text-vr-forest/85 leading-[1.55]" style={{ fontSize: '14px' }}>{s.description}</p>
                  </>
                )
                return s.url ? (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="border border-vr-line bg-vr-white rounded-lg p-6 block transition-shadow hover:shadow-[0_14px_30px_rgba(38,69,51,0.14)]">{body}</a>
                ) : (
                  <div key={i} className="border border-vr-line bg-vr-white rounded-lg p-6">{body}</div>
                )
              })}
            </div>
          </>
        )}

        {/* Know before you go */}
        {data.parkNote && (
          <div className="mt-9 bg-vr-deep rounded-lg px-7 py-6 flex flex-wrap gap-3.5 items-center">
            <span className="font-heading uppercase text-vr-sky shrink-0" style={{ fontSize: '14px', letterSpacing: '0.04em' }}>Know before you go</span>
            <p className="font-body text-vr-cream/85 leading-[1.55] flex-1 min-w-[260px]" style={{ fontSize: '14px' }}>{data.parkNote}</p>
          </div>
        )}

        {/* Restaurants */}
        {data.restaurants.length > 0 && (
          <>
            <div className="mt-16 mb-3.5">
              <div className="leading-[0.9]"><span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>Where to eat</span></div>
              <h2 className="font-display uppercase text-vr-forest leading-[0.9] m-0" style={{ fontSize: 'clamp(34px,4.6vw,60px)' }}>Restaurants in Estes Park</h2>
            </div>
            <p className="font-body text-vr-forest/85 leading-[1.6] max-w-[620px] mb-8" style={{ fontSize: '17px' }}>A few of the popular local food and drink spots in and around Estes Park.</p>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {data.restaurants.map((r, i) => (
                <div key={i} className="border border-vr-line bg-vr-white rounded-lg p-6">
                  <div className="flex items-center gap-2.5 mb-2">
                    {r.icon && <span style={{ fontSize: '20px' }}>{r.icon}</span>}
                    <h4 className="font-heading uppercase text-vr-forest" style={{ fontSize: '17px', letterSpacing: '0.02em' }}>{r.name}</h4>
                  </div>
                  {r.address && <div className="font-micro text-vr-forest/60 mb-1" style={{ fontSize: '12px' }}>{r.address}</div>}
                  {(r.phone || r.url) && (
                    <div className="flex gap-3.5 mb-3 font-micro" style={{ fontSize: '12px' }}>
                      {r.phone && <span className="text-vr-forest/60">{r.phone}</span>}
                      {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-vr-sky hover:text-vr-forest transition-colors">{r.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a>}
                    </div>
                  )}
                  <p className="font-body text-vr-forest/85 leading-[1.55]" style={{ fontSize: '14px' }}>{r.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
