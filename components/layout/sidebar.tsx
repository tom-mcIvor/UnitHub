"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, DollarSign, Wrench, FileText, MessageSquare, Settings, X } from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenants", label: "Tenants", icon: Users },
  { href: "/rent", label: "Rent Tracking", icon: DollarSign },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/communications", label: "Communications", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 h-screen bg-primary text-white transition-transform duration-300 z-50 md:z-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">UnitHub</h1>
          <button onClick={onToggle} className="md:hidden p-1 hover:bg-primary-dark rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive ? "bg-primary-light text-white" : "text-white/80 hover:bg-primary-dark",
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
