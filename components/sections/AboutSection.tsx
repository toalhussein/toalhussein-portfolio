'use client'

import { motion } from 'framer-motion'
import { Smartphone, Zap, PaintbrushIcon, CreditCard, Wrench, Globe } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Section } from '@/components/ui'

interface AboutSectionProps {
  locale: Locale
  dictionary: Dictionary
}

const specializations = [
  { 
    key: 'cross-platform',
    title: { en: 'Cross-Platform Mobile App Development', ar: 'تطوير تطبيقات موبايل متعددة المنصات' },
    description: { en: 'Building native-quality apps for iOS & Android from a single codebase', ar: 'بناء تطبيقات بجودة native لـ iOS وأندرويد من كود واحد' },
    icon: Smartphone,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500'
  },
  { 
    key: 'ui-ux',
    title: { en: 'UI/UX Implementation', ar: 'تنفيذ واجهات المستخدم' },
    description: { en: 'Crafting beautiful, intuitive interfaces that users love', ar: 'صناعة واجهات جميلة وسهلة يحبها المستخدمون' },
    icon: PaintbrushIcon,
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconColor: 'text-pink-500'
  },
  { 
    key: 'performance',
    title: { en: 'Performance Optimization', ar: 'تحسين الأداء' },
    description: { en: 'Optimizing apps for smooth 60fps and minimal resource usage', ar: 'تحسين التطبيقات لـ 60 إطار سلس واستهلاك أقل للموارد' },
    icon: Zap,
    gradient: 'from-yellow-500/10 to-amber-500/10',
    iconColor: 'text-yellow-500'
  },
  { 
    key: 'payment',
    title: { en: 'Payment Integration', ar: 'تكامل أنظمة الدفع' },
    description: { en: 'Secure integration of payment gateways and in-app purchases', ar: 'تكامل آمن لبوابات الدفع والمشتريات داخل التطبيق' },
    icon: CreditCard,
    gradient: 'from-green-500/10 to-emerald-500/10',
    iconColor: 'text-green-500'
  },
  { 
    key: 'maintenance',
    title: { en: 'App Maintenance & Support', ar: 'صيانة ودعم التطبيقات' },
    description: { en: 'Ongoing maintenance, updates, and technical support', ar: 'صيانة مستمرة وتحديثات ودعم فني' },
    icon: Wrench,
    gradient: 'from-orange-500/10 to-red-500/10',
    iconColor: 'text-orange-500'
  },
  { 
    key: 'deployment',
    title: { en: 'Deployment & Localization', ar: 'النشر والترجمة' },
    description: { en: 'Publishing to stores and adapting apps for global audiences', ar: 'النشر على المتاجر وتكييف التطبيقات للجمهور العالمي' },
    icon: Globe,
    gradient: 'from-purple-500/10 to-indigo-500/10',
    iconColor: 'text-purple-500'
  },
]

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

export function AboutSection({ locale, dictionary }: AboutSectionProps) {
  const t = dictionary.about
  const description = Array.isArray(t.description) ? t.description : [t.description]
  
  return (
    <Section id="about" title={t.title} subtitle={t.subtitle}>
      <div className="max-w-5xl mx-auto">
        {/* Description - Multi-paragraph with hover effects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 space-y-6"
        >
          {description.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={itemVariants}
              whileHover={{
                x: locale === 'ar' ? -5 : 5,
                transition: { duration: 0.2 }
              }}
              className="text-foreground-secondary text-base md:text-lg leading-relaxed text-center md:text-start hover:text-foreground transition-colors duration-200 cursor-default"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
        
        {/* Specializations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {specializations.map((spec, index) => {
            const Icon = spec.icon
            return (
              <motion.div
                key={spec.key}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 } 
                }}
                className="group relative"
              >
                {/* Background Gradient Layer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${spec.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
                
                {/* Card Container */}
                <div className="relative flex flex-col items-center text-center p-6 md:p-8 rounded-2xl bg-surface border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full">
                  {/* Shine Effect */}
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ x: '200%', opacity: 0.1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  />
                  
                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${spec.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Icon Container */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: 'spring' as const,
                      stiffness: 400,
                      damping: 20
                    }}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${spec.gradient} flex items-center justify-center mb-5 md:mb-6 group-hover:shadow-lg transition-all duration-300 z-10`}
                  >
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${spec.iconColor}`} />
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="relative text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 z-10"
                  >
                    {spec.title[locale]}
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.15 }}
                    className="relative text-sm md:text-base text-foreground-secondary group-hover:text-foreground transition-colors duration-300 leading-relaxed z-10"
                  >
                    {spec.description[locale]}
                  </motion.p>
                  
                  {/* Bottom Accent Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.4 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${spec.gradient} origin-center group-hover:h-2 transition-all duration-300`}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </Section>
  )
}
