import { createClient as createServerClient } from '@/lib/supabase/server'
import { Message } from '@/types'
import { MessagesList } from '@/components/admin/MessagesList'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const supabase = await createServerClient()
  
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  const messageList = (messages || []) as Message[]
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            صندوق الرسائل
          </h1>
          <p className="text-foreground-secondary">
            الرسائل الواردة من نموذج التواصل
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
            الكل
          </button>
          <button className="px-4 py-2 rounded-lg text-foreground-secondary hover:bg-surface-light">
            جديد
          </button>
        </div>
      </div>
      
      <MessagesList messages={messageList} />
    </div>
  )
}
