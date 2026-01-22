'use client'

import { useState, useTransition } from 'react'
import { Mail, Trash2, Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Message } from '@/types'
import { MessageDialog } from './MessageDialog'
import { deleteMessage } from '@/lib/actions/messages'

interface MessagesListProps {
  messages: Message[]
}

export function MessagesList({ messages }: MessagesListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isPending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  const statusConfig = {
    new: { label: 'جديد', variant: 'primary' as const, icon: Mail },
    read: { label: 'مقروء', variant: 'default' as const, icon: Eye },
  }
  
  const handleDelete = async (messageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      return
    }
    
    setProcessingId(messageId)
    startTransition(async () => {
      const result = await deleteMessage(messageId)
      if (!result.success) {
        alert('فشل في حذف الرسالة')
      }
      setProcessingId(null)
    })
  }
  
  const handleView = async (message: Message) => {
    setSelectedMessage(message)
  }
  
  return (
    <>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const status = statusConfig[message.status as keyof typeof statusConfig]
            
            // Skip archived messages
            if (!status) return null
            
            const StatusIcon = status.icon
            
            return (
              <div
                key={message.id}
                className={`p-6 rounded-xl bg-surface border transition-all duration-300 hover:border-primary/30 ${
                  message.status === 'new' ? 'border-primary/50 shadow-glow-sm' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{message.name}</h3>
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        <StatusIcon size={12} />
                        {status.label}
                      </Badge>
                      <span className="text-xs text-foreground-secondary flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(message.created_at, 'ar')}
                      </span>
                    </div>
                    
                    {/* Email */}
                    <p className="text-sm text-foreground-secondary mb-2">
                      {message.email}
                    </p>
                    
                    {/* Subject */}
                    <p className="font-medium text-foreground mb-2">
                      {message.subject}
                    </p>
                    
                    {/* Message preview */}
                    <p className="text-foreground-secondary line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleView(message)}
                      disabled={processingId === message.id}
                      className="p-2 rounded-lg text-foreground-secondary hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="عرض التفاصيل"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(message.id)}
                      disabled={processingId === message.id}
                      className="p-2 rounded-lg text-foreground-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-12 text-center bg-surface border border-border rounded-xl">
            <Mail size={48} className="mx-auto text-foreground-secondary mb-4" />
            <p className="text-foreground-secondary">
              لا توجد رسائل بعد
            </p>
          </div>
        )}
      </div>
      
      <MessageDialog 
        message={selectedMessage} 
        onClose={() => setSelectedMessage(null)} 
      />
    </>
  )
}
