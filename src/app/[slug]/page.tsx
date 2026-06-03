import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { EventData } from '@/types/event'
import type { SearchItem } from '@/components/SearchBar'
import HeroSection from '@/components/HeroSection'
import StickyNav from '@/components/StickyNav'
import WelcomeSection from '@/components/WelcomeSection'
import ScheduleSection from '@/components/ScheduleSection'
import ExpoSection from '@/components/ExpoSection'
import RaceMorningSection from '@/components/RaceMorningSection'
import CourseInfoSection from '@/components/CourseInfoSection'
import SpectatorsSection from '@/components/SpectatorsSection'
import PostRaceSection from '@/components/PostRaceSection'
import ExperiencesSection from '@/components/ExperiencesSection'
import FAQSection from '@/components/FAQSection'
import WineFestivalSection from '@/components/WineFestivalSection'
import ChallengeEventsSection from '@/components/ChallengeEventsSection'
import PrintButton from '@/components/PrintButton'
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
    sections.expo.notes.forEach(n => add('Expo', 'expo', n))
    sections.expo.infoBlocks?.forEach(b => add('Expo', 'expo', `${b.heading} ${b.body}`))
    add('Expo', 'expo', `${sections.expo.locationName} ${sections.expo.date}`)
  }

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
    add('Experiences', 'experiences', sections.experiences.lodging.description)
    sections.experiences.activities.forEach(a => add('Experiences', 'experiences', `${a.name} ${a.description}`))
    sections.experiences.hikes.forEach(h => add('Experiences', 'experiences', `${h.name} ${h.distance} ${h.difficulty}`))
    sections.experiences.sights?.forEach(s => add('Experiences', 'experiences', `${s.name} ${s.description}`))
    sections.experiences.restaurants.forEach(r => add('Experiences', 'experiences', `${r.name} ${r.description}`))
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
    title: event.brand === 'n2s'
      ? `${event.name} | Race Day Guide`
      : `${event.name} Race Day Guide | Vacation Races`,
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

  const navItems = [
    sections.schedule.enabled             && { id: 'schedule',          label: 'Schedule' },
    sections.expo.enabled                 && { id: 'expo',              label: 'Expo' },
    sections.courseInfo.enabled           && { id: 'course-info',       label: sections.courseInfo.navLabel || 'Course Info' },
    sections.raceMorning.enabled          && { id: 'race-morning',      label: sections.raceMorning.navLabel || 'Race Morning' },
    sections.spectators.enabled           && { id: 'spectators',        label: 'Spectators' },
    sections.postRace.enabled             && { id: 'post-race',         label: 'Post-Race' },
    sections.wineFestival?.enabled        && { id: 'wine-festival',     label: 'Wine Festival' },
    sections.challengeEvents?.enabled     && { id: 'challenge-events',  label: 'Challenge Events' },
    sections.experiences.enabled          && { id: 'experiences',       label: 'Experiences' },
    sections.faqs.enabled                 && { id: 'faqs',              label: 'FAQs' },
  ].filter(Boolean) as { id: string; label: string }[]

  const brandClass = event.brand === 'n2s' ? 'brand-n2s' : ''

  return (
    <div className={brandClass}>
      <HeroSection event={event} />
      <StickyNav items={navItems} />
      <main>
        {sections.welcome?.enabled        && <WelcomeSection     data={sections.welcome} />}
        {sections.schedule.enabled        && <ScheduleSection    data={sections.schedule} eventSlug={event.slug} />}
        {sections.expo.enabled            && <ExpoSection        data={sections.expo} />}
        {sections.courseInfo.enabled      && <CourseInfoSection  data={sections.courseInfo} />}
        {sections.raceMorning.enabled     && <RaceMorningSection data={sections.raceMorning} />}
        {sections.spectators.enabled      && <SpectatorsSection  data={sections.spectators} eventSlug={event.slug} />}
        {sections.postRace.enabled        && <PostRaceSection    data={sections.postRace} />}
        {sections.wineFestival?.enabled   && <WineFestivalSection data={sections.wineFestival!} />}
        {sections.challengeEvents?.enabled && <ChallengeEventsSection data={sections.challengeEvents!} />}
        {sections.experiences.enabled     && <ExperiencesSection data={sections.experiences} eventSlug={event.slug} />}
        {sections.faqs.enabled            && <FAQSection         data={sections.faqs} />}
      </main>
      <PrintButton />
      <SearchBar index={searchIndex} />
      <footer className="bg-vr-forest text-vr-cream py-12 px-6 text-center">
        <p className="font-micro text-sm tracking-widest uppercase opacity-60">
          {event.brand === 'n2s'
            ? `© ${new Date().getFullYear()} Motiv Sports · Napa to Sonoma Wine Country Half Marathon & Rosé 5K`
            : `© ${new Date().getFullYear()} Vacation Races · All Rights Reserved`}
        </p>
      </footer>
    </div>
  )
}
