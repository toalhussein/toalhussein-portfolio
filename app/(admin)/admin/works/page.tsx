import Link from 'next/link'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { DeleteWorkButton } from '@/components/admin'
import { formatDate } from '@/lib/utils'
import { Work } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminWorksPage() {
  const supabase = await createServerClient()
  
  const { data: works } = await supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })
  
  const workList = (works || []) as Work[]
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            إدارة الأعمال
          </h1>
          <p className="text-foreground-secondary">
            إضافة وتعديل خبراتك وأعمالك السابقة
          </p>
        </div>
        <Link href="/admin/works/new">
          <Button variant="primary">
            <Plus size={20} />
            إضافة عمل
          </Button>
        </Link>
      </div>
      
      {/* Works Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-light border-b border-border">
              <tr>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الشركة/العميل</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">المسمى الوظيفي</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الفترة</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الحالة</th>
                <th className="text-start p-4 text-sm font-medium text-foreground-secondary">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {workList.length > 0 ? (
                workList.map((work) => (
                  <tr key={work.id} className="border-b border-border last:border-0 hover:bg-surface-light transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      {work.company_or_client}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-foreground">{work.role_title_ar}</p>
                        <p className="text-sm text-foreground-secondary">{work.role_title_en}</p>
                      </div>
                    </td>
                    <td className="p-4 text-foreground-secondary text-sm">
                      {formatDate(work.start_date, 'ar')} - {work.end_date ? formatDate(work.end_date, 'ar') : 'حتى الآن'}
                    </td>
                    <td className="p-4">
                      {work.published ? (
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/works/${work.id}`}
                          className="p-2 rounded-lg text-foreground-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteWorkButton 
                          workId={work.id} 
                          workTitle={work.company_or_client}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-foreground-secondary">
                    لا توجد أعمال بعد. أضف عملك الأول!
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
