import { createClient as createServerClient } from '@/lib/supabase/server'
import { AdminStatsGrid } from '@/components/admin/AdminStatsGrid'
import { FolderGit2, Briefcase, Mail } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()
  
  // Fetch stats
  const [projectsResult, worksResult, messagesResult] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('works').select('id', { count: 'exact', head: true }),
    supabase.from('messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])
  
  const statsData = {
    projects: projectsResult.count || 0,
    works: worksResult.count || 0,
    messages: messagesResult.count || 0,
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          لوحة التحكم
        </h1>
        <p className="text-foreground-secondary">
          مرحباً بعودتك! إليك نظرة عامة على موقعك.
        </p>
      </div>
      
      {/* Stats Grid */}
      <AdminStatsGrid stats={statsData} />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-surface border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            إجراءات سريعة
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/projects/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-light hover:bg-primary/10 hover:border-primary/30 border border-border transition-colors"
            >
              <FolderGit2 size={20} className="text-primary" />
              <span>إضافة مشروع جديد</span>
            </a>
            <a
              href="/admin/works/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-light hover:bg-primary/10 hover:border-primary/30 border border-border transition-colors"
            >
              <Briefcase size={20} className="text-primary" />
              <span>إضافة عمل جديد</span>
            </a>
            <a
              href="/admin/messages"
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-light hover:bg-primary/10 hover:border-primary/30 border border-border transition-colors"
            >
              <Mail size={20} className="text-primary" />
              <span>عرض الرسائل</span>
            </a>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-surface border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            آخر الرسائل
          </h2>
          <p className="text-foreground-secondary">
            سيتم عرض آخر الرسائل هنا
          </p>
        </div>
      </div>
    </div>
  )
}
