import Link from 'next/link'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Plus, Edit2, Star, Eye, EyeOff } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { DeleteProjectButton } from '@/components/admin'
import { Project } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const supabase = await createServerClient()
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  
  const projectList = (projects || []) as Project[]
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            إدارة المشاريع
          </h1>
          <p className="text-foreground-secondary">
            إضافة وتعديل وحذف المشاريع
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary">
            <Plus size={20} />
            إضافة مشروع
          </Button>
        </Link>
      </div>
      
      {/* Projects Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light border-b border-border">
              <tr>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">العنوان</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الترتيب</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الحالة</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">مميز</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projectList.length > 0 ? (
                projectList.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0 hover:bg-surface-light transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{project.title_ar}</p>
                        <p className="text-sm text-foreground-secondary">{project.title_en}</p>
                      </div>
                    </td>
                    <td className="p-4 text-foreground-secondary">{project.sort_order}</td>
                    <td className="p-4">
                      {project.published ? (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <Eye size={12} />
                          منشور
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="flex items-center gap-1 w-fit">
                          <EyeOff size={12} />
                          مسودة
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {project.featured && (
                        <Star size={18} className="text-yellow-400 fill-yellow-400" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-2 rounded-lg text-foreground-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteProjectButton 
                          projectId={project.id} 
                          projectTitle={project.title_ar} 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground-secondary">
                    لا توجد مشاريع بعد. أضف مشروعك الأول!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
