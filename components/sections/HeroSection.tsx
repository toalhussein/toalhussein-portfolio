'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Send, Code2, Sparkles, Smartphone, Download } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Button } from '@/components/ui'
import { useState, useEffect } from 'react'

interface HeroSectionProps {
  locale: Locale
  dictionary: Dictionary
  cvUrl?: string | null
}


// Floating icons configuration
const floatingIcons = [
  { Icon: Sparkles, position: 'top-1/4 start-[10%]', delay: 0, duration: 3 },
  { Icon: Code2, position: 'top-1/3 end-[15%]', delay: 0.5, duration: 4 },
  { Icon: Smartphone, position: 'top-2/3 end-[10%]', delay: 1, duration: 3.5 },
  { Icon: Sparkles, position: 'bottom-1/4 start-[15%]', delay: 1.5, duration: 3 },
]

// Typewriter effect component with loop
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState(text)
  const [currentIndex, setCurrentIndex] = useState(text.length)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // Start animation after delay
  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setHasStarted(true)
      setCurrentIndex(0)
      setDisplayedText('')
    }, delay)

    return () => clearTimeout(delayTimeout)
  }, [delay])

  // Typewriter animation
  useEffect(() => {
    if (!hasStarted) return

    if (!isDeleting && currentIndex < text.length) {
      // Typing
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex + 1))
        setCurrentIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else if (!isDeleting && currentIndex === text.length) {
      // Pause before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentIndex > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayedText(text.substring(0, currentIndex - 1))
        setCurrentIndex(prev => prev - 1)
      }, 50)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentIndex === 0) {
      // Pause before typing again
      const timeout = setTimeout(() => {
        setIsDeleting(false)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [hasStarted, currentIndex, text, isDeleting])

  return (
    <span className="inline-block" suppressHydrationWarning>
      {displayedText}
      {hasStarted && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

export function HeroSection({ locale, dictionary, cvUrl }: HeroSectionProps) {
  const t = dictionary.hero

  const handleDownloadCV = async () => {
    if (!cvUrl) return
    
    try {
      // Fetch the file
      const response = await fetch(cvUrl)
      const blob = await response.blob()
      
      // Create a temporary URL
      const url = window.URL.createObjectURL(blob)
      
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = 'toalhusseinCV.pdf'
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(cvUrl, '_blank')
    }
  }

  return (
    <section className="surface-grid relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border pt-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse" />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position} hidden lg:block`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
          }}
          transition={{
            delay: item.delay,
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-surface/50 backdrop-blur-sm border border-border flex items-center justify-center">
            <item.Icon size={28} className="text-primary" />
          </div>
        </motion.div>
      ))}

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="eyebrow mb-5 text-sm md:text-base"
          >
            {t.greeting}
          </motion.p>

          {/* Name with lustrous effect and hover */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            }}
            className="relative mb-5 cursor-default text-4xl font-bold tracking-tight text-foreground transition-all duration-300 md:text-6xl lg:text-8xl"
            style={{
              textShadow: '0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 40px rgba(59, 130, 246, 0.3)',
                  '0 0 60px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(59, 130, 246, 0.3)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {t.name}
            </motion.span>
          </motion.h1>

          {/* Title with gradient and typewriter effect */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-7 min-h-[3rem] text-2xl font-bold md:text-4xl lg:min-h-[5rem] lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              <TypewriterText text={t.title} delay={800} />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-foreground-secondary md:text-xl"
          >
            {t.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href={`/${locale}#projects`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="primary" size="lg">
                  {t.cta}
                </Button>
              </motion.div>
            </Link>
            <Link href={`/${locale}/contact`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg">
                  <Send size={20} />
                  {t.contact}
                </Button>
              </motion.div>
            </Link>
            {cvUrl && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCV}
                className="cursor-pointer"
              >
                <Button variant="outline" size="lg">
                  <Download size={20} />
                  {locale === 'ar' ? 'تحميل السيرة الذاتية' : 'Download CV'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {/* <motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  transition={{ delay: 1 }} 
  className="absolute bottom--9 left-1/2 -translate-x-1/2 translate-y-4" 
>
  <motion.div 
    animate={{ y: [0, 10, 0] }} 
    transition={{ repeat: Infinity, duration: 1.5 }} 
    className="text-foreground-secondary" 
  > 
    <ArrowDown size={24} /> 
  </motion.div> 
</motion.div> */}


      </div>
    </section>
  )
}
