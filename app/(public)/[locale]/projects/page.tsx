import { Metadata } from 'next'
import { Locale, ProjectWithTech, Tech } from '@/types'
import { getDictionary } from '@/lib/i18n'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { ProjectsSection } from '@/components/sections'

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params
  const dictionary = getDictionary(locale as Locale)
  
  return {
    title: `${dictionary.projects.title} | ${dictionary.meta.title}`,
    description: dictionary.meta.description,
  }
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params
  const validLocale = locale as Locale
  const dictionary = getDictionary(validLocale)
  
  const supabase = await createServerClient()
  
  const { data: projects } = await (supabase as any)
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const projectsWithTech: ProjectWithTech[] = await Promise.all(
    (projects || []).map(async (project: ProjectWithTech) => {
      const { data: techData } = await (supabase as any)
        .from('project_tech')
        .select('tech_id')
        .eq('project_id', project.id)
      
      if (techData && techData.length > 0) {
        const techIds = techData.map((t: { tech_id: string }) => t.tech_id)
        const { data: tech } = await (supabase as any)
          .from('tech')
          .select('*')
          .in('id', techIds)
        
        return { ...project, tech: tech || [] }
      }
      
      return { ...project, tech: [] as Tech[] }
    })
  )
  
  return (
    <div className="pt-20">
      <ProjectsSection 
        locale={validLocale} 
        dictionary={dictionary} 
        projects={projectsWithTech}
        showAll={true}
      />
    </div>
  )
}