'use client'
import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'

type Props = { data: EventData['sections']['faqs']; basePath?: string }

export default function FAQSection({ data, basePath = 'sections.faqs' }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const ctx = useEditOptional()
  const editing = !!ctx?.editing
  const itemsPath = `${basePath}.items`

  return (
    <SectionWrapper id="faqs" label="FAQs" dark>
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-cream">FAQs</h2>
      <dl className="divide-y divide-vr-cream/10">
        {data.items.map((item, i) => {
          const isOpen = editing || open === i
          return (
            <div key={i}>
              <dt>
                <div className="w-full flex justify-between items-start gap-4 py-5">
                  <span className="faq-q-btn font-heading text-base md:text-lg uppercase leading-tight text-vr-cream flex-1 text-left">
                    {editing ? (
                      <EditableText as="span" value={item.question} path={`${itemsPath}.${i}.question`} />
                    ) : (
                      <button className="w-full text-left" onClick={() => setOpen(open === i ? null : i)}>
                        {item.question}
                      </button>
                    )}
                  </span>
                  {editing ? (
                    <ListControls ctx={ctx!} path={itemsPath} index={i} count={data.items.length} />
                  ) : (
                    <span
                      className={`shrink-0 text-vr-floral text-xl leading-none transition-transform duration-200 mt-0.5 print:hidden ${open === i ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  )}
                </div>
              </dt>
              <dd className={`pb-6 -mt-1 ${isOpen ? '' : 'hidden print:block'}`}>
                <div className="font-body text-sm text-vr-cream/70 leading-relaxed max-w-2xl">
                  {editing ? (
                    <EditableText as="div" value={item.answer} path={`${itemsPath}.${i}.answer`} />
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </dd>
            </div>
          )
        })}
      </dl>

      {editing && (
        <button
          onClick={() => ctx!.listAdd(itemsPath, { question: 'New question', answer: 'New answer' })}
          className="mt-6 font-label text-xs tracking-[0.15em] uppercase text-vr-floral border border-vr-floral/40 rounded-full px-4 py-2 hover:bg-vr-floral/10"
        >
          + Add FAQ
        </button>
      )}
    </SectionWrapper>
  )
}

function ListControls({
  ctx,
  path,
  index,
  count,
}: {
  ctx: NonNullable<ReturnType<typeof useEditOptional>>
  path: string
  index: number
  count: number
}) {
  const btn = 'text-vr-cream/60 hover:text-vr-cream disabled:opacity-20 px-1.5 text-sm leading-none'
  return (
    <span className="shrink-0 flex items-center gap-0.5">
      <button className={btn} disabled={index === 0} onClick={() => ctx.listMove(path, index, -1)} aria-label="Move up" title="Move up">↑</button>
      <button className={btn} disabled={index === count - 1} onClick={() => ctx.listMove(path, index, 1)} aria-label="Move down" title="Move down">↓</button>
      <button className="text-vr-floral/70 hover:text-vr-floral px-1.5 text-sm leading-none" onClick={() => ctx.listRemove(path, index)} aria-label="Remove" title="Remove">✕</button>
    </span>
  )
}
