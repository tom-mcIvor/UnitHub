"use client"

import { Menu, Bell, User } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-surface rounded-lg">
        <Menu size={24} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface rounded-lg relative">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        <button className="p-2 hover:bg-surface rounded-lg">
          <User size={20} className="text-text-secondary" />
        </button>
      </div>
    </header>
  )
}
