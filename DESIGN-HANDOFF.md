# Design Handoff — VR Race Day Guides

**To:** Claude Design
**Goal:** Elevate the visual design of the digital Race Day Guide to a premium,
distinctive, on-brand experience — **without breaking the content model or the inline
editor.** This is the one hard requirement: every change must come back fully editable
(see "The editability contract" below — read it first).

**Repo:** `hpiening/vr-race-guides` · **Live:** https://guides.vacationraces.com
**Reference guide to design against:** https://guides.vacationraces.com/rocky-mountain/

---

## 1. What this is

A Next.js 14 **statically exported** site that renders digital Race Day Guides for
Vacation Races events (runner-facing: schedule, expo, course info, parking, FAQs, local
experiences). Each guide is driven entirely by **one JSON file** — no per-guide code.
The audience is runners on mobile the morning of a race, and at home planning their trip.
It should feel premium, outdoorsy, trustworthy, and effortless to scan.

**Stack:** Next.js 14 (App Router, `output: 'export'`), Tailwind CSS, TypeScript. Deploys
to Netlify on `git push`. No server runtime, no database.

---

## 2. ⚠️ The editability contract (read before touching anything)

This guide is edited **inline, on the page** by the VR team at `/edit` (they click text,
edit it, manage lists, hit Save → commits to the repo). The design and the editor share
the **same components**. So:

1. **One set of components serves both the public page and the editor.** Do **not** fork a
   separate "designed" version — restyle the existing `src/components/*Section.tsx` in
   place. If the public and editable renders diverge, the editor breaks.
2. **Don't change the data shape.** Content fields and their names live in
   `src/types/event.ts` and `content/events/*.json`. If a redesign genuinely needs a new
   field, it must be added to **`event.ts` + the JSON + the editable wrapper** together
   (and flagged in your handback) — never silently.
3. **Keep the editable wrappers.** Editable text is rendered via
   `<EditableText value={…} path="…">` (from `src/components/edit/`). Lists use
   `<ListControls>` / `<AddButton>`. Keep these in place and keep the `path`/`basePath`
   props intact. You can restyle freely *around* them; just don't remove them or change
   their `path` strings.
4. **Editable text must inherit type cleanly.** In edit mode `<EditableText>` renders a
   transparent `<textarea>` that inherits `font`, `color`, `letter-spacing`,
   `line-height`, `text-transform`. **Avoid text treatments that can't survive that** on
   editable strings — e.g. background-clip gradient text, per-letter animation, or text
   baked into an image. (Static decorative text is fine.) If you want a fancy headline
   effect, confirm it still reads correctly as an editable textarea.
5. **Keep section `id`s.** `schedule`, `expo`, `course-info`, `race-morning`,
   `spectators`, `post-race`, `challenge-events`, `experiences`, `faqs` — used by the
   sticky nav and the search index. Renaming them breaks navigation.
6. **Locked-by-design fields** (not editable, intentionally): hero image, slug, brand.
   Style the hero however you like; the image itself is data.
7. **Functional embeds stay functional.** The RideWithGPS route `<iframe>` and the
   Google `MapEmbed` are real embeds — restyle their containers/frames, don't replace the
   embeds.
8. **Preserve print/PDF.** There's an "Export PDF" path with dedicated `@media print`
   rules in `globals.css` (reveals all FAQ answers, expands all schedule days, hides
   chrome/nav/buttons/iframes). Keep guides printing cleanly.
9. **Stay static & light.** Must remain a static export (`output: 'export'`) — no server
   runtime, no runtime data fetching, no heavy client libraries that bloat the bundle or
   break the build. Animations must be progressive enhancement (work without JS / in SSR).

**Definition of done = it still builds, still renders the public guide, and still edits
at `/edit`.** See the handback checklist (§7).

---

## 3. Where the design lives

| File | What's there |
|---|---|
| `tailwind.config.ts` | Color palette + font families (tokens) |
| `src/styles/globals.css` | `@font-face` (custom fonts), CSS variables, semantic font utilities, **print styles**, editor affordances (`.editable-field`) |
| `src/components/SectionWrapper.tsx` | Standard section shell (padding, dark/light bg, eyebrow label) |
| `src/components/HeroSection.tsx` | Hero (image, gradient, title/tagline/dates) |
| `src/components/*Section.tsx` | One component per section (Schedule, Expo, CourseInfo, RaceMorning, Spectators, PostRace, ChallengeEvents, Experiences, FAQ, Welcome) |
| `src/components/StickyNav.tsx`, `SearchBar.tsx`, `PrintButton.tsx`, `MapEmbed.tsx` | Chrome + utilities |
| `src/app/[slug]/page.tsx` | Assembles the sections (public page) |
| `public/images/`, `public/fonts/` | Brand assets (`vr-logo.png`, `vr-shield.png`) + font files |

---

## 4. Current design system (your starting point)

**Palette** (`tailwind.config.ts`):

| Token | Hex | Role |
|---|---|---|
| `vr-forest` | `#313832` | Primary dark — nav, dark sections, footer |
| `vr-deep` | `#264533` | Deep green accent |
| `vr-cream` | `#f3e2cc` | Text/bg on dark |
| `vr-offwhite` | `#FAF7F2` | Light card bg |
| `vr-white` | `#FFFFFF` | Light section bg |
| `vr-floral` | `#da8165` | Coral accent (timeline dots, chevrons, FAQ +) |
| `vr-sandstone` | `#8B4411` | Secondary accent / links |
| `vr-sky` | `#7BADAC` | Cool accent (underused) |
| `vr-earth` | `#756356` | Warm neutral |
| `vr-mid` | `#6B7068` | Muted body text on light |

**Typography** — semantic utilities (`font-display`, `font-heading`, `font-body`,
`font-micro`, `font-label`, `font-accent`) mapped in `globals.css` to: Scale Condensed
(hero/section headings), Scale (sub-heads/card titles), Scale Medium (labels/CTAs), Forma
DJR Text (body), Forma DJR Micro (eyebrows/timestamps), Fraunces 72pt (accent/quotes).
Fonts are self-hosted in `public/fonts`.

**Layout patterns today:** full-bleed hero → sticky section nav → sections alternating
light/dark via `SectionWrapper`'s `dark` prop. Schedule is a tabbed day timeline (dot +
connector). FAQ is an accordion. Cards are rounded with hairline borders. There's a
floating search button (Cmd/Ctrl+K) and an Export-PDF button.

---

## 5. What to elevate (creative latitude here)

Treat the above as a foundation to refine, not a cage. Strong candidates:

- **Typographic hierarchy & rhythm** — more deliberate scale, tracking, and vertical
  rhythm; make the guide feel editorial and premium.
- **Hero** — a more cinematic, branded opening (imagery treatment, gradient/scrim,
  layered type, the event mark). It sets the tone.
- **Section transitions & rhythm** — elevate the light/dark alternation; consider section
  dividers, eyebrow treatment, and breathing room.
- **Cards & components** — schedule timeline, FAQ accordion, info blocks, parking,
  experience cards, course-record stats. Make them tactile and scannable.
- **Color & contrast** — richer, accessible use of the palette (the cool `vr-sky` and
  `vr-earth` are underused). Keep AA contrast for runner-in-sunlight legibility.
- **Micro-interactions** — tasteful hover/scroll reveals (progressive enhancement only).
- **Mobile-first** — the morning-of experience is on a phone; prioritise it.
- **Iconography & accents** — consistent icon language; the outdoorsy/national-park feel.
- **Chrome** — sticky nav, search, and the Export-PDF / print layout polish.

---

## 6. How to work

```bash
npm install
npm run dev        # local preview at localhost:3000  (try /rocky-mountain and /edit/?slug=rocky-mountain)
npx tsc --noEmit   # typecheck
npm run build      # static export — must pass
```

- Edit `tailwind.config.ts` + `globals.css` for tokens/type; restyle the section
  components for layout.
- Test **both** `/rocky-mountain/` (public) and `/edit/?slug=rocky-mountain` (editor) as
  you go — the editor view is the acceptance test for the contract.
- Two real guides exist to test against: `rocky-mountain` and `grand-teton`.

---

## 7. Handback checklist (so Y11 can confirm it's still editable)

Before handing back, confirm:

- [ ] `npx tsc --noEmit` passes and `npm run build` succeeds.
- [ ] Public guide renders correctly at `/rocky-mountain/` **and** `/grand-teton/`.
- [ ] `/edit/?slug=rocky-mountain` still works: text edits inline, lists add/remove/
      reorder, RideWithGPS route link + parking image still editable, **Save** still works.
- [ ] Section `id`s unchanged; sticky nav + search still jump correctly.
- [ ] Export PDF still produces a clean document (all FAQs + all schedule days shown).
- [ ] **Data shape unchanged** — or, if a field was added, `event.ts` + the JSON + the
      `<EditableText>` wrapper were all updated together, and it's called out in the notes.
- [ ] A short note of what changed, especially anything touching component structure.

---

## 8. Brand notes

Vacation Races = endurance events in/around U.S. national parks. Tone: adventurous,
reverent of nature, welcoming, premium-but-approachable. Logo/mark in
`public/images/vr-logo.png` and `public/images/vr-shield.png`. (An `n2s`/"Napa to Sonoma"
sub-brand was removed — ignore any references you find in git history.)
