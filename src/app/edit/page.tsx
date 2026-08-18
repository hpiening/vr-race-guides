'use client'
import { useEffect, useState, useCallback } from 'react'
import { EventData } from '@/types/event'
import { EditProvider } from '@/lib/editContext'
import FormatToolbar from '@/components/edit/FormatToolbar'
import { getIdentity, readJson, commitJson } from '@/lib/gitGateway'
import HeroSection from '@/components/HeroSection'
import AlertBanner from '@/components/AlertBanner'
import PhotoBand from '@/components/PhotoBand'
import WelcomeSection from '@/components/WelcomeSection'
import ScheduleSection from '@/components/ScheduleSection'
import ExpoSection from '@/components/ExpoSection'
import CampingSection from '@/components/CampingSection'
import FestivalSection from '@/components/FestivalSection'
import CourseInfoSection from '@/components/CourseInfoSection'
import RaceMorningSection from '@/components/RaceMorningSection'
import SpectatorsSection from '@/components/SpectatorsSection'
import PostRaceSection from '@/components/PostRaceSection'
import ChallengeEventsSection from '@/components/ChallengeEventsSection'
import ExperiencesSection from '@/components/ExperiencesSection'
import FAQSection from '@/components/FAQSection'
import PartnersSection from '@/components/PartnersSection'

// Guides VR can edit. Y11 scaffolds new guides; add the slug + name here.
const GUIDES = [
  { slug: 'rocky-mountain', name: 'Rocky Mountain' },
  { slug: 'great-smoky', name: 'Great Smoky' },
  { slug: 'mount-rushmore', name: 'Mount Rushmore' },
  { slug: 'grand-teton', name: 'Grand Teton' },
  { slug: 'grand-circle', name: 'Grand Circle Trailfest' },
]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function EditPage() {
  // undefined = still checking, null = logged out, object = logged in
  const [user, setUser] = useState<{ email?: string } | null | undefined>(undefined)
  const [slug, setSlug] = useState<string | null>(null)
  const [data, setData] = useState<EventData | null>(null)
  const [sha, setSha] = useState('')
  const [loadErr, setLoadErr] = useState('')
  const [dirty, setDirty] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveErr, setSaveErr] = useState('')

  // ── Netlify Identity ──────────────────────────────────────────────────
  // The widget script is loaded site-wide and may not be ready (or finished
  // initialising) the instant this page mounts, so poll for it, then resolve
  // the session via the init event, currentUser(), and a fallback read.
  useEffect(() => {
    let cancelled = false
    let fallback: ReturnType<typeof setTimeout>

    const attach = (id: NonNullable<ReturnType<typeof getIdentity>>) => {
      const refresh = () => { if (!cancelled) setUser(id.currentUser() ?? null) }
      id.on('init', (u?: unknown) => { if (!cancelled) setUser((u as { email?: string }) ?? null) })
      id.on('login', () => { refresh(); id.close() })
      id.on('logout', () => { if (!cancelled) setUser(null) })
      // If init already fired before we attached, currentUser() is reliable;
      // resolve the logged-out-already-initialised case after a short settle.
      if (id.currentUser()) refresh()
      else fallback = setTimeout(refresh, 1200)
    }

    const existing = getIdentity()
    if (existing) { attach(existing); return () => { cancelled = true; clearTimeout(fallback) } }

    let tries = 0
    const poll = setInterval(() => {
      const id = getIdentity()
      if (id) { clearInterval(poll); attach(id) }
      else if (++tries > 40) { clearInterval(poll); if (!cancelled) setUser(null) }
    }, 250)
    return () => { cancelled = true; clearInterval(poll); clearTimeout(fallback) }
  }, [])

  // ── read ?slug= ───────────────────────────────────────────────────────
  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get('slug'))
  }, [])

  // ── load the guide once logged in + slug known ──────────────────────────
  useEffect(() => {
    if (!user || !slug) return
    setData(null); setLoadErr(''); setDirty(false)
    readJson<EventData>(`content/events/${slug}.json`)
      .then(({ data, sha }) => { setData(data); setSha(sha) })
      .catch(e => setLoadErr(e.message))
  }, [user, slug])

  const save = useCallback(async () => {
    if (!data || !slug) return
    setSaveState('saving'); setSaveErr('')
    try {
      const { sha: newSha } = await commitJson(
        `content/events/${slug}.json`, data, sha, `Edit ${slug} race guide (inline editor)`,
      )
      setSha(newSha); setDirty(false); setSaveState('saved')
      setTimeout(() => setSaveState(s => (s === 'saved' ? 'idle' : s)), 3000)
    } catch (e) {
      setSaveState('error'); setSaveErr(e instanceof Error ? e.message : 'Save failed')
    }
  }, [data, slug, sha])

  // ── render states ────────────────────────────────────────────────────
  if (user === undefined) return <Centered>Checking sign-in…</Centered>

  if (user === null) {
    return (
      <Centered>
        <p className="mb-4 font-body text-vr-mid">Please sign in to edit race guides.</p>
        <button onClick={() => getIdentity()?.open('login')} className="btn-primary">Sign in</button>
      </Centered>
    )
  }

  if (!slug) {
    return (
      <Centered>
        <h1 className="font-display text-3xl uppercase text-vr-forest mb-6">Choose a guide to edit</h1>
        <div className="flex flex-col gap-2">
          {GUIDES.map(g => (
            <a key={g.slug} href={`/edit/?slug=${g.slug}`} className="btn-primary">{g.name}</a>
          ))}
        </div>
      </Centered>
    )
  }

  if (loadErr) return <Centered><p className="text-red-600 font-body">Couldn’t load this guide: {loadErr}</p></Centered>
  if (!data) return <Centered>Loading {slug}…</Centered>

  const theme: 'classic' | 'trailhead' = data.theme === 'trailhead' ? 'trailhead' : 'classic'

  return (
    <div className="pt-14">
      {/* Save bar */}
      <div className="fixed top-0 inset-x-0 z-50 h-14 bg-vr-forest text-vr-cream flex items-center justify-between px-4 md:px-6 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <a href={`/${slug}/`} className="font-micro text-xs tracking-widest uppercase opacity-70 hover:opacity-100">← Exit</a>
          <span className="font-heading uppercase truncate">{data.name}</span>
          {dirty && <span className="font-micro text-[10px] tracking-widest uppercase text-vr-floral">Unsaved</span>}
        </div>
        <div className="flex items-center gap-4">
          {saveState === 'saved' && <span className="font-micro text-xs tracking-widest uppercase text-green-300">Saved ✓</span>}
          {saveState === 'error' && <span className="font-micro text-xs tracking-widest uppercase text-red-300" title={saveErr}>Error</span>}
          <button
            onClick={save}
            disabled={saveState === 'saving' || !dirty}
            className="font-label text-xs tracking-[0.15em] uppercase bg-vr-floral text-vr-forest px-5 py-2 rounded-full disabled:opacity-40"
          >
            {saveState === 'saving' ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </div>

      {saveState === 'error' && (
        <p className="bg-red-50 text-red-700 text-sm px-6 py-2 font-body">{saveErr}</p>
      )}

      <FormatToolbar />
      <EditProvider data={data} editing onChange={next => { setData(next); setDirty(true) }}>
        <div data-theme={theme} data-brand={data.brand || undefined}>
        <AlertBanner alert={data.alert} slug={slug} />
        <HeroSection event={data} theme={theme} />
        {data.sections.welcome && <WelcomeSection data={data.sections.welcome} basePath="sections.welcome" theme={theme} />}
        {data.sections.schedule && <ScheduleSection data={data.sections.schedule} eventSlug={slug} basePath="sections.schedule" theme={theme} />}
        {data.sections.expo && <ExpoSection data={data.sections.expo} basePath="sections.expo" theme={theme} />}
        {data.sections.camping && <CampingSection data={data.sections.camping} basePath="sections.camping" theme={theme} />}
        {(data.sections.festival ?? []).map((f, i) => <FestivalSection key={f.id || i} data={f} index={i} theme={theme} />)}
        {theme === 'trailhead' && data.sections.courseInfo && <PhotoBand title="On the Course" image={data.photoBands?.onCourse} imagePath="photoBands.onCourse" />}
        {data.sections.courseInfo && <CourseInfoSection data={data.sections.courseInfo} basePath="sections.courseInfo" theme={theme} />}
        {theme === 'trailhead' && data.sections.raceMorning && <PhotoBand title="Race Morning" image={data.photoBands?.raceMorning} imagePath="photoBands.raceMorning" />}
        {data.sections.raceMorning && <RaceMorningSection data={data.sections.raceMorning} basePath="sections.raceMorning" theme={theme} />}
        {data.sections.spectators && <SpectatorsSection data={data.sections.spectators} basePath="sections.spectators" theme={theme} />}
        {theme === 'trailhead' && data.sections.postRace && <PhotoBand title="Post Race" image={data.photoBands?.postRace} imagePath="photoBands.postRace" />}
        {data.sections.postRace && <PostRaceSection data={data.sections.postRace} basePath="sections.postRace" theme={theme} />}
        {data.sections.challengeEvents && <ChallengeEventsSection data={data.sections.challengeEvents} basePath="sections.challengeEvents" theme={theme} />}
        {data.sections.experiences && <ExperiencesSection data={data.sections.experiences} basePath="sections.experiences" theme={theme} />}
        {data.sections.faqs && <FAQSection data={data.sections.faqs} basePath="sections.faqs" theme={theme} />}
        {data.partners && <PartnersSection data={data.partners} basePath="partners" theme={theme} />}
        </div>
      </EditProvider>

      <div className="bg-vr-offwhite text-center py-10 px-6">
        <p className="font-body text-sm text-vr-mid max-w-lg mx-auto">
          Inline editor. Click any highlighted text to edit; use ↑ ↓ ✕ and “+ Add” to manage lists.
          Maps, route embeds and the hero image are locked by design. Changes go live ~1–2 minutes after you Save.
        </p>
      </div>
    </div>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-vr-white">
      {children}
    </div>
  )
}
