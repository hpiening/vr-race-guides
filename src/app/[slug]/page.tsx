import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { EventData } from '@/types/event'
import HeroSection from '@/components/HeroSection'
import StickyNav from '@/components/StickyNav'
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  if (!event) return {}
  return {
    title: event.brand === 'n2s'
      ? `${event.name} | Race Day Guide`
      : `${event.name} Race Day Guide | Vacation Races`,
    description: `Everything you need for the ${event.name} ${event.tagline} on ${event.dates}.`,
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)
  if (!event) notFound()

  const { sections } = event

  const navItems = [
    sections.schedule.enabled             && { id: 'schedule',          label: 'Schedule' },
    sections.expo.enabled                 && { id: 'expo',              label: 'Expo' },
    sections.courseInfo.enabled           && { id: 'course-info',       label: sections.courseInfo.navLabel || 'Course Info' },
    sections.raceMorning.enabled          && { id: 'race-morning',      label: 'Race Morning' },
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
        {sections.schedule.enabled    && <ScheduleSection    data={sections.schedule} eventSlug={event.slug} />}
        {sections.expo.enabled        && <ExpoSection        data={sections.expo} />}
        {sections.courseInfo.enabled  && <CourseInfoSection  data={sections.courseInfo} />}
        {sections.raceMorning.enabled && <RaceMorningSection data={sections.raceMorning} />}
        {sections.spectators.enabled  && <SpectatorsSection  data={sections.spectators} />}
        {sections.postRace.enabled           && <PostRaceSection    data={sections.postRace} />}
        {sections.wineFestival?.enabled      && <WineFestivalSection data={sections.wineFestival!} />}
        {sections.challengeEvents?.enabled   && <ChallengeEventsSection data={sections.challengeEvents!} />}
        {sections.experiences.enabled        && <ExperiencesSection data={sections.experiences} />}
        {sections.faqs.enabled        && <FAQSection         data={sections.faqs} />}
      </main>
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
