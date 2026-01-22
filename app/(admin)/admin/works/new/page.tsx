import Link from 'next/link'
import { ArrowRight, Save } from 'lucide-react'
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui'
import { createWork } from '@/lib/actions/works'

export default function NewWorkPage() {
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
            إضافة عمل جديد
          </h1>
          <p className="text-foreground-secondary mt-1">
            أضف تفاصيل خبرتك أو عملك السابق
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <form action={createWork} className="space-y-6">
            {/* Company/Client */}
            <Input
              id="company_or_client"
              name="company_or_client"
              label="الشركة أو العميل"
              required
              placeholder="مثال: شركة التقنية المتقدمة"
            />
            
            {/* Role Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="role_title_ar"
                name="role_title_ar"
                label="المسمى الوظيفي (عربي)"
                required
                placeholder="مثال: مطور تطبيقات الجوال"
              />
              <Input
                id="role_title_en"
                name="role_title_en"
                label="المسمى الوظيفي (إنجليزي)"
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
                rows={5}
                placeholder="وصف مختصر لمسؤولياتك وإنجازاتك..."
              />
              <Textarea
                id="description_en"
                name="description_en"
                label="الوصف (إنجليزي)"
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
                    required
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    id="end_date"
                    name="end_date"
                    label="تاريخ النهاية (اختياري)"
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
                  value="true"
                  defaultChecked
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
              <Button type="submit" variant="primary">
                <Save size={20} />
                حفظ العمل
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
