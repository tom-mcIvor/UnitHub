'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'

import { SignInForm } from '@/components/auth/sign-in-form'

function LoginPageContent() {
  const router = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <SignInForm onSignedIn={() => router.replace('/')} />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
