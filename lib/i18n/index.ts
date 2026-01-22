import { Locale } from '@/types'
import { dictionaries, Dictionary } from './dictionaries'

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.ar
}

export * from './config'
export * from './dictionaries'
