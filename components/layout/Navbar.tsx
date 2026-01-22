'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { LanguageToggle } from './LanguageToggle'
import { cn } from '@/lib/utils'

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              toalhussein
            </motion.span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-foreground-secondary hover:text-primary transition-colors duration-200 font-medium"
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
              className="md:hidden overflow-hidden"
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
