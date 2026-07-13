'use client'
import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import { RichBody } from './trailhead/Shared'
import { ListControls, AddButton } from './edit/ListControls'
import { TrailHeader } from './trailhead/Shared'

type Props = { data: EventData['sections']['faqs']; basePath?: string; theme?: 'classic' | 'trailhead' }

export default function FAQSection({ data, basePath = 'sections.faqs', theme = 'classic' }: Props) {
  const [open, setOpen] = useState<number | null>(null)
  const ctx = useEditOptional()
  const editing = !!ctx?.editing
  const itemsPath = `${basePath}.items`

  if (theme === 'trailhead') {
    return (
      <section id="faqs" className="bg-vr-forest px-6 md:px-12 py-20 md:py-[104px]">
        <div className="max-w-[880px] mx-auto">
          <TrailHeader dark eyebrow="Good to know" title="FAQs" className="mb-10" />
          {editing ? (
            <div className="flex flex-col gap-3">
              {data.items.map((item, i) => (
                <div key={i} className="border border-vr-cream/[0.18] rounded-lg p-5">
                  <div className="flex items-start gap-2">
                    <EditableText as="div" className="font-heading uppercase text-vr-cream flex-1 text-[17px] tracking-[0.02em]" value={item.question} path={`${itemsPath}.${i}.question`} />
                    <ListControls path={itemsPath} index={i} count={data.items.length} />
                  </div>
                  <EditableText as="div" className="font-body text-vr-cream/[0.78] leading-[1.65] mt-2" value={item.answer} path={`${itemsPath}.${i}.answer`} />
                </div>
              ))}
              <AddButton path={itemsPath} item={{ question: 'New question', answer: 'New answer' }} label="Add FAQ" />
            </div>
          ) : (
            <div className="flex flex-col">
              {data.items.map((item, i) => (
                <details key={i} className="border-t border-vr-cream/[0.18] last:border-b last:border-vr-cream/[0.18]">
                  <summary className="flex justify-between items-center gap-5 py-6">
                    <span className="font-heading uppercase text-vr-cream" style={{ fontSize: '17px', letterSpacing: '0.02em' }}>{item.question}</span>
                    <span className="tl-plus text-vr-sky font-light shrink-0 transition-transform duration-200" style={{ fontSize: '24px' }}>+</span>
                  </summary>
                  <p className="m-0 pb-6 font-body text-vr-cream/[0.78] leading-[1.65] max-w-[680px]" style={{ fontSize: '15px' }}><RichBody value={item.answer} /></p>
                </details>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

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
                    <ListControls path={itemsPath} index={i} count={data.items.length} />
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
                    <p><RichBody value={item.answer} /></p>
                  )}
                </div>
              </dd>
            </div>
          )
        })}
      </dl>

      <AddButton path={itemsPath} item={{ question: 'New question', answer: 'New answer' }} label="Add FAQ" />
    </SectionWrapper>
  )
}
