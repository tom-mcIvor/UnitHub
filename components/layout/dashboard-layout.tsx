"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)

  const handleOpenAuth = () => setAuthOpen(true)
  const handleSignedIn = () => {
    setAuthOpen(false)
    router.refresh()
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
          <SignInForm onSignedIn={handleSignedIn} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
