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

## Notable decisions (please review)

1. **No data-shape changes beyond `theme`.** The 5K/Half "stat tiles" render by
   presentationally splitting the existing `distances[].stats` string on `·` (see
   `StatChips`). The editor still edits one string. If you want the big number-over-label
   tiles from the mockup, that needs a small structured field — happy to add it.
2. **Hero image stays data/locked.** The mockup showed a separate event "shield" PNG
   (`rocky-mountain-shield.png`) that isn't in the repo, so I did **not** add a broken
   reference. The Trailhead hero uses the existing `heroImage` + the radial-gradient
   treatment + inset frame + the existing `events/rocky-mountain-icon.png` watermark.
   Drop a shield into `public/images/events/` later if you want it.
3. **Photo bands** ("On the Course", "Race Morning", "Post Race") are decorative titled
   bands (textured, no real photos were provided) and are **hidden in print**. They can be
   backed by real images later.
4. **Partners logo grid — NOT implemented.** The mockup ends with an "Our Partners" logo
   wall. There's no partners field in the data model and no logo assets in the repo, so
   adding it would be a data-shape change + asset drop. Flagged as an easy follow-up if you
   want it (new `partners` array + logo files).
5. **Content untouched.** Existing copy — including in-progress VR test strings like
   "NEW FAW 1" / "YES NOW" in the JSON — was left as-is (out of scope for a design pass).

## Contract checklist

- [x] `npx tsc --noEmit` passes; `npm run build` succeeds (static export, both guides SSG).
- [x] Public guide renders at `/rocky-mountain/` (Trailhead) **and** `/grand-teton/` (classic, unchanged).
- [x] `/edit` unchanged — classic render in edit mode, all paths/lists/Save intact.
- [x] Section `id`s unchanged (`schedule`, `expo`, `course-info`, `race-morning`, `spectators`, `post-race`, `challenge-events`, `experiences`, `faqs`).
- [x] RideWithGPS route iframes + Google `MapEmbed`s preserved (restyled containers only).
- [x] Print/PDF: `<details>` accordions force-open and photo bands/watermarks hide via `@media print` (scoped to `[data-theme='trailhead']`).
- [x] Static & light: no new runtime, no new deps; accordions are native `<details>` (work without JS). First-load JS unchanged (~110 kB).
- [x] Data shape: only `theme` added (event.ts + JSON); no editable-content fields changed.

## Files touched

`tailwind.config.ts`, `src/styles/globals.css`, `src/types/event.ts`,
`content/events/rocky-mountain.json`, `src/app/[slug]/page.tsx`,
`src/components/trailhead/Shared.tsx` (new), and the `theme` guard + Trailhead view in:
`HeroSection`, `StickyNav`, `WelcomeSection`, `ScheduleSection`, `ExpoSection`,
`CourseInfoSection`, `RaceMorningSection`, `SpectatorsSection`, `PostRaceSection`,
`ChallengeEventsSection`, `ExperiencesSection`, `FAQSection`.
