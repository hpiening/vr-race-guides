import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import Link from 'next/link'
import { EventData } from '@/types/event'

function getEvents(): EventData[] {
  const contentDir = path.join(process.cwd(), 'content', 'events')
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8')
    return JSON.parse(raw) as EventData
  })
}

export default function Home() {
  const events = getEvents()

  return (
    <main className="min-h-screen bg-vr-forest">
      <header className="px-6 pt-10 pb-8 md:px-12">
        <Image
          src="/images/vr-logo.png"
          alt="Vacation Races"
          width={160}
          height={40}
          className="h-8 w-auto brightness-0 invert mb-10"
        />
        <p className="font-micro text-xs tracking-[0.25em] uppercase text-vr-cream/40 mb-2">
          Race Day Guides
        </p>
        <h1 className="font-display text-5xl md:text-6xl uppercase text-vr-cream leading-none">
          Select Your Race
        </h1>
      </header>

      <section className="px-6 pb-16 md:px-12">
        <div className="max-w-4xl grid gap-4 sm:grid-cols-2">
          {events.map(event => (
            <Link
              key={event.slug}
              href={`/${event.slug}/`}
              className="group relative overflow-hidden rounded-xl border border-vr-cream/10 bg-vr-cream/5 hover:bg-vr-cream/10 transition-colors p-6 flex flex-col justify-between min-h-[180px]"
            >
              {event.heroImage && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                  <Image
                    src={event.heroImage}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative z-10">
                <p className="font-micro text-xs tracking-[0.2em] uppercase text-vr-cream/40 mb-2">
                  {event.dates}
                </p>
                <h2 className="font-display text-3xl md:text-4xl uppercase text-vr-cream leading-none mb-2">
                  {event.name}
                </h2>
                <p className="font-label text-xs tracking-widest uppercase text-vr-cream/50">
                  {event.tagline}
                </p>
              </div>
              <p className="relative z-10 font-micro text-xs tracking-[0.15em] uppercase text-vr-floral mt-6">
                View Guide →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
