# Creating a new Race Day Guide

This is the playbook for standing up a guide for a new event (e.g. next season's
races). The hard work is done — **a guide is one JSON file + a few images**. No new
code is required for a standard guide.

> TL;DR: copy `content/events/rocky-mountain.json`, rename it `<slug>.json`, fill it in
> (ideally from the VR team's completed **Race Guide Content Template.docx**), drop in a
> handful of images, add the slug to the `/edit` list, `npm run build`, push. Done.

---

## 1. What a guide is

A statically-exported Next.js site. Each guide is driven **entirely by one JSON file** in
`content/events/`. The URL is the file name: `content/events/grand-teton.json` →
`/grand-teton`. The page assembles a fixed set of sections from that JSON; there is no
per-guide code.

Two visual themes exist (set by the `theme` field):
- **`trailhead`** — the elevated design (gradient hero, dark course sections, stat tiles,
  accordions, photo bands, partners wall). Use this for new guides.
- **`classic`** — the original design. Absent `theme` = classic.

The same components render both the public page **and** the inline editor at `/edit`.

---

## 2. Quick start — a new guide in ~6 steps

1. **Copy an existing guide as your starting point:**
   ```bash
   cp content/events/rocky-mountain.json content/events/<slug>.json
   ```
   Use a URL-friendly slug, e.g. `zion`, `great-smoky`, `mount-rainier`.

2. **Fill in the content.** Either edit the JSON directly, or — recommended — have the VR
   team complete **Race Guide Content Template.docx** and transcribe their answers into the
   JSON (the template's sections map 1:1 to the JSON; see the field reference in §4).
   Set `"slug"` to match the file name and `"theme": "trailhead"`.

3. **Add images** to `public/images/events/` (see the asset checklist, §5):
   - `<slug>-icon.png` — faint watermark mark (required for the look)
   - `<slug>-favicon.png` — browser tab icon
   - `<slug>-shield.png` — hero badge top-right (optional; falls back gracefully)
   - Hero photo — either a URL in `heroImage`, or a local file you reference.

4. **Register the guide in the editor list** so the VR team can edit it. In
   `src/app/edit/page.tsx`, add to the `GUIDES` array:
   ```ts
   const GUIDES = [
     { slug: 'rocky-mountain', name: 'Rocky Mountain' },
     { slug: '<slug>', name: '<Event Name>' },   // ← add this
   ]
   ```

5. **Preview locally:**
   ```bash
   npm run dev
   #   public: http://localhost:3000/<slug>
   #   editor: http://localhost:3000/edit/?slug=<slug>
   npx tsc --noEmit   # typecheck
   npm run build      # must pass (static export)
   ```

6. **Deploy:** commit and `git push origin main`. Netlify builds and publishes to
   guides.vacationraces.com automatically (~1–2 min).

That's it. A standard guide needs **no `.tsx` changes** beyond step 4.

---

## 3. Turning off / hiding sections

Every section has an `"enabled": true|false`. Set `false` to drop a section entirely
(it also disappears from the sticky nav and search). `welcome`, `challengeEvents`, and
`partners` are optional blocks — omit them or set `enabled: false` if an event doesn't
have them.

Section `id`s are fixed and power the nav + search — **do not rename them**:
`schedule`, `expo`, `course-info`, `race-morning`, `spectators`, `post-race`,
`challenge-events`, `experiences`, `faqs`.

---

## 4. Content model — full field reference

Types live in `src/types/event.ts`. Everything below is editable at `/edit` unless marked
**(locked)**. This is the bridge between the Word template and the JSON.

### Top level
| Field | Notes |
|---|---|
| `slug` **(locked)** | Must equal the file name; the URL. |
| `theme` **(locked)** | `"trailhead"` for the new design. |
| `name`, `tagline`, `dates` | Hero title, sub-line, date line. |
| `heroImage`, `heroImageAlt` **(locked image)** | Hero background photo (URL or `/images/...`). |
| `heroBgColor`, `accentColor` **(locked)** | Fallback/brand colors. |
| `favicon`, `logo`, `logoAlt` | Tab icon + nav logo. |
| `partners` | `{ enabled, items: [{ name, logoUrl? }] }` — the "Our Partners" wall. Provide a `logoUrl` to show a logo image; falls back to the name text. |

### sections.welcome (optional)
`enabled`, `heading` (renders as a two-part "Welcome to the / Rockies" split), `body`,
`quote`, `quoteAttribution`, `closing`, `note`.

### sections.schedule
`enabled`, `days[]` → each `{ id, label, date, items[] }`, each item `{ time, label, note? }`.

### sections.expo
`enabled`, `date`, `locationName`, `locationAddress`, `locationMapUrl`, `locationLat`,
`locationLng`, `mapImageUrl?`, `hours[]` `{ label, time }`, `notes[]` (string),
`infoBlocks[]` `{ heading, body, linkLabel?, linkUrl? }`.

### sections.courseInfo  (rendered at `#course-info` — used here for the **5K**)
`enabled`, `heading`, `navLabel`, `schedule[]` `{ time, label, note? }`,
`distances[]` `{ name, stats?, statTiles?, mapUrl, embedUrl?, mapImageUrl? }`,
`infoBlocks[]`. (`aidStations`/`recoveryFood`/`strollerPolicy`/`dogPolicy` are legacy
free-text fields, optional.)
- **`statTiles[]`** = `{ value, label }` — the big-number tiles (e.g. `{value:"3.1", label:"Miles"}`).
- **`embedUrl`** = RideWithGPS embed URL (the live route iframe).

### sections.raceMorning  (rendered at `#race-morning` — used here for the **Half + parking**)
`enabled`, `navLabel`, `timelineLabel`, `courses[]` (same shape as `distances`),
`shuttleDetails[]` `{ time, label }`, `parkingOptions[]`
`{ name, details, mapUrl, lat, lng }`, `parkingMapImageUrl?`, `dropOffNote`, `infoBlocks[]`.

### sections.spectators
`enabled`, `notes` (intro), `warnings[]` (string — render as numbered cards),
`shuttleAccess?`.

### sections.postRace
`enabled`, `finishLineInfo`, `courseRecords[]` `{ category, name, time, year }`,
`infoSections[]` `{ heading, body, links?: [{label,url}] }`.

### sections.challengeEvents (optional — e.g. "Elk Double")
`enabled`, `intro?`, `events[]` →
`{ name, tagline?, description, totalMileage?, statTiles?, dates, includes[], bibPickup, medals, swag? }`.

### sections.experiences
`enabled`,
`lodging` `{ partner, description, url, imageUrl? }`,
`activities[]` `{ name, description, discountCode?, url }`,
`hikes[]` `{ name, distance, elevation, difficulty, url, imageUrl? }`,
`sights[]` `{ name, description, url? }`,
`parkNote?` (the "Know before you go" callout),
`restaurants[]` `{ name, description, url, icon?, address?, phone? }`.

### sections.faqs
`enabled`, `items[]` `{ question, answer }`.

---

## 5. Asset checklist (`public/images/events/`)

| File | Used for | Notes |
|---|---|---|
| `<slug>-icon.png` | faint watermark in dark sections + hero | transparent PNG; tall/portrait works well |
| `<slug>-favicon.png` | browser tab | small square PNG; referenced by `favicon` |
| `<slug>-shield.png` | hero badge (top-right) | optional; transparent PNG; missing = auto-hidden |
| hero photo | hero background | a URL in `heroImage`, or a local file you add |

Photo placeholders: hike cards, the lodging banner, and the inter-section photo bands show
a **hatched placeholder** until a real image URL is provided. Add real photos by setting
`imageUrl` on hikes / lodging (editable at `/edit`).

---

## 6. The editor (`/edit`)

The VR team signs in (Netlify Identity) at `/edit`, picks a guide, clicks any text to edit
it inline, manages lists with the ↑ ↓ ✕ and "+ Add" controls, and hits **Save & publish**
(commits the JSON to the repo → Netlify redeploys). For `trailhead` guides the editor now
renders on the Trailhead design itself. The hero image, maps, and route embeds are locked.

---

## 7. Guardrails (don't break these)

- Keep section `id`s (above) — nav + search depend on them.
- Don't rename data fields without updating `event.ts` + the JSON + the editable wrapper
  together (and note it). EditableText renders a transparent textarea that inherits type —
  avoid gradient/background-clip text or per-letter effects on editable strings.
- RideWithGPS route iframes and Google `MapEmbed`s are real embeds — restyle containers,
  don't replace them.
- Keep it a static export (`output: 'export'`) — no server runtime, no heavy client libs.
  Animations must work without JS.
- Export PDF must stay clean (the `@media print` rules expand accordions and hide chrome).

See `TRAILHEAD-NOTES.md` for the design implementation details and `DESIGN-HANDOFF.md` for
the original editability contract.
