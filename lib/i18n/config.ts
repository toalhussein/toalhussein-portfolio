import { Locale } from '@/types'

export const locales: Locale[] = ['ar', 'en']
export const defaultLocale: Locale = 'ar'

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
}

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeDirections[locale]
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
