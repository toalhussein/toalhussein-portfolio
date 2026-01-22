'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Save, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui'
import Link from 'next/link'
import { Work } from '@/types'

export default function EditWorkPage() {
  const router = useRouter()
  const params = useParams()
  const workId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    company_or_client: '',
    role_title_ar: '',
    role_title_en: '',
    description_ar: '',
    description_en: '',
    start_date: '',
    end_date: '',
    published: true,
  })

  // Fetch work data
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const supabase = createClient()
        
        const { data: work, error: workError } = await (supabase as any)
          .from('works')
          .select('*')
          .eq('id', workId)
          .single()
        
        if (workError) throw workError
        
        const workData = work as Work
        
        // Set form values
        setFormData({
          company_or_client: workData.company_or_client || '',
          role_title_ar: workData.role_title_ar || '',
          role_title_en: workData.role_title_en || '',
          description_ar: workData.description_ar || '',
          description_en: workData.description_en || '',
          start_date: workData.start_date || '',
          end_date: workData.end_date || '',
          published: workData.published ?? true,
        })
      } catch (err) {
        console.error('Error fetching work:', err)
        setError('فشل في تحميل بيانات العمل')
      } finally {
        setIsFetching(false)
      }
    }
    
    fetchWork()
  }, [workId])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const updateData = {
        company_or_client: formData.company_or_client,
        role_title_ar: formData.role_title_ar,
        role_title_en: formData.role_title_en,
        description_ar: formData.description_ar || null,
        description_en: formData.description_en || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        published: formData.published,
      }
      
      const { error: updateError } = await (supabase as any)
        .from('works')
        .update(updateData)
        .eq('id', workId)
      
      if (updateError) {
        setError(updateError.message)
        return
      }
      
      router.push('/admin/works')
      router.refresh()
    } catch (err) {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
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
          href="/admin/works"
          className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-light transition-colors"
        >
          <ArrowRight size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            تعديل العمل
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company/Client */}
            <Input
              id="company_or_client"
              name="company_or_client"
              label="الشركة أو العميل"
              value={formData.company_or_client}
              onChange={handleChange}
              required
              placeholder="مثال: شركة التقنية المتقدمة"
            />
            
            {/* Role Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="role_title_ar"
                name="role_title_ar"
                label="المسمى الوظيفي (عربي)"
                value={formData.role_title_ar}
                onChange={handleChange}
                required
                placeholder="مثال: مطور تطبيقات الجوال"
              />
              <Input
                id="role_title_en"
                name="role_title_en"
                label="المسمى الوظيفي (إنجليزي)"
                value={formData.role_title_en}
                onChange={handleChange}
                required
                placeholder="Mobile App Developer"
                dir="ltr"
              />
            </div>
            
            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Textarea
                id="description_ar"
                name="description_ar"
                label="الوصف (عربي)"
                value={formData.description_ar}
                onChange={handleChange}
                rows={5}
                placeholder="وصف مختصر لمسؤولياتك وإنجازاتك..."
              />
              <Textarea
                id="description_en"
                name="description_en"
                label="الوصف (إنجليزي)"
                value={formData.description_en}
                onChange={handleChange}
                rows={5}
                placeholder="Brief description of your responsibilities and achievements..."
                dir="ltr"
              />
            </div>
            
            {/* Dates */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">الفترة الزمنية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="date"
                    id="start_date"
                    name="start_date"
                    label="تاريخ البداية"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    id="end_date"
                    name="end_date"
                    label="تاريخ النهاية (اختياري)"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-foreground-secondary mt-2">اتركه فارغاً إذا كنت تعمل حالياً</p>
                </div>
              </div>
            </div>
            
            {/* Options */}
            <div className="flex flex-wrap gap-6 border-t border-border pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary"
                />
                <span className="text-foreground">منشور</span>
              </label>
            </div>
            
            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Link href="/admin/works">
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
