'use client'

import { X, Mail, Calendar, User } from 'lucide-react'
import { Message } from '@/types'
import { formatDate } from '@/lib/utils'

interface MessageDialogProps {
  message: Message | null
  onClose: () => void
}

export function MessageDialog({ message, onClose }: MessageDialogProps) {
  if (!message) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">تفاصيل الرسالة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Sender Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <User size={18} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-foreground-secondary mb-1">الاسم</p>
                <p className="text-foreground font-medium">{message.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-foreground-secondary mb-1">البريد الإلكتروني</p>
                <p className="text-foreground font-medium">{message.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-foreground-secondary mb-1">تاريخ الإرسال</p>
                <p className="text-foreground font-medium">
                  {formatDate(message.created_at, 'ar')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Subject */}
          <div className="mb-6">
            <p className="text-sm text-foreground-secondary mb-2">الموضوع</p>
            <p className="text-lg font-semibold text-foreground">{message.subject}</p>
          </div>
          
          {/* Message Body */}
          <div>
            <p className="text-sm text-foreground-secondary mb-2">الرسالة</p>
            <div className="p-4 bg-surface-light rounded-lg border border-border">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-light text-foreground hover:bg-surface-lighter transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
