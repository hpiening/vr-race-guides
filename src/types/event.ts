export interface ScheduleItem {
  time: string
  label: string
  note?: string
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
  logo?: string
  logoAlt?: string
  sectionBreaks?: {
    afterRaceMorning?: SectionBreakConfig
    afterChallengeEvents?: SectionBreakConfig
    afterExperiences?: SectionBreakConfig
  }
  partners?: {
    enabled: boolean
    items: Array<{ name: string; logoUrl?: string }>
  }
  sections: {
    welcome?: WelcomeData
    schedule: {
      enabled: boolean
      days: ScheduleDay[]
    }
    expo: {
      enabled: boolean
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
    raceMorning: {
      enabled: boolean
      navLabel?: string
      timelineLabel?: string
      parkingOptions: ParkingOption[]
      parkingMapImageUrl?: string
      shuttleDetails: ScheduleItem[]
      dropOffNote: string
      courses?: CourseDistance[]
      infoBlocks?: InfoBlock[]
    }
    courseInfo: {
      enabled: boolean
      heading?: string
      navLabel?: string
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
    }
    postRace: {
      enabled: boolean
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
      lodging: { partner: string; description: string; url: string; imageUrl?: string }
      activities: Array<{ name: string; description: string; discountCode?: string; url: string }>
      hikes: Hike[]
      sights?: Sight[]
      restaurants: Restaurant[]
      parkNote?: string
    }
    faqs: {
      enabled: boolean
      items: FaqItem[]
    }
    challengeEvents?: ChallengeEventsData
  }
}
