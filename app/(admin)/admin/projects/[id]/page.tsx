'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowRight, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase'
import { projectSchema, ProjectFormData } from '@/lib/validation'
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui'
import { ImageUpload, ScreenshotsUpload, TechSelector, FeaturesInput } from '@/components/admin'
import Link from 'next/link'

interface Screenshot {
  id?: string
  image_path: string
  caption_ar?: string
  caption_en?: string
  sort_order: number
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coverImage, setCoverImage] = useState<string>('')
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [featuresAr, setFeaturesAr] = useState<string[]>([])
  const [featuresEn, setFeaturesEn] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    defaultValues: {
      title_ar: '',
      title_en: '',
      summary_ar: '',
      summary_en: '',
      description_ar: '',
      description_en: '',
      slug: '',
      repo_url: '',
      live_url: '',
      featured: false,
      published: true,
      sort_order: 0,
    },
  })

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const supabase = createClient()
        
        // Fetch project
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: project, error: projectError } = await (supabase as any)
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()
        
        if (projectError) throw projectError
        
        // Fetch screenshots
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: projectScreenshots } = await (supabase as any)
          .from('project_screenshots')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true })
        
        // Fetch project technologies
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: projectTech } = await (supabase as any)
          .from('project_tech')
          .select('tech_id')
          .eq('project_id', projectId)
        
        // Set form values
        reset({
          title_ar: project.title_ar || '',
          title_en: project.title_en || '',
          summary_ar: project.summary_ar || '',
          summary_en: project.summary_en || '',
          description_ar: project.description_ar || '',
          description_en: project.description_en || '',
          slug: project.slug || '',
          repo_url: project.repo_url || '',
          live_url: project.live_url || '',
          featured: project.featured || false,
          published: project.published ?? true,
          sort_order: project.sort_order || 0,
        })
        
        setCoverImage(project.cover_image_path || '')
        setScreenshots(projectScreenshots || [])
        setSelectedTech(projectTech?.map((pt: { tech_id: string }) => pt.tech_id) || [])
        setFeaturesAr(project.features_ar || [])
        setFeaturesEn(project.features_en || [])
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('فشل في تحميل بيانات المشروع')
      } finally {
        setIsFetching(false)
      }
    }
    
    fetchProject()
  }, [projectId, reset])
  
  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    setError(null)
    
    // Validate data
    const result = projectSchema.safeParse(data)
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'بيانات غير صالحة')
      setIsLoading(false)
      return
    }
    
    try {
      const supabase = createClient()
      const updateData = {
        title_ar: data.title_ar,
        title_en: data.title_en,
        summary_ar: data.summary_ar,
        summary_en: data.summary_en,
        description_ar: data.description_ar || null,
        description_en: data.description_en || null,
        slug: data.slug,
        repo_url: data.repo_url || null,
        live_url: data.live_url || null,
        cover_image_path: coverImage || null,
        features_ar: featuresAr.length > 0 ? featuresAr : null,
        features_en: featuresEn.length > 0 ? featuresEn : null,
        featured: data.featured,
        published: data.published,
        sort_order: data.sort_order,
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('projects')
        .update(updateData)
        .eq('id', projectId)
      
      if (updateError) {
        setError(updateError.message)
        return
      }

      // Update project technologies - delete existing and insert new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('project_tech')
        .delete()
        .eq('project_id', projectId)

      if (selectedTech.length > 0) {
        const techInserts = selectedTech.map((techId) => ({
          project_id: projectId,
          tech_id: techId,
        }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: techError } = await (supabase as any)
          .from('project_tech')
          .insert(techInserts)

        if (techError) {
          console.error('Tech insert error:', techError)
        }
      }

      // Handle screenshots - delete existing and insert new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('project_screenshots')
        .delete()
        .eq('project_id', projectId)

      if (screenshots.length > 0) {
        const screenshotInserts = screenshots.map((s) => ({
          project_id: projectId,
          image_path: s.image_path,
          caption_ar: s.caption_ar || null,
          caption_en: s.caption_en || null,
          sort_order: s.sort_order,
        }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: screenshotError } = await (supabase as any)
          .from('project_screenshots')
          .insert(screenshotInserts)

        if (screenshotError) {
          console.error('Screenshot insert error:', screenshotError)
        }
      }
      
      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/projects"
          className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-light transition-colors"
        >
          <ArrowRight size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            تعديل المشروع
          </h1>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="title_ar"
                label="العنوان (عربي)"
                placeholder="اسم المشروع بالعربية"
                error={errors.title_ar?.message}
                {...register('title_ar')}
              />
              <Input
                id="title_en"
                label="Title (English)"
                placeholder="Project name in English"
                error={errors.title_en?.message}
                {...register('title_en')}
              />
            </div>
            
            {/* Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                id="summary_ar"
                label="الملخص (عربي)"
                placeholder="وصف مختصر للمشروع"
                error={errors.summary_ar?.message}
                {...register('summary_ar')}
              />
              <Textarea
                id="summary_en"
                label="Summary (English)"
                placeholder="Short project description"
                error={errors.summary_en?.message}
                {...register('summary_en')}
              />
            </div>
            
            {/* Slug */}
            <Input
              id="slug"
              label="الرابط المختصر (Slug)"
              placeholder="project-name"
              error={errors.slug?.message}
              {...register('slug')}
            />
            
            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="repo_url"
                label="رابط المستودع (اختياري)"
                placeholder="https://github.com/..."
                error={errors.repo_url?.message}
                {...register('repo_url')}
              />
              <Input
                id="live_url"
                label="رابط المعاينة (اختياري)"
                placeholder="https://..."
                error={errors.live_url?.message}
                {...register('live_url')}
              />
            </div>

            {/* Cover Image */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">صور المشروع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={coverImage}
                  onChange={setCoverImage}
                  onRemove={() => setCoverImage('')}
                  folder="covers"
                  label="صورة الغلاف"
                  aspectRatio="video"
                />
              </div>
            </div>

            {/* Screenshots */}
            <div className="border-t border-border pt-6">
              <ScreenshotsUpload
                value={screenshots}
                onChange={setScreenshots}
                folder="screenshots"
                label="لقطات شاشة التطبيق"
                maxFiles={10}
              />
            </div>

            {/* Technologies */}
            <div className="border-t border-border pt-6">
              <TechSelector
                value={selectedTech}
                onChange={setSelectedTech}
              />
            </div>

            {/* Key Features */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">المميزات الرئيسية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeaturesInput
                  label="المميزات (عربي)"
                  value={featuresAr}
                  onChange={setFeaturesAr}
                  placeholder="أضف ميزة بالعربية..."
                />
                <FeaturesInput
                  label="Features (English)"
                  value={featuresEn}
                  onChange={setFeaturesEn}
                  placeholder="Add a feature in English..."
                />
              </div>
            </div>
            
            {/* Options */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary"
                  {...register('featured')}
                />
                <span className="text-foreground">مشروع مميز</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary"
                  {...register('published')}
                />
                <span className="text-foreground">منشور</span>
              </label>
              
              <div className="flex items-center gap-2">
                <label className="text-foreground">الترتيب:</label>
                <input
                  type="number"
                  className="w-20 px-3 py-2 rounded-lg bg-surface border border-border text-foreground"
                  {...register('sort_order', { valueAsNumber: true })}
                />
              </div>
            </div>
            
            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Link href="/admin/projects">
                <Button variant="secondary">إلغاء</Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                <Save size={20} />
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
