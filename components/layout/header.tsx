"use client"

import { Menu, Bell, User } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
  onAuthClick?: () => void
}

export function Header({ onMenuClick, onAuthClick }: HeaderProps) {
  const handleAuthClick = () => {
    onAuthClick?.()
  }

  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-surface rounded-lg">
        <Menu size={24} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button
          aria-label="View notifications"
          className="group relative rounded-lg p-2 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Bell size={20} className="text-text-secondary transition-colors group-hover:text-primary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        <button
          onClick={handleAuthClick}
          aria-label="Sign in to UnitHub"
          className="group rounded-lg p-2 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <User size={20} className="text-text-secondary transition-colors group-hover:text-primary" />
        </button>
      </div>
    </header>
  )
}
