'use client'
import { WelcomeData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'

type Props = { data: WelcomeData; basePath?: string }

export default function WelcomeSection({ data, basePath = 'sections.welcome' }: Props) {
  const editing = !!useEditOptional()?.editing
  if (!data.enabled && !editing) return null

  return (
    <section className="py-14 md:py-20 px-6 md:px-12 bg-vr-offwhite border-b border-vr-forest/10">
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
