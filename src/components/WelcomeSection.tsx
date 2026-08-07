'use client'
import { WelcomeData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableImage from './edit/EditableImage'

type Props = { data: WelcomeData; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function WelcomeSection({ data, basePath = 'sections.welcome', theme = 'classic' }: Props) {
  const editing = !!useEditOptional()?.editing
  if (!data.enabled && !editing) return null

  if (theme === 'trailhead') {
    return (
      <section className="guide-welcome bg-vr-offwhite px-6 md:px-12 py-20 md:py-[100px]">
        <div className="max-w-[1180px] mx-auto grid gap-12 md:gap-16 md:grid-cols-[0.95fr_1.25fr] items-start">
          <div>
          {editing ? (
            <h2 className="font-display uppercase text-vr-forest m-0 leading-[0.9]" style={{ fontSize: 'clamp(40px,5.4vw,76px)' }}>
              <EditableText as="span" value={data.heading} path={`${basePath}.heading`} />
            </h2>
          ) : (() => {
            // Explicit "eyebrow|headline" (or a line break) split lets the
            // headline be multiple words (e.g. "Welcome to the|Black Hills" or
            // "Welcome to the\nBlack Hills"). Without a separator, fall back to
            // the original behaviour: last word is the headline.
            const raw = data.heading.trim()
            const sep = raw.includes('|') ? '|' : (/\r?\n/.test(raw) ? '\n' : '')
            let eyebrow: string, last: string
            if (sep) {
              const [head, ...rest] = raw.split(/[|\n]/)
              eyebrow = head.trim()
              last = rest.join(' ').trim()
            } else {
              const words = raw.split(/\s+/)
              last = words.length > 1 ? words.pop()! : ''
              eyebrow = words.join(' ')
            }
            return (
              <div>
                {last && (
                  <div className="leading-[0.9] mb-0.5">
                    <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{eyebrow}</span>
                  </div>
                )}
                <h2 className="font-display uppercase text-vr-forest m-0 leading-[0.9]" style={{ fontSize: 'clamp(40px,5.4vw,76px)' }}>
                  {last || data.heading}
                </h2>
              </div>
            )
          })()}
          {(data.imageUrl || editing) && (
            editing ? (
              <div className="mt-8"><EditableImage path={`${basePath}.imageUrl`} label="Welcome image" /></div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={data.imageUrl} alt="" className="mt-8 w-full rounded-lg object-cover aspect-square" />
            )
          )}
          </div>

          <div>
            <div className="font-body text-vr-forest leading-[1.7] mb-6 whitespace-pre-line" style={{ fontSize: '18px' }}>
              <EditableText as="div" value={data.body} path={`${basePath}.body`} />
            </div>

            {(editing || data.quote) && (
              <blockquote className="m-0 mb-6 pl-6 border-l-2 border-vr-sky">
                <div className="font-accent text-vr-forest leading-[1.3] mb-1.5" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>
                  &ldquo;<EditableText as="span" value={data.quote ?? ''} path={`${basePath}.quote`} />&rdquo;
                </div>
                {(editing || data.quoteAttribution) && (
                  <cite className="font-micro text-xs tracking-[0.12em] uppercase text-vr-forest/60 not-italic">
                    — <EditableText as="span" value={data.quoteAttribution ?? ''} path={`${basePath}.quoteAttribution`} />
                  </cite>
                )}
              </blockquote>
            )}

            {(editing || data.closing) && (
              <div className="font-body text-vr-forest/85 leading-[1.7] mb-7 whitespace-pre-line" style={{ fontSize: '18px' }}>
                <EditableText as="div" value={data.closing ?? ''} path={`${basePath}.closing`} />
              </div>
            )}

            {(editing || data.note) && (
              <div className="bg-vr-white border border-vr-line rounded-md px-5 py-[18px]" style={{ borderLeft: '3px solid var(--vr-sky)' }}>
                <div className="font-body text-sm text-vr-forest/80 leading-relaxed">
                  <EditableText as="div" value={data.note ?? ''} path={`${basePath}.note`} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="guide-welcome py-14 md:py-20 px-6 md:px-12 bg-vr-offwhite border-b border-vr-forest/10">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl uppercase text-vr-forest mb-6 leading-tight">
          <EditableText as="span" value={data.heading} path={`${basePath}.heading`} />
        </h2>

        <div className="font-body text-base text-vr-forest/80 leading-relaxed mb-8 whitespace-pre-line">
          <EditableText as="div" value={data.body} path={`${basePath}.body`} />
        </div>

        {(editing || data.quote) && (
          <blockquote className="border-l-4 border-vr-floral pl-6 my-8">
            <div className="font-accent text-xl md:text-2xl text-vr-forest leading-snug mb-3">
              &ldquo;<EditableText as="span" value={data.quote ?? ''} path={`${basePath}.quote`} />&rdquo;
            </div>
            {(editing || data.quoteAttribution) && (
              <cite className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid not-italic">
                — <EditableText as="span" value={data.quoteAttribution ?? ''} path={`${basePath}.quoteAttribution`} />
              </cite>
            )}
          </blockquote>
        )}

        {(editing || data.closing) && (
          <div className="font-body text-base text-vr-forest/80 leading-relaxed mb-8 whitespace-pre-line">
            <EditableText as="div" value={data.closing ?? ''} path={`${basePath}.closing`} />
          </div>
        )}

        {(editing || data.note) && (
          <div className="mt-8 p-5 bg-vr-cream/60 border border-vr-forest/10 rounded-lg">
            <div className="font-body text-sm text-vr-forest/70 leading-relaxed italic">
              <EditableText as="div" value={data.note ?? ''} path={`${basePath}.note`} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
