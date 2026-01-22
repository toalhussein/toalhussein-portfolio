'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react'
import { Locale, Work } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Section } from '@/components/ui'

interface WorksSectionProps {
  locale: Locale
  dictionary: Dictionary
  works: Work[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
}

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.2,
      ease: 'easeInOut' as const
    }
  }
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15
    }
  }
}

function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
}

export function WorksSection({ locale, dictionary, works }: WorksSectionProps) {
  const t = dictionary.works
  const isRTL = locale === 'ar'

  if (!works || works.length === 0) {
    return null
  }

  return (
    <Section id="works" title={t.title} subtitle={t.subtitle} className="bg-surface/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Timeline Line with Gradient */}
          <motion.div
            variants={lineVariants}
            className={`absolute top-8 bottom-8 ${isRTL ? 'right-[11px] sm:right-[19px] md:right-[39px]' : 'left-[11px] sm:left-[19px] md:left-[39px]'} w-[2px] sm:w-[3px] origin-top`}
            style={{
              background: 'linear-gradient(to bottom, rgb(var(--primary-rgb)), rgba(var(--primary-rgb), 0.5), rgba(var(--primary-rgb), 0.2))'
            }}
          />

          {/* Work Items */}
          <div className="space-y-6 sm:space-y-8">
            {works.map((work, index) => {
              const roleTitle = locale === 'ar' ? work.role_title_ar : work.role_title_en
              const description = locale === 'ar' ? work.description_ar : work.description_en
              const isOngoing = !work.end_date
              
              return (
                <motion.div
                  key={work.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Timeline Dot with Pulse Animation */}
                  <motion.div
                    variants={dotVariants}
                    whileHover={{ scale: 1.2 }}
                    className={`absolute top-4 sm:top-6 ${isRTL ? 'right-0 sm:right-0 md:right-5' : 'left-0 sm:left-0 md:left-5'} z-10`}
                  >
                    <div className="relative">
                      {/* Pulse Ring for Ongoing Work */}
                      {isOngoing && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut' as const
                          }}
                          className="absolute inset-0 rounded-full bg-primary"
                        />
                      )}
                      {/* Main Dot */}
                      <div className={`relative w-6 h-6 sm:w-10 sm:h-10 rounded-full ${isOngoing ? 'bg-primary' : 'bg-primary/80'} border-2 sm:border-4 border-background shadow-lg flex items-center justify-center`}>
                        <Briefcase className="w-3 h-3 sm:w-5 sm:h-5 text-background" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ 
                      y: -4,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`${isRTL ? 'mr-12 sm:mr-20 md:mr-28' : 'ml-12 sm:ml-20 md:ml-28'} bg-surface border border-border sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group`}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Shine Effect */}
                    <motion.div
                      initial={{ x: '-100%', opacity: 0 }}
                      whileHover={{ x: '200%', opacity: 0.1 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    />
                    
                    <div className="relative z-10">
                      {/* Header with Company & Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {work.company_or_client}
                            </h3>
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3 pl-8 sm:pl-11">
                            {roleTitle}
                          </h4>
                        </div>
                        {isOngoing && (
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: 'spring' as const,
                              stiffness: 200
                            }}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg whitespace-nowrap self-start"
                          >
                            {t.current}
                          </motion.span>
                        )}
                      </div>

                      {/* Date Range with Better Styling */}
                      <div className="flex items-center gap-2 text-foreground-secondary text-xs sm:text-sm mb-3 sm:mb-5 pl-8 sm:pl-11">
                        <div className="p-1 sm:p-1.5 rounded-md bg-surface-light flex-shrink-0">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <span className="font-medium">
                          {formatDate(work.start_date, locale)}
                          <span className="mx-1 sm:mx-2 text-primary">•</span>
                          {isOngoing ? (
                            <span className="text-primary font-semibold">{t.present}</span>
                          ) : (
                            formatDate(work.end_date!, locale)
                          )}
                        </span>
                      </div>

                      {/* Description */}
                      {description && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="pl-8 sm:pl-11 pr-2 sm:pr-4"
                        >
                          <p className="text-foreground-secondary leading-relaxed text-sm sm:text-base">
                            {description}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Decorative Line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className={`absolute bottom-0 ${isRTL ? 'right-0 origin-right' : 'left-0 origin-left'} h-0.5 sm:h-1 w-full bg-gradient-to-r from-primary/20 via-primary/50 to-transparent`}
                    />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* End Marker */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`relative ${isRTL ? 'mr-12 sm:mr-20 md:mr-28' : 'ml-12 sm:ml-20 md:ml-28'} mt-6 sm:mt-8`}
          >
            <div className={`absolute top-0 ${isRTL ? 'right-[-35px] sm:right-[-51px] md:right-[-67px]' : 'left-[-35px] sm:left-[-51px] md:left-[-67px]'} w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-surface border-2 sm:border-4 border-primary/30 flex items-center justify-center`}>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}
