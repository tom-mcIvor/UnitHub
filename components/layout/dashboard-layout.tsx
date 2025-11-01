"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleOpenAuth = () => {
    setShowSignUp(false)
    setAuthOpen(true)
  }

  const handleSignedIn = () => {
    setAuthOpen(false)
    setShowSignUp(false)
    router.refresh()
  }

  const handleSwitchToSignUp = () => {
    setShowSignUp(true)
  }

  const handleSwitchToSignIn = () => {
    setShowSignUp(false)
  }

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onAuthClick={handleOpenAuth} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-md">
          <DialogTitle className="sr-only">{showSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
          {showSignUp ? (
            <SignUpForm onSignedUp={handleSignedIn} onSwitchToSignIn={handleSwitchToSignIn} />
          ) : (
            <SignInForm onSignedIn={handleSignedIn} onSwitchToSignUp={handleSwitchToSignUp} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
