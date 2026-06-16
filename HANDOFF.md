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

## Self-serve CMS (Decap) — `public/admin/`

The VR team edits guide **content** themselves via Decap CMS at
`https://guides.vacationraces.com/admin` (no code, no JSON). Editing flow:
form → Save (draft) → editorial review → publish → Netlify rebuild → live.

- `public/admin/config.yml` — the form definition (one collection: `events`).
- `public/admin/index.html` — loads Decap + a branded live-preview template.
- `VR-EDITOR-GUIDE.md` (repo root) — the one-page guide for VR editors.

**⚠️ CRITICAL maintenance rule — schema parity.** Decap **strips any field not
declared in `config.yml`** when an editor saves. `config.yml` must therefore cover
**every** field in `src/types/event.ts`. When you add/rename a field in `event.ts`,
update `config.yml` in the **same change**, or VR edits will silently delete data.
Design/identity fields VR must not touch (hero, colours, brand, logo, slug,
coordinates, embed URLs, `sectionBreaks`) are declared as `widget: hidden` — this
hides them from the UI while preserving their values on save.

Verify parity by walking each `content/events/*.json` and confirming every key is
either declared or nested under a `hidden` widget (all three guides pass as of this
writing).

Setup still required to go live for VR:
1. Enable **Netlify Identity** (invite-only) + **Git Gateway** on the Netlify site.
   ⚠️ If Identity isn't available, swap to **Sveltia CMS** (same `config.yml`, GitHub auth).
2. Invite VR users via Netlify Identity.
3. `create`/`delete` are currently `false` — VR edits existing guides only. Y11
   scaffolds new guides (hero art, brand assets, icons), then VR populates content.

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
