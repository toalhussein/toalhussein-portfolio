'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { deleteWork } from '@/lib/actions/works'

interface DeleteWorkButtonProps {
  workId: string
  workTitle: string
}

export function DeleteWorkButton({ workId, workTitle }: DeleteWorkButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const result = await deleteWork(workId)
      
      if (result.success) {
        router.refresh()
        setShowConfirm(false)
      } else {
        console.error('Delete error:', result.error)
        alert('حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('حدث خطأ أثناء الحذف. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsDeleting(false)
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
            هل أنت متأكد من حذف العمل &quot;{workTitle}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
      aria-label="حذف العمل"
    >
      <Trash2 size={18} />
    </button>
  )
}
