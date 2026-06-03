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

export interface CourseDistance {
  name: string
  mapImageUrl?: string
  mapUrl: string
}

export interface Hike {
  name: string
  distance: string
  elevation: string
  difficulty: string
  url: string
}

export interface Restaurant {
  name: string
  description: string
  url: string
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

export interface WineFestivalData {
  enabled: boolean
  date: string
  hours: string
  location: string
  description: string
  tips: string[]
  guestPasses: string
  finishLineVIP?: string
  wineries?: string[]
}

export interface ChallengeEvent {
  name: string
  tagline?: string
  description: string
  totalMileage?: string
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

export interface EventData {
  slug: string
  name: string
  tagline: string
  dates: string
  heroImage: string
  heroImageAlt: string
  heroOverlayImage?: string
  heroBgColor?: string
  accentColor: string
  brand?: 'vr' | 'n2s'
  logo?: string
  logoAlt?: string
  sections: {
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
    }
    raceMorning: {
      enabled: boolean
      timelineLabel?: string
      parkingOptions: ParkingOption[]
      parkingMapImageUrl?: string
      shuttleDetails: ScheduleItem[]
      dropOffNote: string
    }
    courseInfo: {
      enabled: boolean
      heading?: string
      navLabel?: string
      distances: CourseDistance[]
      strollerPolicy: string
      dogPolicy: string
      aidStations: string
      recoveryFood: string
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
      lodging: { partner: string; description: string; url: string }
      activities: Array<{ name: string; description: string; discountCode?: string; url: string }>
      hikes: Hike[]
      restaurants: Restaurant[]
    }
    faqs: {
      enabled: boolean
      items: FaqItem[]
    }
    wineFestival?: WineFestivalData
    challengeEvents?: ChallengeEventsData
  }
}
