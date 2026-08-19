import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { EventData } from '@/types/event'
import type { SearchItem } from '@/components/SearchBar'
import HeroSection from '@/components/HeroSection'
import StickyNav from '@/components/StickyNav'
import AlertBanner from '@/components/AlertBanner'
import PhotoBand from '@/components/PhotoBand'
import WelcomeSection from '@/components/WelcomeSection'
import ScheduleSection from '@/components/ScheduleSection'
import ExpoSection from '@/components/ExpoSection'
import CampingSection from '@/components/CampingSection'
import FestivalSection from '@/components/FestivalSection'
import RaceMorningSection from '@/components/RaceMorningSection'
import CourseInfoSection from '@/components/CourseInfoSection'
import SpectatorsSection from '@/components/SpectatorsSection'
import PostRaceSection from '@/components/PostRaceSection'
import ExperiencesSection from '@/components/ExperiencesSection'
import FAQSection from '@/components/FAQSection'
import ChallengeEventsSection from '@/components/ChallengeEventsSection'
import PartnersSection from '@/components/PartnersSection'
import PrintButton from '@/components/PrintButton'
import PrintExpand from '@/components/PrintExpand'
import SearchBar from '@/components/SearchBar'

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'content', 'events')
  const files = fs.readdirSync(contentDir)
  return files
    .filter(f => f.endsWith('.json'))
    .map(f => ({ slug: f.replace('.json', '') }))
}

async function getEvent(slug: string): Promise<EventData | null> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'events', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as EventData
  } catch {
    return null
  }
}

function buildSearchIndex(event: EventData): SearchItem[] {
  const items: SearchItem[] = []
  const add = (section: string, sectionId: string, text: string) =>
    items.push({ section, sectionId, text })

  const { sections } = event

  if (sections.welcome?.enabled) {
    add('Welcome', 'schedule', sections.welcome.body)
    if (sections.welcome.note) add('Welcome', 'schedule', sections.welcome.note)
  }

  if (sections.schedule.enabled) {
    sections.schedule.days.forEach(d =>
      d.items.forEach(i => add('Schedule', 'schedule', `${i.label} ${i.note ?? ''} ${i.time}`))
    )
  }

  if (sections.expo.enabled) {
    const expoLabel = sections.expo.navLabel || 'Expo'
    sections.expo.notes.forEach(n => add(expoLabel, 'expo', n))
    sections.expo.infoBlocks?.forEach(b => add(expoLabel, 'expo', `${b.heading} ${b.body}`))
    add(expoLabel, 'expo', `${sections.expo.locationName} ${sections.expo.date}`)
    sections.expo.images?.forEach(i => add(expoLabel, 'expo', `${sections.expo.imagesHeading ?? ''} ${i.title}`))
  }

  if (sections.camping?.enabled) {
    add('Campground', 'camping', `${sections.camping.heading ?? 'VR Campground'} ${sections.camping.overview}`)
    sections.camping.infoBlocks?.forEach(b => add('Campground', 'camping', `${b.heading} ${b.body}`))
  }

  sections.festival?.forEach(f => {
    if (!f.enabled) return
    add(f.navLabel, f.id, `${f.heading} ${f.intro ?? ''}`)
    f.groups?.forEach(g => {
      add(f.navLabel, f.id, `${g.heading} ${g.intro ?? ''}`)
      g.cards.forEach(c => add(f.navLabel, f.id, `${c.eyebrow ?? ''} ${c.title} ${c.body ?? ''}`))
    })
    f.infoBlocks?.forEach(b => add(f.navLabel, f.id, `${b.heading} ${b.body}`))
  })

  const ciLabel = sections.courseInfo.navLabel || 'Course Info'
  if (sections.courseInfo.enabled) {
    add(ciLabel, 'course-info', sections.courseInfo.aidStations)
    add(ciLabel, 'course-info', sections.courseInfo.recoveryFood)
    add(ciLabel, 'course-info', sections.courseInfo.strollerPolicy)
    add(ciLabel, 'course-info', sections.courseInfo.dogPolicy)
    sections.courseInfo.infoBlocks?.forEach(b => add(ciLabel, 'course-info', `${b.heading} ${b.body}`))
    sections.courseInfo.schedule?.forEach(i => add(ciLabel, 'course-info', `${i.time} ${i.label}`))
  }

  const rmLabel = sections.raceMorning.navLabel || 'Race Morning'
  if (sections.raceMorning.enabled) {
    sections.raceMorning.shuttleDetails.forEach(i => add(rmLabel, 'race-morning', `${i.time} ${i.label}`))
    sections.raceMorning.parkingOptions.forEach(p => add(rmLabel, 'race-morning', `${p.name} ${p.details}`))
    if (sections.raceMorning.dropOffNote) add(rmLabel, 'race-morning', sections.raceMorning.dropOffNote)
    sections.raceMorning.infoBlocks?.forEach(b => add(rmLabel, 'race-morning', `${b.heading} ${b.body}`))
  }

  if (sections.spectators.enabled) {
    add('Spectators', 'spectators', sections.spectators.notes)
    sections.spectators.warnings.forEach(w => add('Spectators', 'spectators', w))
  }

  if (sections.postRace.enabled) {
    add('Post-Race', 'post-race', sections.postRace.finishLineInfo)
    sections.postRace.courseRecords.forEach(r =>
      add('Post-Race', 'post-race', `${r.category} ${r.name} ${r.time} ${r.year}`)
    )
    sections.postRace.infoSections?.forEach(s => add('Post-Race', 'post-race', `${s.heading} ${s.body}`))
  }

  if (sections.challengeEvents?.enabled) {
    sections.challengeEvents.events.forEach(e => {
      add('Challenge Events', 'challenge-events', `${e.name} ${e.description}`)
      add('Challenge Events', 'challenge-events', e.bibPickup)
      add('Challenge Events', 'challenge-events', e.medals)
    })
  }

  if (sections.experiences.enabled) {
    const expLabel = sections.experiences.navLabel || 'Experiences'
    add(expLabel, 'experiences', sections.experiences.lodging.description)
    sections.experiences.activities.forEach(a => add(expLabel, 'experiences', `${a.name} ${a.description}`))
    sections.experiences.hikes.forEach(h => add(expLabel, 'experiences', `${h.name} ${h.distance} ${h.difficulty}`))
    sections.experiences.sights?.forEach(s => add(expLabel, 'experiences', `${s.name} ${s.description}`))
    sections.experiences.restaurants.forEach(r => add(expLabel, 'experiences', `${r.name} ${r.description}`))
  }

  if (sections.faqs.enabled) {
    sections.faqs.items.forEach(f => add('FAQs', 'faqs', `${f.question} ${f.answer}`))
  }

  return items
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  if (!event) return {}
  return {
    title: `${event.name} Race Day Guide | Vacation Races`,
    description: `Everything you need for the ${event.name} ${event.tagline} on ${event.dates}.`,
    ...(event.favicon && {
      icons: {
        icon: [{ url: event.favicon, type: 'image/png' }],
        apple: event.favicon,
      },
    }),
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  if (!event) notFound()

  const { sections } = event
  const searchIndex = buildSearchIndex(event)
  const theme: 'classic' | 'trailhead' = event.theme === 'trailhead' ? 'trailhead' : 'classic'

  const navItems = [
    sections.schedule.enabled             && { id: 'schedule',          label: 'Schedule' },
    sections.expo.enabled                 && { id: 'expo',              label: sections.expo.navLabel || 'Expo' },
    sections.camping?.enabled             && { id: 'camping',           label: 'Campground' },
    ...(sections.festival ?? [])
      .filter(f => f.enabled)
      .map(f => ({ id: f.id, label: f.navLabel })),
    sections.courseInfo.enabled           && { id: 'course-info',       label: sections.courseInfo.navLabel || 'Course Info' },
    sections.raceMorning.enabled          && { id: 'race-morning',      label: sections.raceMorning.navLabel || 'Race Morning' },
    sections.spectators.enabled           && { id: 'spectators',        label: 'Spectators' },
    sections.postRace.enabled             && { id: 'post-race',         label: sections.postRace.navLabel || 'Post-Race' },
    sections.challengeEvents?.enabled     && { id: 'challenge-events',  label: 'Challenge Events' },
    sections.experiences.enabled          && { id: 'experiences',       label: sections.experiences.navLabel || 'Experiences' },
    sections.faqs.enabled                 && { id: 'faqs',              label: 'FAQs' },
  ].filter(Boolean) as { id: string; label: string }[]

  const isTrail = theme === 'trailhead'

  return (
    <div data-theme={theme} data-brand={event.brand || undefined}>
      <AlertBanner alert={event.alert} slug={event.slug} />
      {/* Trailhead: nav sits above the hero. Classic: hero first, nav below. */}
      {isTrail && <StickyNav items={navItems} theme={theme} />}
      <HeroSection event={event} theme={theme} />
      {!isTrail && <StickyNav items={navItems} theme={theme} />}
      <main>
        {sections.welcome?.enabled        && <WelcomeSection     data={sections.welcome} theme={theme} />}
        {sections.schedule.enabled        && <ScheduleSection    data={sections.schedule} eventSlug={event.slug} theme={theme} />}
        {sections.expo.enabled            && <ExpoSection        data={sections.expo} theme={theme} />}
        {sections.camping?.enabled        && <CampingSection     data={sections.camping} theme={theme} />}
        {(sections.festival ?? []).map((f, i) => f.enabled && <FestivalSection key={f.id} data={f} index={i} theme={theme} />)}
        {isTrail && sections.courseInfo.enabled && <PhotoBand title="On the Course" image={event.photoBands?.onCourse} />}
        {sections.courseInfo.enabled      && <CourseInfoSection  data={sections.courseInfo} theme={theme} />}
        {isTrail && sections.raceMorning.enabled && <PhotoBand title="Race Morning" image={event.photoBands?.raceMorning} />}
        {sections.raceMorning.enabled     && <RaceMorningSection data={sections.raceMorning} theme={theme} />}
        {sections.spectators.enabled      && <SpectatorsSection  data={sections.spectators} theme={theme} />}
        {isTrail && sections.postRace.enabled && <PhotoBand title="Post Race" image={event.photoBands?.postRace} />}
        {sections.postRace.enabled        && <PostRaceSection    data={sections.postRace} theme={theme} />}
        {sections.challengeEvents?.enabled && <ChallengeEventsSection data={sections.challengeEvents!} theme={theme} />}
        {sections.experiences.enabled     && <ExperiencesSection data={sections.experiences} theme={theme} />}
        {sections.faqs.enabled            && <FAQSection         data={sections.faqs} theme={theme} />}
        {event.partners?.enabled          && <PartnersSection    data={event.partners} theme={theme} />}
      </main>
      <PrintButton />
      <PrintExpand />
      <SearchBar index={searchIndex} />
      {isTrail ? (
        <footer className="relative bg-vr-night overflow-hidden border-t border-vr-cream/10 px-6 md:px-12 py-20">
          {event.footerImage && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={event.footerImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.15] pointer-events-none" />
          )}
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="leading-[0.9] mb-1.5">
              <span className="font-accent text-vr-sky" style={{ fontSize: 'clamp(22px,2.6vw,34px)' }}>Chase the</span>
            </div>
            <h2 className="font-display uppercase leading-[0.9] text-vr-cream m-0 mb-9" style={{ fontSize: 'clamp(44px,7vw,104px)' }}>
              Extraordinary
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/vr-shield.png" alt="Vacation Races" className="h-10 w-auto mx-auto" />
            <p className="font-micro text-xs tracking-[0.12em] uppercase text-vr-cream/50 mt-4">
              © {new Date().getFullYear()} Vacation Races · Run wild · Run national parks
            </p>
          </div>
        </footer>
      ) : (
        <footer className="bg-vr-forest text-vr-cream py-12 px-6 text-center">
          <p className="font-micro text-sm tracking-widest uppercase opacity-60">
            © {new Date().getFullYear()} Vacation Races · All Rights Reserved
          </p>
        </footer>
      )}
    </div>
  )
}
