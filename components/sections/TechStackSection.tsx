'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Locale } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Section } from '@/components/ui'

interface TechStackSectionProps {
  locale: Locale
  dictionary: Dictionary
}

// Static tech stack data with icons from public/TechStack
const techStack = [
  { name: 'Flutter', icon: 'Flutter.png' },
  { name: 'Dart', icon: 'dart.png' },
  { name: 'Firebase', icon: 'firebase.png' },
  { name: 'Kotlin', icon: 'Kotlin.png' },
  { name: 'Android', icon: 'android.png' },
  { name: 'GetX', icon: 'getx.png' },
  { name: 'MySQL', icon: 'mySql.png' },
  { name: 'PostgreSQL', icon: 'Postgresql.png' },
  { name: 'SQLite', icon: 'sqlite.png' },
  { name: 'Supabase', icon: 'supabase.png' },
  { name: 'REST API', icon: 'API.png' },
  { name: 'GitHub', icon: 'github.png' },
  { name: 'GitHub Actions', icon: 'githubActions.png' },
  { name: 'Postman', icon: 'postman.png' },
  { name: 'Google Maps', icon: 'google_maps.png' },
  { name: 'Figma', icon: 'figma.png' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

export function TechStackSection({ locale, dictionary }: TechStackSectionProps) {
  const t = dictionary.techStack
  
  return (
    <Section title={t.title} subtitle={t.subtitle} className="bg-surface/30">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        {techStack.map((tech) => (
          <motion.div
            key={tech.name}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              transition: { duration: 0.2 } 
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface border border-border hover:border-primary/50 hover:shadow-glow transition-all duration-300 cursor-default"
          >
            <Image
              src={`/TechStack/${tech.icon}`}
              alt={tech.name}
              width={28}
              height={28}
              className="object-contain"
              style={{ width: 'auto', height: 'auto', maxWidth: '28px', maxHeight: '28px' }}
            />
            <span className="font-medium text-foreground">{tech.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
