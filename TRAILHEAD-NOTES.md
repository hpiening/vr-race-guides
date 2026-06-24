# Trailhead design — implementation handback

Imported the **Trailhead** design (`RaceGuide-Trailhead.dc.html`, from the Claude Design
project) and applied it to the **Rocky Mountain** guide only. Grand Teton is visually
unchanged.

## How it's scoped (one component set, one guide restyled)

A new **`theme`** field drives everything:

- `src/types/event.ts` — added `theme?: 'classic' | 'trailhead'` to `EventData`. It's
  locked-by-design config (like `accentColor` / `heroBgColor`), **not** inline-editable
  content, so it has no `EditableText` wrapper.
- `content/events/rocky-mountain.json` — set `"theme": "trailhead"`. Grand Teton has no
  `theme`, so it falls back to `classic` and renders exactly as before (verified:
  `out/grand-teton` has `data-theme="classic"`, original footer, zero trailhead markup).
- `src/app/[slug]/page.tsx` — computes the theme, wraps the page in
  `<div data-theme={theme}>`, threads `theme` to every section, interleaves the photo
  bands, and switches the footer.

Each section component keeps its **existing classic render untouched** and gains a guard:

```tsx
if (theme === 'trailhead' && !editing) return <XTrailhead … />   // public view only
```

So the **inline editor at `/edit` always uses the classic render** (the edit page passes
no `theme`). The VR team edits in the exact same UI as before; only the public Rocky
Mountain page shows the new design. Every `EditableText` `path`, `ListControls`,
`AddButton`, `basePath`, and section `id` is preserved. Hero/Welcome use inline
`EditableText` in both themes (they degrade to text in view mode).

Shared Trailhead view pieces live in `src/components/trailhead/Shared.tsx`
(`TrailHeader`, `StatChips`, `Accordion`, `InfoCard`) — presentational only.

## Data-shape additions (all editable at /edit, per the contract)

To match the design file closely, these fields were added to `event.ts` + the JSON + the
editor wrappers, together:

1. **`theme`** on `EventData` — opt-in design switch (locked config, not editable content).
2. **`statTiles?: {value,label}[]`** on `CourseDistance` and `ChallengeEvent` — drives the
   big-number stat grids on the 5K / Half / Elk Double (e.g. `13.1 / Miles · Half`).
   Editable as compact value+label rows in the editor; falls back to the `stats` string
   chips when absent.
3. **`partners?: {enabled, items[]}`** on `EventData` — the "Our Partners" section. Seeded
   with the sponsor names from the brief; editable list (add/remove/reorder).
4. **`imageUrl?`** on `Hike` and on `experiences.lodging` — optional photo. When empty, a
   hatched **placeholder** renders (matching the mockup); paste a URL at /edit to show a
   real image. Placeholders are hidden in print.

## Notable decisions

- **Hero shield** added: `public/images/events/rocky-mountain-shield.png` (copied from your
  Assets "Combined Shield"). Has an `onError` fallback so a missing shield never breaks layout.
- **Photo placeholders are intentional stand-ins.** Hike cards + lodging show hatched
  "photo" boxes until real image URLs are added — they will look like comps on the live
  site until then. Same for the **photo bands** ("On the Course", etc.). All hidden in print.
- **Half-marathon section is now dark** (deep green) to match the design's "Course Info"
  treatment, even though your data folds half-course + parking into one `race-morning` section.
- **Test content removed** from `rocky-mountain.json`: the "NEW FAW 1" FAQ, the "…YES NOW"
  suffix, and the "Test Test" in the 5K spectator info.

## Contract checklist

- [x] `npx tsc --noEmit` passes; `npm run build` succeeds (static export, both guides SSG).
- [x] Public guide renders at `/rocky-mountain/` (Trailhead) **and** `/grand-teton/` (classic, unchanged).
- [x] `/edit` unchanged — classic render in edit mode, all paths/lists/Save intact.
- [x] Section `id`s unchanged (`schedule`, `expo`, `course-info`, `race-morning`, `spectators`, `post-race`, `challenge-events`, `experiences`, `faqs`).
- [x] RideWithGPS route iframes + Google `MapEmbed`s preserved (restyled containers only).
- [x] Print/PDF: `<details>` accordions force-open and photo bands/watermarks hide via `@media print` (scoped to `[data-theme='trailhead']`).
- [x] Static & light: no new runtime, no new deps; accordions are native `<details>` (work without JS). First-load JS unchanged (~110 kB).
- [x] Data shape: `theme`, `statTiles`, `partners`, and `imageUrl` added across event.ts +
      JSON + editor wrappers together (see "Data-shape additions" above).

## Files touched

`tailwind.config.ts`, `src/styles/globals.css`, `src/types/event.ts`,
`content/events/rocky-mountain.json`, `src/app/[slug]/page.tsx`,
`src/components/trailhead/Shared.tsx` (new), and the `theme` guard + Trailhead view in:
`HeroSection`, `StickyNav`, `WelcomeSection`, `ScheduleSection`, `ExpoSection`,
`CourseInfoSection`, `RaceMorningSection`, `SpectatorsSection`, `PostRaceSection`,
`ChallengeEventsSection`, `ExperiencesSection`, `FAQSection`.
