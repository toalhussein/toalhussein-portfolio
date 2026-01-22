'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Github, X, ChevronLeft, ChevronRight, Calendar, Sparkles, Zap } from 'lucide-react'
import { Locale, ProjectScreenshot, Tech } from '@/types'
import { getDictionary } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'
import { Badge, Button } from '@/components/ui'

// Google Play Store Icon
function PlayStoreIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
    </svg>
  )
}

// Image Lightbox Component
function ImageLightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev,
  locale
}: { 
  images: ProjectScreenshot[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  locale: Locale
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  const current = images[currentIndex]
  const caption = current[`caption_${locale}` as keyof ProjectScreenshot] as string

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onClose}
        className="absolute top-4 end-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 backdrop-blur-sm"
      >
        <X size={24} />
      </motion.button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute start-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-10 backdrop-blur-sm"
          >
            <ChevronLeft size={32} className={locale === 'ar' ? 'rotate-180' : ''} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute end-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-10 backdrop-blur-sm"
          >
            <ChevronRight size={32} className={locale === 'ar' ? 'rotate-180' : ''} />
          </motion.button>
        </>
      )}

      {/* Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-auto h-auto max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={current.image_path}
            alt={caption || `Screenshot ${currentIndex + 1}`}
            width={400}
            height={800}
            className="object-contain max-h-[80vh] w-auto"
            priority
          />
        </div>
        
        {/* Caption */}
        {caption && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-white text-center text-lg max-w-2xl"
          >
            {caption}
          </motion.p>
        )}
        
        {/* Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
        >
          <p className="text-white/90 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

interface Project {
  id: string
  title_ar: string
  title_en: string
  summary_ar: string
  summary_en: string
  description_ar: string | null
  description_en: string | null
  features_ar: string[] | null
  features_en: string[] | null
  slug: string
  repo_url: string | null
  live_url: string | null
  featured: boolean
  cover_image_path: string | null
  created_at: string
  updated_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const locale = params.locale as Locale
  const slug = params.slug as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [tech, setTech] = useState<Tech[]>([])
  const [screenshots, setScreenshots] = useState<ProjectScreenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  
  const dictionary = getDictionary(locale)

  useEffect(() => {
    async function fetchProject() {
      const supabase = createClient()
      
      // Fetch project
      const { data: projectData } = await (supabase as any)
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()
      
      if (!projectData) {
        setLoading(false)
        return
      }
      
      setProject(projectData)
      
      // Fetch tech
      const { data: techData } = await (supabase as any)
        .from('project_tech')
        .select('tech_id')
        .eq('project_id', projectData.id)
      
      if (techData && techData.length > 0) {
        const techIds = techData.map((t: { tech_id: string }) => t.tech_id)
        const { data: techList } = await (supabase as any)
          .from('tech')
          .select('*')
          .in('id', techIds)
        setTech(techList || [])
      }
      
      // Fetch screenshots
      const { data: screenshotsData } = await (supabase as any)
        .from('project_screenshots')
        .select('*')
        .eq('project_id', projectData.id)
        .order('sort_order', { ascending: true })
      
      setScreenshots(screenshotsData || [])
      setLoading(false)
    }
    
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {locale === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
        </h1>
      </div>
    )
  }

  const getLocalizedField = (field: string): string => {
    return project[`${field}_${locale}` as keyof Project] as string || ''
  }

  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % screenshots.length)
    }
  }
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + screenshots.length) % screenshots.length)
    }
  }

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={screenshots}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
            locale={locale}
          />
        )}
      </AnimatePresence>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-light border border-border hover:border-primary/30 text-foreground-secondary hover:text-primary transition-all group"
            >
              <ArrowIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">{locale === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}</span>
            </Link>
          </motion.div>

          {/* Cover Image */}
          {project.cover_image_path && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group mb-12"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 transition-all shadow-2xl">
                <Image
                  src={project.cover_image_path}
                  alt={getLocalizedField('title')}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          )}

          {/* Title & Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-3">
                  {getLocalizedField('title')}
                </h1>
                {project.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Badge variant="primary" className="flex items-center gap-2 text-base px-4 py-2">
                      <Sparkles size={16} className="fill-current" />
                      {dictionary.projects.featured}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
            
            <p className="text-xl text-foreground-secondary mb-8 leading-relaxed max-w-4xl">
              {getLocalizedField('summary')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.repo_url && (
                <motion.a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" size="lg" className="gap-2 text-base border-2 shadow-lg">
                    <Github size={22} />
                    {dictionary.projects.viewCode}
                  </Button>
                </motion.a>
              )}
              {project.live_url && (
                <motion.a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="primary" size="lg" className="gap-2 text-base shadow-lg shadow-primary/30">
                    <PlayStoreIcon size={22} />
                    Google Play
                  </Button>
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {getLocalizedField('description') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 border-2 border-border hover:border-primary/30 rounded-2xl p-8 transition-all shadow-lg">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Zap size={20} className="text-primary" />
                      </div>
                      {locale === 'ar' ? 'نبذة عن المشروع' : 'About the Project'}
                    </h2>
                    <div className="text-foreground-secondary whitespace-pre-wrap leading-relaxed text-lg">
                      {getLocalizedField('description')}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Key Features */}
              {project[`features_${locale}` as keyof Project] && 
               (project[`features_${locale}` as keyof Project] as string[])?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 border-2 border-border hover:border-primary/30 rounded-2xl p-8 transition-all shadow-lg">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Sparkles size={20} className="text-accent" />
                      </div>
                      {locale === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
                    </h2>
                    <ul className="space-y-4">
                      {(project[`features_${locale}` as keyof Project] as string[]).map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-start gap-4 text-foreground-secondary group/item hover:text-foreground transition-colors"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                            {index + 1}
                          </span>
                          <span className="flex-1 text-lg">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Screenshots */}
              {screenshots.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 border-2 border-border hover:border-primary/30 rounded-2xl p-8 transition-all shadow-lg">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      {locale === 'ar' ? 'لقطات الشاشة' : 'Screenshots'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {screenshots.map((screenshot, index) => (
                        <motion.button
                          key={screenshot.id || index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openLightbox(index)}
                          className="relative aspect-[9/16] rounded-xl overflow-hidden bg-surface-light border-2 border-border hover:border-primary/50 transition-all cursor-zoom-in group/img shadow-lg"
                        >
                          <Image
                            src={screenshot.image_path}
                            alt={screenshot[`caption_${locale}` as keyof ProjectScreenshot] as string || `Screenshot ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </div>
                          </div>
                          {/* Caption */}
                          {screenshot[`caption_${locale}` as keyof ProjectScreenshot] && (
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                              <p className="text-xs text-white text-center line-clamp-2 font-medium">
                                {screenshot[`caption_${locale}` as keyof ProjectScreenshot] as string}
                              </p>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tech Stack */}
              {tech.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 border-2 border-border hover:border-primary/30 rounded-2xl p-6 transition-all shadow-lg">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      {locale === 'ar' ? 'التقنيات المستخدمة' : 'Technologies Used'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tech.map((t, index) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 300 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Badge variant="default" className="text-sm">
                            {t.name}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 border-2 border-border hover:border-primary/30 rounded-2xl p-6 transition-all shadow-lg">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    {locale === 'ar' ? 'معلومات المشروع' : 'Project Info'}
                  </h3>
                  <dl className="space-y-4">
                    <div className="pb-4 border-b border-border">
                      <dt className="text-sm text-foreground-secondary mb-1">
                        {locale === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                      </dt>
                      <dd className="text-foreground font-medium">
                        {new Date(project.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    {project.updated_at && project.updated_at !== project.created_at && (
                      <div>
                        <dt className="text-sm text-foreground-secondary mb-1">
                          {locale === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                        </dt>
                        <dd className="text-foreground font-medium">
                          {new Date(project.updated_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
