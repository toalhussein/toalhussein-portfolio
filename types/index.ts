export * from './database'

// Locale type
export type Locale = 'ar' | 'en'

// Direction type
export type Direction = 'rtl' | 'ltr'

// Navigation item type
export interface NavItem {
  label: {
    ar: string
    en: string
  }
  href: string
}

// Social link type
export interface SocialLink {
  name: string
  url: string
  icon: string
}

// Skill category type
export interface SkillCategory {
  name: {
    ar: string
    en: string
  }
  skills: string[]
}
