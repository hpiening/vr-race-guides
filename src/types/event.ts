export interface ScheduleItem {
  time: string
  label: string
  note?: string
  /**
   * Whether this row gets the accent highlight band (Trailhead schedule).
   * Unset = automatic: any row whose label contains the word "start" is
   * highlighted. Set true/false in the editor to override per row.
   */
  highlight?: boolean
}

export interface ScheduleDay {
  id: string
  label: string
  date: string
  items: ScheduleItem[]
}

export interface ExpoHour {
  label: string
  time: string
}

export interface ParkingOption {
  name: string
  details: string
  mapUrl: string
  lat: number
  lng: number
}

export interface StatTile {
  value: string
  label: string
}

export interface CourseDistance {
  name: string
  mapImageUrl?: string
  mapUrl: string
  embedUrl?: string
  stats?: string
  statTiles?: StatTile[]
  /**
   * Optional per-course accordions (e.g. Course Details / Aid Station / Getting
   * There). For multi-course events where each route carries its own logistics.
   * Absent = the course card renders exactly as before.
   */
  infoBlocks?: InfoBlock[]
}

export interface InfoBlock {
  heading: string
  body: string
  linkLabel?: string
  linkUrl?: string
}

export interface Hike {
  name: string
  distance: string
  elevation: string
  difficulty: string
  url: string
  imageUrl?: string
}

export interface Sight {
  name: string
  description: string
  url?: string
}

export interface Restaurant {
  name: string
  description: string
  url: string
  icon?: string
  address?: string
  phone?: string
}

export interface CourseRecord {
  category: string
  name: string
  time: string
  year: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ChallengeEvent {
  name: string
  tagline?: string
  description: string
  totalMileage?: string
  statTiles?: StatTile[]
  dates: string
  includes: string[]
  bibPickup: string
  medals: string
  swag?: string
}

export interface ChallengeEventsData {
  enabled: boolean
  intro?: string
  events: ChallengeEvent[]
}

/** A single card inside a Festival card group. */
export interface FeatureCard {
  /** Small accent line above the title (e.g. "Thu, Oct 1 · 5–6 PM", "Free · 20 minutes"). */
  eyebrow?: string
  title: string
  /** Body copy (supports **bold** and [links](url); newlines kept). */
  body?: string
  /** Optional trailing meta, right-aligned on the `rows` layout (e.g. a price). */
  meta?: string
  imageUrl?: string
  url?: string
}

/** A titled group of cards within a Festival section. */
export interface CardGroup {
  heading: string
  /** Optional lead line under the group heading. */
  intro?: string
  /**
   * cards  — text cards in a responsive grid (default)
   * photos — image-topped cards (photo above the text)
   * rows   — compact rows, eyebrow left / title+body right (menus, price lists)
   */
  layout?: 'cards' | 'photos' | 'rows'
  cards: FeatureCard[]
}

/**
 * Optional extra content section for festival-style events — e.g. Grand Circle
 * Trailfest's Basecamp / Meals / Entertainment, which have no home in the
 * single-race section set. Each entry renders as its own <section> between
 * Camping and On-the-Course, with its own sticky-nav entry. Guides with no
 * `festival` array are completely unaffected.
 */
export interface FestivalSectionData {
  enabled: boolean
  /** Anchor id + nav target. Must be unique and URL-safe (e.g. 'basecamp'). */
  id: string
  /** Sticky-nav label. */
  navLabel: string
  /** Italic accent eyebrow above the heading. */
  eyebrow?: string
  heading: string
  /** Lead paragraph under the heading. */
  intro?: string
  /**
   * Background tone. 'light' (default) = paper; 'dark' / 'darkest' = the two
   * dark section grounds, so consecutive festival sections can alternate.
   */
  tone?: 'light' | 'dark' | 'darkest'
  /** Optional full-width photo under the intro. */
  imageUrl?: string
  groups?: CardGroup[]
  /** Accordions at the foot of the section. */
  infoBlocks?: InfoBlock[]
}

export interface CampingData {
  enabled: boolean
  /** Italic eyebrow above the heading. Defaults to "Stay with us". */
  eyebrow?: string
  /** Section heading. Defaults to "VR Campground". */
  heading?: string
  /** Intro / overview paragraphs (supports **bold** and [links](url); newlines kept). */
  overview: string
  /** Optional campground photo (right of the overview). */
  imageUrl?: string
  /** Optional reservation button. */
  bookingUrl?: string
  bookingLabel?: string
  /** Reference cards: Pricing, Check-In, Check-Out, Rules, etc. */
  infoBlocks?: InfoBlock[]
}

export interface SectionBreakConfig {
  bgImage?: string
}

export interface WelcomeData {
  enabled: boolean
  heading: string
  body: string
  quote?: string
  quoteAttribution?: string
  closing?: string
  note?: string
  /** Optional image shown in the left column, under the heading (Trailhead). */
  imageUrl?: string
}

export interface EventData {
  slug: string
  /**
   * Visual theme. Absent or 'classic' renders the original guide design
   * (used by all existing guides, e.g. grand-teton). 'trailhead' opts a guide
   * into the elevated Trailhead design. Locked-by-design config (like
   * accentColor / heroBgColor) — not inline-editable content.
   */
  theme?: 'classic' | 'trailhead'
  /**
   * Optional per-event brand palette. Sets `data-brand` on the guide wrapper,
   * which a `[data-brand='…']` scope in globals.css uses to re-theme the
   * Trailhead engine's colors (e.g. 'smoky' = navy/blue/gold). Absent = the
   * default Trailhead palette (Rocky Mountain green). Locked-by-design, not
   * inline-editable.
   */
  brand?: string
  name: string
  tagline: string
  dates: string
  heroImage: string
  heroImageAlt: string
  heroOverlayImage?: string
  heroBgColor?: string
  accentColor: string
  favicon?: string
  hidden?: boolean
  /**
   * Optional race-weekend announcement banner (top of page, scrolls away).
   * Toggled on/off and edited from /edit. `level` sets the colour: info (brand
   * blue), weather (amber), urgent (red). Absent/`enabled:false` = no banner.
   */
  alert?: {
    enabled: boolean
    level?: 'info' | 'weather' | 'urgent'
    title?: string
    message: string
    updated?: string
    linkLabel?: string
    linkUrl?: string
  }
  shieldImage?: string
  logo?: string
  logoAlt?: string
  sectionBreaks?: {
    afterRaceMorning?: SectionBreakConfig
    afterChallengeEvents?: SectionBreakConfig
    afterExperiences?: SectionBreakConfig
  }
  /**
   * Optional landscape background photos for the full-bleed section-divider
   * bands (Trailhead). When a URL is set the band shows the photo (with a dark
   * scrim for legibility) instead of the default diagonal-stripe texture.
   * Editable per band in /edit.
   */
  photoBands?: {
    onCourse?: string
    raceMorning?: string
    postRace?: string
  }
  /** Optional faint background photo behind the "Chase the Extraordinary" footer (Trailhead). */
  footerImage?: string
  partners?: {
    enabled: boolean
    items: Array<{ name: string; logoUrl?: string; url?: string }>
  }
  sections: {
    welcome?: WelcomeData
    schedule: {
      enabled: boolean
      days: ScheduleDay[]
      /** Optional faint full-section background photo (Trailhead). */
      backgroundImage?: string
    }
    expo: {
      enabled: boolean
      /** Optional sticky-nav label. Defaults to "Expo". */
      navLabel?: string
      /** Optional section eyebrow (Trailhead). Defaults to "Pre-race". */
      eyebrow?: string
      /** Optional section heading (Trailhead). Defaults to "Expo". */
      heading?: string
      date: string
      locationName: string
      locationAddress: string
      locationMapUrl: string
      locationLat: number
      locationLng: number
      mapImageUrl?: string
      hours: ExpoHour[]
      notes: string[]
      infoBlocks?: InfoBlock[]
    }
    /** Optional VR Campground section (renders between Expo and On-the-Course). */
    camping?: CampingData
    /**
     * Optional festival sections (renders between Camping and On-the-Course),
     * one <section> per entry. For multi-day festival events only.
     */
    festival?: FestivalSectionData[]
    raceMorning: {
      enabled: boolean
      /** Header title (also the sticky-nav label). Editable in /edit. */
      navLabel?: string
      /** Small italic eyebrow above the header title. Defaults to "Getting to the". */
      eyebrow?: string
      timelineLabel?: string
      parkingOptions: ParkingOption[]
      parkingMapImageUrl?: string
      shuttleDetails: ScheduleItem[]
      dropOffNote: string
      /** Optional map/diagram shown directly below the Runner Drop-Off callout. */
      dropOffImageUrl?: string
      courses?: CourseDistance[]
      infoBlocks?: InfoBlock[]
    }
    courseInfo: {
      enabled: boolean
      heading?: string
      navLabel?: string
      /** Optional lead paragraph under the heading (Trailhead). */
      intro?: string
      schedule?: ScheduleItem[]
      distances: CourseDistance[]
      strollerPolicy: string
      dogPolicy: string
      aidStations: string
      recoveryFood: string
      infoBlocks?: InfoBlock[]
    }
    spectators: {
      enabled: boolean
      notes: string
      warnings: string[]
      shuttleAccess?: string
      /** Optional titled photos below the section (e.g. Spectator Parking, Finish Line). Editable in /edit. */
      images?: Array<{ title: string; imageUrl?: string }>
    }
    postRace: {
      enabled: boolean
      /** Optional sticky-nav label. Defaults to "Post-Race". */
      navLabel?: string
      /** Optional section eyebrow (Trailhead). Defaults to "Post-race". */
      eyebrow?: string
      /** Optional section heading (Trailhead). Defaults to "Information". */
      heading?: string
      courseRecords: CourseRecord[]
      finishLineInfo: string
      infoSections?: Array<{
        heading: string
        body: string
        links?: Array<{ label: string; url: string }>
      }>
    }
    experiences: {
      enabled: boolean
      /** Optional sticky-nav label. Defaults to "Experiences". */
      navLabel?: string
      /** Optional section eyebrow (Trailhead). Defaults to "Beyond the race". */
      eyebrow?: string
      /** Optional section heading (Trailhead). Defaults to "Experiences". */
      heading?: string
      lodging: { partner: string; description: string; url: string; imageUrl?: string }
      activities: Array<{ name: string; description: string; discountCode?: string; url: string }>
      hikes: Hike[]
      /** Optional heading for the hikes card grid (Trailhead). Defaults to "Hikes". */
      hikesHeading?: string
      sights?: Sight[]
      restaurants: Restaurant[]
      /** Optional heading for the restaurants block (Trailhead). Defaults to "Restaurants in Estes Park". */
      restaurantsHeading?: string
      /** Optional intro line under the restaurants heading (Trailhead). */
      restaurantsIntro?: string
      parkNote?: string
    }
    faqs: {
      enabled: boolean
      items: FaqItem[]
    }
    challengeEvents?: ChallengeEventsData
  }
}
