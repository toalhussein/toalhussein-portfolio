'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadCV(formData: FormData) {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') {
    return { success: false, error: 'Not authorized' }
  }

  const file = formData.get('cv') as File
  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  // Validate file type (PDF only)
  if (file.type !== 'application/pdf') {
    return { success: false, error: 'Only PDF files are allowed' }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 5MB' }
  }

  try {
    // Delete old CV file if exists
    const { data: oldProfile } = await supabase
      .from('profiles')
      .select('cv_url')
      .eq('id', user.id)
      .single()

    if ((oldProfile as any)?.cv_url) {
      const oldFileName = (oldProfile as any).cv_url.split('/').pop()
      if (oldFileName) {
        await supabase.storage
          .from('cv-files')
          .remove([oldFileName])
      }
    }

    // Upload new CV file
    const fileName = `cv-${user.id}-${Date.now()}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('cv-files')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cv-files')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' }
    }

    // Update profile with new CV URL
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({ cv_url: urlData.publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return { success: false, error: updateError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('CV upload error:', error)
    return { success: false, error: 'Failed to upload CV' }
  }
}

export async function deleteCV() {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, cv_url')
    .eq('id', user.id)
    .single()

  if ((profile as any)?.role !== 'admin') {
    return { success: false, error: 'Not authorized' }
  }

  if (!(profile as any).cv_url) {
    return { success: false, error: 'No CV to delete' }
  }

  try {
    // Delete file from storage
    const fileName = (profile as any).cv_url.split('/').pop()
    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from('cv-files')
        .remove([fileName])

      if (deleteError) {
        console.error('Delete error:', deleteError)
      }
    }

    // Remove CV URL from profile
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({ cv_url: null })
      .eq('id', user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('CV delete error:', error)
    return { success: false, error: 'Failed to delete CV' }
  }
}

export async function getCurrentCV() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_url')
    .eq('id', user.id)
    .single()

  return (profile as any)?.cv_url || null
}

export async function getPublicCV() {
  const supabase = await createClient()

  // Get any admin's CV (assuming single admin/owner)
  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_url')
    .eq('role', 'admin')
    .single()

  return (profile as any)?.cv_url || null
}
