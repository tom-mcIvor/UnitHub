'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/')
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/')
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase])

  const message = searchParams?.get('message')
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-4">
      {message && <p className="text-sm text-red-500 text-center">{message}</p>}
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        providers={[]}
        onlyThirdPartyProviders={false}
        redirectTo={redirectTo}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#15803d',
                brandAccent: '#166534',
              },
            },
          },
        }}
      />
    </div>
  )
}
