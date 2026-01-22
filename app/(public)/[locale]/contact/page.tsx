import { Metadata } from 'next'
import { Locale } from '@/types'
import { getDictionary } from '@/lib/i18n'
import { ContactSection } from '@/components/sections'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const dictionary = getDictionary(locale as Locale)
  
  return {
    title: `${dictionary.contact.title} | ${dictionary.meta.title}`,
    description: dictionary.meta.description,
  }
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const validLocale = locale as Locale
  const dictionary = getDictionary(validLocale)
  
  return (
    <ContactSection locale={validLocale} dictionary={dictionary} fullPage />
  )
}
