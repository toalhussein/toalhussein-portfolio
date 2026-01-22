'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
  dictionary: Dictionary
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/toalhussein' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/toalhussein' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/toalhussein' },
  { name: 'Email', icon: Mail, href: 'mailto:toalhussein@gmail.com' },
]

export function Footer({ locale, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-start">
            <Link href={`/${locale}`} className="inline-block mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                toalhussein
              </span>
            </Link>
            <p className="text-foreground-secondary text-sm">
              © {currentYear} {dictionary.footer.rights}
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="p-2.5 rounded-lg bg-surface border border-border hover:border-primary/50 hover:shadow-glow-sm text-foreground-secondary hover:text-primary transition-all duration-200"
                aria-label={social.name}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
          
          {/* Made with love */}
          <div className="flex items-center gap-2 text-foreground-secondary text-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
            </motion.span>
            <span>{dictionary.footer.by}</span>
            <span className="text-primary font-medium">الحسين عبدالصبور</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
