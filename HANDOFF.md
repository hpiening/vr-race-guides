# VR Race Day Guides — Project Handoff

**Date:** June 2026  
**Project owner:** Heather (hpiening@motivsports.co.uk)  
**Repo:** `hpiening/vr-race-guides` (GitHub)  
**Live site:** https://guides.vacationraces.com (Netlify; was vr-race-guides.netlify.app)  
**Local path:** `C:\Users\User\Documents\Claude\Projects\Vacation Races\vr-race-guides`

---

## What this is

A Next.js 14 static site that renders digital Race Day Guides for Vacation Races events. Each event is driven entirely by a JSON file — no code changes needed to add content. The site deploys automatically to Netlify on every `git push`.

---

## Stack

- **Next.js 14** — static export (`output: 'export'`, `images: { unoptimized: true }`)
- **Tailwind CSS** — custom VR brand config in `tailwind.config.ts`
- **TypeScript** — strict types in `src/types/event.ts`
- **Netlify** — auto-deploy from GitHub `main` branch

> **Important:** The build cannot run in the Linux sandbox (`.next` cache is Windows-only). Always deploy via `git push` — Netlify handles the build.

---

## Events

| File | Slug | Status |
|---|---|---|
| `content/events/grand-teton.json` | `grand-teton` | Live, complete |
| `content/events/rocky-mountain.json` | `rocky-mountain` | Live, complete |
| `content/events/great-smoky.json` | `great-smoky` | Live (`brand: smoky`) |
| `content/events/mount-rushmore.json` | `mount-rushmore` | Built 2026-07-24 (`brand: rushmore`), `hidden:true` until race-ready — pending RideWithGPS route + photos |
| `content/events/joshua-tree.json` | `joshua-tree` | Built 2026-09-22 (`brand: joshua-tree`), `hidden:true` pending sign-off — see the build note below |

Events with `"hidden": true` are excluded from the homepage index (`src/app/page.tsx` filters them).

---

## Architecture

### Content → Page flow

```
content/events/{slug}.json
  → src/app/[slug]/page.tsx   (reads JSON, builds nav + search index, renders sections)
  → src/components/*Section.tsx  (one component per section)
  → src/types/event.ts           (master TypeScript types for all event data)
```

### Section rendering

`page.tsx` renders sections conditionally based on `enabled` flags in the JSON:

```tsx
{sections.welcome?.enabled     && <WelcomeSection     data={sections.welcome} />}
{sections.schedule.enabled     && <ScheduleSection    data={sections.schedule} eventSlug={event.slug} />}
{sections.expo.enabled         && <ExpoSection        data={sections.expo} />}
{sections.camping?.enabled     && <CampingSection     data={sections.camping} />}
{(sections.festival ?? []).map((f, i) => f.enabled && <FestivalSection data={f} index={i} />)}
{sections.courseInfo.enabled   && <CourseInfoSection  data={sections.courseInfo} />}
{sections.raceMorning.enabled  && <RaceMorningSection data={sections.raceMorning} />}
{sections.spectators.enabled   && <SpectatorsSection  data={sections.spectators} />}
{sections.postRace.enabled     && <PostRaceSection    data={sections.postRace} />}
{sections.challengeEvents?.enabled && <ChallengeEventsSection ... />}
{sections.experiences.enabled  && <ExperiencesSection data={sections.experiences} />}
{sections.faqs.enabled         && <FAQSection         data={sections.faqs} />}
```

### Section background alternation

Controlled by the `dark` prop on `SectionWrapper`. Rocky Mountain sequence:

| Section | Background |
|---|---|
| Welcome | Light (`bg-vr-white`) |
| Schedule | **Dark + pine tree watermark** |
| Expo | Light |
| 5K Info (courseInfo) | **Dark** |
| Half Marathon Info (raceMorning) | Light |
| Spectators | **Dark** |
| Post-Race | Light |
| Challenge Events | **Dark** |
| Experiences | Light |
| FAQs | **Dark** |

**The pine tree watermark only exists in `ScheduleSection.tsx`.** All other dark sections use plain `bg-vr-forest` via `SectionWrapper dark`. Do not add the tree watermark to other sections.

---

## Custom fonts

Defined in `tailwind.config.ts` and loaded via `@font-face` in `src/styles/globals.css`:

| Class | Font | Use |
|---|---|---|
| `font-display` | Scale Condensed | Hero h1, section headings |
| `font-heading` | Scale Bold | Sub-headings, card titles |
| `font-body` | Forma DJR Text | Body copy |
| `font-micro` | Forma DJR Micro | Labels, timestamps, eyebrows |
| `font-label` | Forma DJR Text | Buttons, CTAs |
| `font-accent` | Fraunces 72pt | Blockquotes (John Muir quote etc.) |

---

## Brand colors (Tailwind custom palette)

| Token | Usage |
|---|---|
| `vr-forest` | Primary dark green — nav, dark sections, buttons |
| `vr-cream` | Off-white text on dark backgrounds |
| `vr-white` | Light section background |
| `vr-offwhite` | Card backgrounds on light sections |
| `vr-floral` | Accent color (chevrons, FAQ + icon) |
| `vr-mid` | Mid-tone body text on light sections |
| `vr-sandstone` | Secondary accent |

---

## Key components

### `SectionWrapper.tsx`
Wraps every section. `dark` prop switches between `bg-vr-forest text-vr-cream` and `bg-vr-white text-vr-forest`. Renders the `font-micro` eyebrow label.

### `ScheduleSection.tsx`
The only component with the pine tree watermark (opacity-[0.06] background image). Requires `eventSlug` prop to load the correct icon from `public/images/events/{slug}-icon.png`.

### `HeroSection.tsx`
Supports `heroImage` (PNG overlay/cutout), `heroBgColor` (solid hex background), and `heroOverlayImage`. Rocky Mountain uses a Wix STAT cutout PNG + `#1B3A24` background color.

### `SearchBar.tsx`
Client component. Takes a pre-built `SearchItem[]` index from `page.tsx` (server-side), so no DOM parsing. Floating button fixed bottom-right. Opens on click or `Cmd/Ctrl+K`.

### `PrintButton.tsx`
Client component. Fixed bottom-right (above search). Calls `window.print()`. Print CSS in `globals.css` hides nav/buttons/iframes and reveals all FAQ answers.

### `CourseInfoSection.tsx`
Renders 5K Info. Supports `navLabel`, custom `schedule` timeline cards, RideWithGPS iframe embed, and `infoBlocks`.

### `RaceMorningSection.tsx`
Renders Half Marathon Info. Supports `navLabel`, `parkingMapImageUrl`, RideWithGPS iframe embed, and `infoBlocks`. Course maps appear at the top (before the morning schedule).

### `FestivalSection.tsx` — repeatable, for multi-day festival events
Driven by an **optional array**, `sections.festival[]`. Each entry renders its own
`<section>` between Camping and On-the-Course, with its own sticky-nav entry and
search entries. Guides without a `festival` array are completely unaffected.

Built for Grand Circle Trailfest, whose Basecamp / Meals & Dining / Performers content
has no home in the single-race section set. Each entry is
`{enabled, id, navLabel, eyebrow?, heading, intro?, tone?, imageUrl?, groups[], infoBlocks[]}`:

- `tone` — `'light'` (default paper), `'dark'`, or `'darkest'`, so consecutive festival
  sections can alternate grounds like the rest of the page.
- `groups[]` — titled card groups, each `{heading, intro?, layout?, cards[]}`. Three layouts:
  `cards` (text cards, default), `photos` (image-topped cards), `rows` (compact
  eyebrow-left / title+body-right lines — used for meal times and the IV price list).
- `cards[]` — `{eyebrow?, title, body?, meta?, imageUrl?, url?}`. `meta` is the
  right-aligned trailing value on `rows` (e.g. a price).
- `infoBlocks[]` — accordions at the foot of the section, as elsewhere.

Fully editable in `/edit` (add/remove/reorder groups and cards, upload card photos).

### Per-course accordions — `CourseDistance.infoBlocks`
`courseInfo.distances[]` entries take an optional `infoBlocks[]`, rendered as accordions
under that course's card. For multi-course events where each route has its own logistics
(Grand Circle: Course Details / Aid Station & Cutoff / Getting There per day). Absent =
the course card renders exactly as before.

---

## Adding a new event

1. Create `content/events/{slug}.json` — copy `rocky-mountain.json` as a template
2. Add icon image: `public/images/events/{slug}-icon.png` (used as Schedule watermark)
3. Add favicon: `public/images/events/{slug}-favicon.png`
4. Set `"hidden": false` when ready to show on homepage
5. `git add . && git commit -m "Add {event name}" && git push`

To add optional sections (`challengeEvents`, `welcome`), check `src/types/event.ts` for the full type definitions.

---

## Self-serve inline editor — `/edit`

VR edits guide content **on the real page** at `https://guides.vacationraces.com/edit`
(`/edit/?slug=<slug>`). Flow: sign in (Netlify Identity, email invite) → click text /
manage lists → **Save & publish** → commit to GitHub via Git Gateway → Netlify rebuild
→ live in ~1–2 min. No GitHub accounts needed for editors. (The old Decap CMS at
`/admin` was retired; `netlify.toml` 301-redirects `/admin/*` → `/edit/`.)

### How it works
- `src/lib/gitGateway.ts` — reads/commits a guide's JSON via Git Gateway using the
  editor's Identity JWT (relative `/.netlify/git/...`, so it's domain-agnostic). Handles
  the 409 conflict (someone else committed) with a clear "reload" error.
- `src/lib/editContext.tsx` — controlled `EditProvider`; `value`/`setValue`/`setValues`
  (atomic multi-field) + list `add`/`remove`/`move` by dotted path.
- `src/components/edit/` — `EditableText` (inline auto-grow field), `ListControls`,
  `AddButton`, `EditableUrl`, `RideWithGpsField` (paste a route link → rebuilds embed).
- `src/app/edit/page.tsx` — login gate, guide picker, Save bar, renders every section
  inside the provider.
- `src/components/NetlifyIdentityRedirect.tsx` — loads the Identity widget site-wide so
  invite links (`/#invite_token=…`) work; sends fresh logins to `/edit`.

### Key property — public pages are unaffected
Each section component takes an optional `basePath` and wraps editable text in
`<EditableText>`. **Outside an `EditProvider` (i.e. on the public guide pages),
`useEditOptional()` returns null and everything renders as plain read-only text.** So
editing support adds zero behaviour to the live guides.

**⚠️ Maintenance rule:** when you add a field to `src/types/event.ts` and want VR to edit
it, wrap it in `<EditableText path="…">` (and add list controls if it's a list) in the
relevant section, using a path relative to the section's `basePath`. Locked-by-design
fields (hero image, slug, brand) simply have no editable wrapper.

### Setup state
Netlify Identity (invite-only) + Git Gateway are enabled. Editors are invited via the
Netlify **Identity** tab. New guides are scaffolded by Y11 (hero art, brand assets,
icons), then VR fills in content via `/edit`.

## RideWithGPS embeds

Embed URLs follow this pattern:
```
https://ridewithgps.com/embeds?type=route&id={ROUTE_ID}&metricUnits=true&sampleGraph=true
```

Rocky Mountain routes:
- Half Marathon: route `46375145`
- 5K: route `51714103`

The iframe has `className="print:hidden"` and a print fallback link is shown beneath it.

---

## Deploy

```bash
cd "C:\Users\User\Documents\Claude\Projects\Vacation Races\vr-race-guides"
git add .
git commit -m "Your message"
git push
```

Netlify auto-builds. Check build status at: https://app.netlify.com

---

## Joshua Tree Half Marathon — built 2026-09-22

Sat **7 November 2026**, 6:00 PM PT start, 13.1 mi, 4-hour cutoff. Start/finish/expo all at the
**RESET Hotel**, Twentynine Palms — a new venue *and* an entirely new course for 2026. It is a
night race, so the guide leads on the mandatory personal-light requirement.

Built from the Claude Design bundle in `…\Vacation Races\Joshua Tree\Joshua Tree Guide\`.
**The `.dc.html` comp was the content spec** — its copy was already written from the 2025 guide
plus the 2026 changes brief, with its own "to confirm" flags. Copy was carried across verbatim.
Shipped `hidden:true`. ⚠️ `hidden` only removes a guide from the homepage listing — the page is
still publicly served and indexable.

### New engine capability: positionable Festival sections

The comp needs five blocks at seams the fixed section order does not offer. Rather than make the
shared components brand-conditional, `FestivalSectionData` gained two optional fields:

- **`slot`** — which seam the section renders at (`welcome` · `schedule` · `expo` · `course-info` ·
  `race-morning` · `spectators` · `post-race` · `experiences`; each means *immediately after that
  section*). **Absent = `'expo'`**, which is where every festival section already rendered, so
  existing guides are untouched.
- **`hideFromNav`** — keep a section out of the sticky nav, for blocks the design deliberately
  leaves out of the nav strip.

Nav order and render order are both derived from `slot` in `[slug]/page.tsx`, so they cannot drift,
and `edit/page.tsx` mirrors it via `editFestivals()`.

Joshua Tree's seven festival sections: `mandatory-light` (welcome) · `reset-hotel` (schedule) ·
`activities` (expo) · `records` (course-info) · `parking` (course-info) · `packing` (spectators) ·
`zero-waste` (post-race). `records` and `zero-waste` are `hideFromNav`, matching the comp's nav.

### Four more additive engine fields (defaults preserve current behaviour)

| Field | Why |
|---|---|
| `schedule.eyebrow` | hardcoded "Race weekend"; the comp says "Race day" (one-day race) |
| `courseInfo.eyebrow` | hardcoded, and *suppressed* when the heading says "course" — so "Brand new for 2026" could not be set |
| `courseInfo.scheduleHeading` | the schedule card grid had no heading; JT uses it for "Terrain, Mile by Mile" |
| — | **`MapEmbed` now hides the map when `lat`/`lng` are unset.** It previously rendered a marker at 0,0 — a blank map of the Gulf of Guinea. Latent for any guide with no venue pin; JT is currently the only one. The Google Maps button still works (it uses the address URL). |

### Brand

Scoped `[data-brand='joshua-tree']` in `globals.css` — plum-black `#0E0617` / mid plum `#2A1436` /
ink `#2B1430` / accent lilac `#B98FD0` on paper `#F7EFE2`. Values are the handoff's token table,
confirmed by sampling the shield (`#3A1445`, `#F4E2CC`, `#D1B6D7` are its dominant colours).
`--tl-hero-scrim` and `--tl-row-highlight` were retinted too — both default to literal Rocky
Mountain green/teal and make a new brand look subtly wrong if left.

Assets: `joshua-tree-shield.png` (900×900, 49 KB), `-icon.png` (the watermark — a Joshua tree
silhouette extracted from the shield, 58 KB), `-favicon.png` (96×96, fitted not squashed).

### Deviations from the comp — deliberate, do not "correct" them back

- **Hero meta** is one line (`date · distance · start`); the comp has three items including the
  venue. The engine has a single `dates` field, and the full four-fact string wrapped and orphaned
  the diamond bullet. The venue has its own nav item, section, expo block and FAQ.
- **Terrain table** renders as the course section's card grid, not a `<table>`. It stays visible
  rather than being buried in an accordion, which matters on a sandy night course.
- **Parking** is a festival section, not `raceMorning` (disabled). `raceMorning` has no intro slot
  for the "plan not final" warning the comp leads with, and it folds heading and nav label into one
  field — the comp wants "Parking & Shuttles" / "Parking".
- **Course records** sit in their own section after the course (comp), so `postRace.courseRecords`
  is deliberately `[]`.
- Light-type mosaic renders 3-up + 1, not the comp's 2×2 (engine grid).
- The comp's post-race tag pills (Finisher medal / FinisherPix / Live results / iTab / #JTHalf) have
  no engine slot and were dropped.
- Spectators eyebrow reads "For"; the comp has "Cheer zone &". Still hardcoded.

### Open — 7 `[CONFIRM]` markers on the page, plus

1. **RideWithGPS route** — `distances[0].embedUrl` is empty *on purpose*. The interim route
   (`ridewithgps.com/routes/53736539`) does **not** finish back at RESET and must be regenerated.
   Paste the new URL in `/edit` and both the embed and the printed map rebuild themselves.
2. **Parking plan, map and shuttles** — not final; the section holds space for them.
3. **Awards timing conflict** — the 2025 guide says overall/Masters on **gun time**; the event
   website says chip time with a first-wave requirement. The guide uses gun time and flags the
   conflict inline, as the design did. **Operations to settle before publication.**
4. **Vendor names** — margarita truck, face painter, DJ Gravity One 2026 booking, full vendor list,
   contest-linked merch, final partner list.
5. **Stargazing at RESET** — times/booking/meeting point with the hotel.
6. **Venue coordinates** — `expo.locationLat/Lng` are `0`, so no map renders. Set them and it
   appears. Not invented.
7. **Photography** — every image is an empty slot: hero, RESET, both photo bands, lodging, six
   Explore cards, the mandatory-light artwork, parking map. RESET photos are in a client Dropbox
   folder (link in the changes brief); race photography from VR. All uploadable from `/edit`.

### Verified

`tsc` + `next build` clean. Rendered and read the whole page at 1440px: nav matches the comp's list
exactly, section order matches, 0 broken images, no raw markdown leaking, no horizontal overflow,
fonts load with no errors, and exactly one tinted schedule row (the 6:00 PM start — the engine
auto-highlights any label containing "start", which would also have caught two other rows, so
`highlight` is set explicitly). Print PDF renders 29 pages with every accordion body forced open.
**The other five guides were rebuilt from a clean tree and their rendered markup is byte-identical**
— the only difference anywhere is seven empty arrays in React's serialised payload, one per new slot.

Not verified: mobile below ~500px (Chrome enforces a ~500 CSS px minimum window here), and no
live-site check — this has not been pushed.
---

## Known issues / backlog

- **Sights grid orphan**: Rocky Mountain has 5 sights in a `sm:grid-cols-2` layout, so the last card sits alone at half-width. Fix: switch to `sm:grid-cols-3` for 5-item sets, or pad to 6 items.
- **Background images for sections**: Heather mentioned sharing background photos to use behind dark sections (similar to hero image treatment with color overlay). Not yet implemented — waiting on image assets.
- `SectionBreak.tsx` component exists but is not used — can be deleted or kept for future use.

---

## Project files location

```
C:\Users\User\Documents\Claude\Projects\Vacation Races\
├── vr-race-guides\           ← Next.js project (this repo)
│   ├── content\events\       ← JSON event data
│   ├── public\images\events\ ← Icons, favicons, map images
│   ├── src\
│   │   ├── app\              ← Next.js app router
│   │   ├── components\       ← All section components
│   │   ├── styles\           ← globals.css (fonts, print styles)
│   │   └── types\event.ts    ← Master TypeScript types
│   └── tailwind.config.ts    ← Brand colors + font utilities
└── Rocky Mountain\           ← Source brief and assets (PDFs, logos)
```
