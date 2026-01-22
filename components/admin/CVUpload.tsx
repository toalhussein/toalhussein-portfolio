'use client'

import { useState } from 'react'
import { Upload, Trash2, FileText, Loader2, CheckCircle2, Download, AlertCircle } from 'lucide-react'
import { uploadCV, deleteCV } from '@/lib/actions/cv'
import { Button } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'

interface CVUploadProps {
  currentCVUrl: string | null
}

export function CVUpload({ currentCVUrl }: CVUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsUploading(true)

    const formData = new FormData(e.currentTarget)
    const result = await uploadCV(formData)

    setIsUploading(false)

    if (result.success) {
      setSuccess('تم رفع السيرة الذاتية بنجاح!')
      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      setError(result.error || 'فشل رفع السيرة الذاتية')
    }
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف السيرة الذاتية؟')) {
      return
    }

    setError(null)
    setSuccess(null)
    setIsDeleting(true)

    const result = await deleteCV()

    setIsDeleting(false)

    if (result.success) {
      setSuccess('تم حذف السيرة الذاتية بنجاح!')
      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      setError(result.error || 'فشل حذف السيرة الذاتية')
    }
  }

  return (
    <div className="space-y-6">
      {/* Current CV Status */}
      <AnimatePresence mode="wait">
        {currentCVUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20">
                      <FileText className="text-primary" size={24} />
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-lg">السيرة الذاتية الحالية</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-xs font-medium text-green-500">مرفوعة</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground-secondary">ملف PDF متاح للتحميل</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={currentCVUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                    >
                      <Download size={16} />
                      <span className="text-sm">معاينة</span>
                    </motion.button>
                  </a>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="border-red-500/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>حذف</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative bg-gradient-to-br from-surface via-surface to-surface/50 p-6 rounded-xl border-2 border-border hover:border-primary/20 transition-all duration-300 shadow-lg">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* Upload Area */}
            <div>
              <label htmlFor="cv" className="block text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                {currentCVUrl ? 'رفع سيرة ذاتية جديدة' : 'رفع السيرة الذاتية'}
              </label>
              
              <div className="relative">
                {/* Custom file input styling */}
                <div className="relative group/input">
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept="application/pdf"
                    required
                    disabled={isUploading}
                    className="block w-full text-sm text-foreground
                      file:me-4 file:py-3 file:px-6
                      file:rounded-lg file:border-0
                      file:text-sm file:font-bold
                      file:bg-gradient-to-r file:from-primary file:to-accent
                      file:text-white
                      hover:file:from-primary/90 hover:file:to-accent/90
                      file:cursor-pointer file:transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      bg-surface-light rounded-lg border-2 border-dashed border-border
                      hover:border-primary/50 transition-all p-4
                      cursor-pointer"
                  />
                </div>
                
                {/* Helper text */}
                <div className="mt-3 flex items-start gap-2 text-xs text-foreground-secondary">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <p>
                    ملفات PDF فقط • الحد الأقصى للحجم 5 ميجابايت
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="primary"
                disabled={isUploading}
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>{currentCVUrl ? 'استبدال السيرة الذاتية' : 'رفع السيرة الذاتية'}</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/20 text-red-500 px-5 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 text-green-500 px-5 py-4 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
              <p className="font-medium">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
