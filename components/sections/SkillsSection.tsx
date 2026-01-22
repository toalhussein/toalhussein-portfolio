'use client'

import { motion } from 'framer-motion'
import { Smartphone, Server, Database, GitBranch, Wrench, Palette } from 'lucide-react'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Section, Badge } from '@/components/ui'

interface SkillsSectionProps {
  locale: Locale
  dictionary: Dictionary
}

const skillCategories = [
  {
    key: 'mobile',
    skills: ['Flutter', 'Kotlin', 'Android'],
    icon: Smartphone,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    key: 'backend',
    skills: ['Firebase', 'Supabase', 'REST API'],
    icon: Server,
    gradient: 'from-green-500/10 to-emerald-500/10',
    iconColor: 'text-green-500',
  },
  {
    key: 'database',
    skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Firebase', 'Supabase'],
    icon: Database,
    gradient: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-500',
  },
  {
    key: 'devops',
    skills: ['GitHub Actions', 'GitHub'],
    icon: GitBranch,
    gradient: 'from-orange-500/10 to-red-500/10',
    iconColor: 'text-orange-500',
  },
  {
    key: 'tools',
    skills: ['Postman', 'Google Maps'],
    icon: Wrench,
    gradient: 'from-yellow-500/10 to-amber-500/10',
    iconColor: 'text-yellow-500',
  },
  {
    key: 'design',
    skills: ['Figma', 'Adobe XD'],
    icon: Palette,
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconColor: 'text-pink-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function SkillsSection({ locale, dictionary }: SkillsSectionProps) {
  const t = dictionary.skills
  
  return (
    <Section id="skills" title={t.title} subtitle={t.subtitle} className="bg-surface/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {skillCategories.map((category) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.key}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Card */}
              <div className="relative p-6 rounded-2xl bg-surface border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                {/* Shine Effect */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '200%', opacity: 0.1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                />
                
                {/* Header with Icon */}
                <div className="relative z-10 flex items-center gap-3 mb-5">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} group-hover:shadow-lg transition-shadow`}
                  >
                    <Icon className={`w-6 h-6 ${category.iconColor}`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {t.categories[category.key as keyof typeof t.categories]}
                  </h3>
                </div>
                
                {/* Skills Badges */}
                <div className="relative z-10 flex flex-wrap gap-2">
                  {category.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: 'spring' as const,
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Badge variant="primary" className="cursor-default">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom Accent Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-center"
                />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
