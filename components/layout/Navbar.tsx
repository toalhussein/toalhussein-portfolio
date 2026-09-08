'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { LanguageToggle } from './LanguageToggle'

interface NavbarProps {
  locale: Locale
  dictionary: Dictionary
  hasWorks?: boolean
}

export function Navbar({ locale, dictionary, hasWorks = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const navItems = [
    { label: dictionary.nav.home, href: `/${locale}` },
    { label: dictionary.nav.about, href: `/${locale}#about` },
    { label: dictionary.nav.skills, href: `/${locale}#skills` },
    ...(hasWorks ? [{ label: dictionary.nav.works, href: `/${locale}#works` }] : []),
    { label: dictionary.nav.projects, href: `/${locale}#projects` },
    { label: dictionary.nav.contact, href: `/${locale}/contact` },
  ]
  
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/75 backdrop-blur-xl">
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-sm font-bold text-primary shadow-glow-sm">
              T
            </span>
            <motion.span
              initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-xl"
            >
              toalhussein
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative py-2 text-sm font-medium text-foreground-secondary transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
            <LanguageToggle locale={locale} />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageToggle locale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 text-foreground-secondary hover:text-primary hover:bg-surface rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
