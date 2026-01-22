'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function deleteMessage(messageId: string) {
  try {
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    revalidatePath('/admin/messages')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete message' }
  }
}
