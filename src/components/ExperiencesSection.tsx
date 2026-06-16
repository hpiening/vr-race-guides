'use client'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { ListControls, AddButton } from './edit/ListControls'

type Props = { data: EventData['sections']['experiences']; basePath?: string }

export default function ExperiencesSection({ data, basePath = 'sections.experiences' }: Props) {
  const editing = !!useEditOptional()?.editing

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
                  {editing && <EditableText as="div" className="font-micro text-xs text-vr-sandstone mt-1" value={r.url} path={`${rp}.url`} placeholder="URL" />}
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
