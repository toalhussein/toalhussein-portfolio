import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin'
import { Profile } from '@/types'

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Check if user is authenticated and is admin
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Middleware handles the redirect for non-authenticated users
  // Here we just need to get user info for the header
  let displayName: string | null = null
  
  if (user) {
    try {
      // Try to get profile, but don't fail if table doesn't exist
      const { data } = await supabase
        .from('profiles')
        .select('role, display_name')
        .eq('id', user.id)
        .single()
      
      const profile = data as Profile | null
      displayName = profile?.display_name || null
      
      // If we have a profile and user is not admin, redirect
      if (profile && profile.role !== 'admin') {
        redirect('/admin/login')
      }
    } catch (error) {
      // Table might not exist yet, continue without profile check
      console.warn('Could not fetch profile:', error)
    }
  }
  
  return (
    <AdminLayoutClient 
      user={{ email: user?.email || '', displayName }}
    >
      {children}
    </AdminLayoutClient>
      
  )
}
