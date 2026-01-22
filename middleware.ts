import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { locales, defaultLocale } from '@/lib/i18n'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes, and admin auth callback
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next()
  }
  
  // Check if pathname starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  // Redirect if no locale in pathname (except for admin routes)
  if (!pathnameHasLocale && !pathname.startsWith('/admin')) {
    const locale = defaultLocale
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
  
  // For admin routes, check authentication
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const { supabaseResponse, user } = await updateSession(request)
    
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return supabaseResponse
  }
  
  // Update Supabase session for authenticated routes
  const { supabaseResponse } = await updateSession(request)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
