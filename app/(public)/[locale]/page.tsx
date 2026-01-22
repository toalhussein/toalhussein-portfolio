import { Metadata } from 'next'
import { Locale, ProjectWithTech, Work } from '@/types'
import { getDictionary } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'
import { getPublicCV } from '@/lib/actions/cv'
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  WorksSection,
  ProjectsSection,
  TechStackSection,
  ContactSection,
} from '@/components/sections'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const dictionary = getDictionary(locale as Locale)
  
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  }
}

async function getProjects(): Promise<ProjectWithTech[]> {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_tech(
        tech(*)
      )
    `)
    .eq('published', true)
    .order('sort_order', { ascending: true })
  
  console.log('Supabase projects fetch - data:', projects?.length || 0, 'error:', error)
  
  if (!projects) return []
  
  return (projects as any[]).map((project) => ({
    ...project,
    tech: project.project_tech?.map((pt: any) => pt.tech).filter(Boolean) || [],
  }))
}

async function getWorks(): Promise<Work[]> {
  const supabase = await createClient()
  
  const { data: works, error } = await supabase
    .from('works')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false })
  
  if (!works) return []
  
  return works
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const validLocale = locale as Locale
  const dictionary = getDictionary(validLocale)
  
  const projects = await getProjects()
  const works = await getWorks()
  const cvUrl = await getPublicCV()
  
  return (
    <>
      <HeroSection locale={validLocale} dictionary={dictionary} cvUrl={cvUrl} />
      <AboutSection locale={validLocale} dictionary={dictionary} />
      <SkillsSection locale={validLocale} dictionary={dictionary} />
      {works.length > 0 && (
        <WorksSection locale={validLocale} dictionary={dictionary} works={works} />
      )}
      <ProjectsSection locale={validLocale} dictionary={dictionary} projects={projects} />
      <TechStackSection locale={validLocale} dictionary={dictionary} />
      <ContactSection locale={validLocale} dictionary={dictionary} />
    </>
  )
}
