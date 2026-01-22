'use client'

import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { Locale } from '@/types'
import { localeNames } from '@/lib/i18n'

interface LanguageToggleProps {
  locale: Locale
}

export function LanguageToggle({ locale }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const toggleLocale = () => {
    const newLocale: Locale = locale === 'ar' ? 'en' : 'ar'
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPathname)
  }
  
  const otherLocale = locale === 'ar' ? 'en' : 'ar'
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors duration-200"
      aria-label={`Switch to ${localeNames[otherLocale]}`}
    >
      <Globe size={18} className="text-primary" />
      <span className="text-sm font-medium text-foreground">
        {localeNames[otherLocale]}
      </span>
    </motion.button>
  )
}
