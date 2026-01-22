'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function createWork(formData: FormData) {
  const supabase = await createServerClient()
  
  const workData = {
    company_or_client: formData.get('company_or_client') as string,
    role_title_ar: formData.get('role_title_ar') as string,
    role_title_en: formData.get('role_title_en') as string,
    description_ar: (formData.get('description_ar') as string) || null,
    description_en: (formData.get('description_en') as string) || null,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    published: formData.get('published') === 'true',
    sort_order: 0,
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('works')
    .insert(workData)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/admin/works')
  redirect('/admin/works')
}

export async function updateWork(id: string, formData: FormData) {
  const supabase = await createServerClient()
  
  const workData = {
    company_or_client: formData.get('company_or_client') as string,
    role_title_ar: formData.get('role_title_ar') as string,
    role_title_en: formData.get('role_title_en') as string,
    description_ar: (formData.get('description_ar') as string) || null,
    description_en: (formData.get('description_en') as string) || null,
    start_date: formData.get('start_date') as string,
    end_date: (formData.get('end_date') as string) || null,
    published: formData.get('published') === 'true',
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('works')
    .update(workData)
    .eq('id', id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/admin/works')
  redirect('/admin/works')
}

export async function deleteWork(id: string) {
  try {
    const supabase = await createServerClient()
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('works')
      .delete()
      .eq('id', id)
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    revalidatePath('/admin/works')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete work' }
  }
}
