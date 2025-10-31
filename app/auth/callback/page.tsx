import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CallbackPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const code = searchParams.code as string

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirect('/')
    }
  }

  return redirect('/auth/login?message=Could not log in')
}
