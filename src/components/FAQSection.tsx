'use client'
import { useState } from 'react'
import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['faqs'] }

export default function FAQSection({ data }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <SectionWrapper id="faqs" label="FAQs">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8">FAQs</h2>
      <dl className="divide-y divide-vr-forest/10">
        {data.items.map((item, i) => (
          <div key={i}>
            <dt>
              <button
                className="w-full flex justify-between items-start gap-4 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-heading text-base md:text-lg uppercase leading-tight">
                  {item.question}
                </span>
                <span className={`shrink-0 text-vr-amber text-xl leading-none transition-transform duration-200 mt-0.5 ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
            </dt>
            {open === i && (
              <dd className="pb-6 -mt-1">
                <p className="font-body text-sm text-vr-mid leading-relaxed max-w-2xl">
                  {item.answer}
                </p>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </SectionWrapper>
  )
}
