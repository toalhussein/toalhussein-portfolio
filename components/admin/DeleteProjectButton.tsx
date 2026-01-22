'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui'

interface DeleteProjectButtonProps {
  projectId: string
  projectTitle: string
}

export function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const supabase = createClient()
      
      // Delete screenshots first (cascade should handle this, but let's be safe)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('project_screenshots')
        .delete()
        .eq('project_id', projectId)
      
      // Delete project
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('projects')
        .delete()
        .eq('id', projectId)
      
      if (error) {
        console.error('Delete error:', error)
        return
      }
      
      router.refresh()
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-surface border border-border rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-bold text-foreground mb-2">
            تأكيد الحذف
          </h3>
          <p className="text-foreground-secondary mb-4">
            هل أنت متأكد من حذف المشروع &quot;{projectTitle}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
            >
              <X size={18} />
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 size={18} />
              حذف
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 rounded-lg text-foreground-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
    >
      <Trash2 size={18} />
    </button>
  )
}
