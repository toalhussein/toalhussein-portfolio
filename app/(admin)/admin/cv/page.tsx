import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCV } from '@/lib/actions/cv'
import { CVUpload } from '@/components/admin/CVUpload'
import { Card, CardContent } from '@/components/ui'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'إدارة السيرة الذاتية | لوحة التحكم',
  description: 'إدارة ملف السيرة الذاتية',
}

export default async function CVPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') {
    redirect('/admin')
  }

  const currentCVUrl = await getCurrentCV()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-2xl opacity-50" />
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            إدارة السيرة الذاتية
          </h1>
          <p className="text-foreground-secondary text-lg">
            قم برفع وإدارة ملف السيرة الذاتية الخاصة بك. سيكون ملف السيرة الذاتية متاحاً للتحميل في صفحة البورتفوليو.
          </p>
        </div>
      </div>

      {/* CV Upload Card */}
      <Card className="overflow-hidden border-2">
        <div className="bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-lg" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
                <FileText className="text-primary" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">ملف السيرة الذاتية</h2>
              <p className="text-foreground-secondary">
                ارفع سيرتك الذاتية بصيغة PDF
              </p>
            </div>
          </div>

          <CVUpload currentCVUrl={currentCVUrl} />
        </div>
      </Card>

      {/* Instructions */}
      <Card className="border-2 overflow-hidden">
        <div className="bg-gradient-to-br from-surface via-surface to-surface/50 p-8">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary">📋</span>
            </div>
            التعليمات
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">1</span>
              </div>
              <span className="text-foreground-secondary group-hover:text-foreground transition-colors">
                يتم قبول ملفات PDF فقط بحد أقصى 5 ميجابايت
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">2</span>
              </div>
              <span className="text-foreground-secondary group-hover:text-foreground transition-colors">
                رفع سيرة ذاتية جديدة سيستبدل السيرة الذاتية الحالية
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">3</span>
              </div>
              <span className="text-foreground-secondary group-hover:text-foreground transition-colors">
                سيظهر زر تحميل السيرة الذاتية في القسم الرئيسي من البورتفوليو
              </span>
            </li>
            <li className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-sm">4</span>
              </div>
              <span className="text-foreground-secondary group-hover:text-foreground transition-colors">
                تأكد من تحديث سيرتك الذاتية قبل رفعها
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
