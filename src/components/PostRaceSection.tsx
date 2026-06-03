import SectionWrapper from './SectionWrapper'
import { EventData } from '@/types/event'

type Props = { data: EventData['sections']['postRace'] }

export default function PostRaceSection({ data }: Props) {
  return (
    <SectionWrapper id="post-race" label="Post-Race">
      <h2 className="font-display text-5xl md:text-6xl uppercase mb-8 text-vr-forest">Post-Race</h2>

      {data.finishLineInfo && (
        <p className="font-body text-base text-vr-forest/80 leading-relaxed mb-12 max-w-2xl">
          {data.finishLineInfo}
        </p>
      )}

      {data.courseRecords.length > 0 && (
        <div className="mb-12">
          <h3 className="font-heading text-xl uppercase text-vr-forest mb-6 tracking-wide">
            Course Records
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.courseRecords.map((record, i) => (
              <div key={i} className="border border-vr-forest/10 rounded-lg p-5 bg-vr-offwhite">
                <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-mid mb-1">
                  {record.category}
                </p>
                <p className="font-heading text-2xl text-vr-forest uppercase mb-1">
                  {record.time}
                </p>
                <p className="font-body text-sm text-vr-mid">
                  {record.name} · {record.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.infoSections && data.infoSections.length > 0 && (
        <div className="space-y-8 border-t border-vr-forest/10 pt-10">
          {data.infoSections.map((section, i) => (
            <div key={i} className="border-b border-vr-forest/10 pb-8 last:border-0">
              <h3 className="font-heading text-xl uppercase text-vr-forest mb-4 tracking-wide">
                {section.heading}
              </h3>
              <p className="font-body text-sm text-vr-forest/80 leading-relaxed mb-4 max-w-2xl whitespace-pre-line">
                {section.body}
              </p>
              {section.links && section.links.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {section.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label text-xs tracking-[0.2em] uppercase px-5 py-2.5 border border-vr-forest/20 text-vr-forest rounded hover:bg-vr-offwhite transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  )
}
