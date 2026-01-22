import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { contactFormSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = contactFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }
    
    const { name, email, subject, message } = validationResult.data
    const locale = body.locale || 'ar'
    
    // Get client IP hash for abuse prevention (optional)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const ipHash = await hashIP(ip)
    
    // Insert message into database
    const supabase = await createServerClient()
    const insertData = {
      name,
      email,
      subject,
      message,
      locale,
      status: 'new',
      ip_hash: ipHash,
    }
    
    const { error } = await supabase.from('messages').insert(insertData as never)
    
    if (error) {
      console.error('Failed to save message:', error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple hash function for IP (for abuse prevention, not security)
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}
