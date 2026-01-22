'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Star } from 'lucide-react'
import { Locale, ProjectWithTech } from '@/types'
import { Dictionary } from '@/lib/i18n'
import { Section, Card, CardContent, Badge, Button } from '@/components/ui'

interface ProjectsSectionProps {
  locale: Locale
  dictionary: Dictionary
  projects?: ProjectWithTech[]
  showAll?: boolean
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

export function ProjectsSection({ locale, dictionary, projects = [], showAll = false }: ProjectsSectionProps) {
  const t = dictionary.projects
  
  const getLocalizedField = <T extends { [key: string]: unknown }>(
    item: T,
    field: string
  ): string => {
    const localizedField = `${field}_${locale}` as keyof T
    return item[localizedField] as string || ''
  }
  
  // Show all projects or limited number for home page
  const displayProjects = showAll 
    ? projects 
    : projects.slice(0, 6)

  // Show empty state if no projects
  if (displayProjects.length === 0) {
    return (
      <Section id="projects" title={t.title} subtitle={t.subtitle}>
        <div className="text-center py-16">
          <p className="text-foreground-secondary text-lg">
            {locale === 'ar' ? 'لا توجد مشاريع حالياً' : 'No projects available'}
          </p>
        </div>
      </Section>
    )
  }
  
  return (
    <Section id="projects" title={t.title} subtitle={t.subtitle}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {displayProjects.map((project, index) => (
          <motion.div 
            key={project.id} 
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/${locale}/projects/${project.slug}`}>
              <Card hoverable className="h-full flex flex-col overflow-hidden group cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 relative">
                {/* Shine Effect */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '200%', opacity: 0.1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent z-10 pointer-events-none"
                />
                
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  {project.cover_image_path ? (
                    <>
                      <Image
                        src={project.cover_image_path}
                        alt={getLocalizedField(project, 'title')}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-50">📱</span>
                    </div>
                  )}
                  
                  {/* Featured badge */}
                  {project.featured && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: 'spring' as const,
                        stiffness: 200
                      }}
                      className="absolute top-3 end-3 z-10"
                    >
                      <Badge variant="primary" className="flex items-center gap-1 shadow-lg">
                        <Star size={12} className="fill-current" />
                        {t.featured}
                      </Badge>
                    </motion.div>
                  )}
                  
                  {/* Tech Count Badge */}
                  {project.tech.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                      className="absolute bottom-3 start-3 z-10"
                    >
                      <div className="px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground border border-border">
                        {project.tech.length} {locale === 'ar' ? 'تقنيات' : 'techs'}
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <CardContent className="flex-1 flex flex-col p-5">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {getLocalizedField(project, 'title')}
                  </h3>
                  
                  {/* Summary */}
                  <p className="text-foreground-secondary text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                    {getLocalizedField(project, 'summary')}
                  </p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <motion.div
                        key={tech.id}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          delay: index * 0.1 + techIndex * 0.05,
                          type: 'spring' as const,
                          stiffness: 300
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge variant="default" className="text-xs">
                          {tech.name}
                        </Badge>
                      </motion.div>
                    ))}
                    {project.tech.length > 3 && (
                      <Badge variant="default" className="text-xs opacity-70">
                        +{project.tech.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {project.repo_url && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(project.repo_url!, '_blank')
                        }}
                        className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary transition-colors cursor-pointer group/btn"
                      >
                        <div className="p-1.5 rounded-lg bg-surface-light group-hover/btn:bg-primary/10 transition-colors">
                          <Github size={14} />
                        </div>
                        <span className="font-medium">{t.viewCode}</span>
                      </motion.span>
                    )}
                    {project.live_url && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(project.live_url!, '_blank')
                        }}
                        className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-primary transition-colors cursor-pointer group/btn"
                      >
                        <div className="p-1.5 rounded-lg bg-surface-light group-hover/btn:bg-primary/10 transition-colors">
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                            className="flex-shrink-0"
                          >
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                        </div>
                        <span className="font-medium">{t.liveDemo}</span>
                      </motion.span>
                    )}
                  </div>
                </CardContent>
                
                {/* Bottom Accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-center"
                />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      {/* View All Button - only show on homepage */}
      {!showAll && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href={`/${locale}/projects`}>
            <Button variant="outline" size="lg">
              {t.viewAll}
            </Button>
          </Link>
        </motion.div>
      )}
    </Section>
  )
}
