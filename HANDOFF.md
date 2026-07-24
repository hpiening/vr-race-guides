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
