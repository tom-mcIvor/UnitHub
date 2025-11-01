import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful authentication, redirect to home
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    }

    console.error('OAuth callback error:', error)
    // Redirect to login with error message
    return NextResponse.redirect(
      new URL(`/auth/login?message=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }

  // No code present, redirect to login
  return NextResponse.redirect(
    new URL('/auth/login?message=No authentication code provided', requestUrl.origin)
  )
}
