import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { Locale } from '@/types'
import { locales, getDictionary } from '@/lib/i18n'
import { Navbar, Footer } from '@/components/layout'
import { createClient } from '@/lib/supabase/server'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    notFound()
  }
  
  const validLocale = locale as Locale
  const dictionary = getDictionary(validLocale)
  
  // Check if there are published works
  const supabase = await createClient()
  const { count } = await supabase
    .from('works')
    .select('*', { count: 'exact', head: true })
    .eq('published', true)
  
  const hasWorks = (count ?? 0) > 0
  
  return (
    <>
      <Navbar locale={validLocale} dictionary={dictionary} hasWorks={hasWorks} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer locale={validLocale} dictionary={dictionary} />
    </>
  )
}
