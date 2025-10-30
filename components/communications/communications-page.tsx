"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CommunicationForm } from "./communication-form"
import { Plus, Search, Trash2 } from "lucide-react"
import type { CommunicationLogWithTenant } from "@/app/actions/communications"
import type { Tenant } from "@/lib/types"

interface CommunicationsPageProps {
  initialCommunications: CommunicationLogWithTenant[]
  tenants: Tenant[]
  error: string | null
}

export function CommunicationsPage({ initialCommunications, tenants, error }: CommunicationsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "email" | "phone" | "in-person" | "message">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const communications = initialCommunications

  const filteredCommunications = communications.filter((comm) => {
    const matchesType = filterType === "all" || comm.type === filterType
    const matchesSearch =
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.unitNumber.includes(searchTerm)
    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧"
      case "phone":
        return "☎️"
      case "in-person":
        return "👤"
      case "message":
        return "💬"
      default:
        return "📝"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-700"
      case "phone":
        return "bg-green-100 text-green-700"
      case "in-person":
        return "bg-purple-100 text-purple-700"
      case "message":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Communication Log</h1>
          <p className="text-text-secondary mt-1">Track all tenant interactions and communications</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Log Communication
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">Error loading communications: {error}</p>
        </Card>
      )}

      {showForm && <CommunicationForm onClose={() => setShowForm(false)} tenants={tenants} />}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Total</p>
          <p className="text-3xl font-bold text-text mt-2">{communications.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Emails</p>
          <p className="text-3xl font-bold text-text mt-2">{communications.filter((c) => c.type === "email").length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Calls</p>
          <p className="text-3xl font-bold text-text mt-2">{communications.filter((c) => c.type === "phone").length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">In-Person</p>
          <p className="text-3xl font-bold text-text mt-2">
            {communications.filter((c) => c.type === "in-person").length}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Messages</p>
          <p className="text-3xl font-bold text-text mt-2">
            {communications.filter((c) => c.type === "message").length}
          </p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by subject, tenant, or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "email", "phone", "in-person", "message"] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                size="sm"
              >
                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Communications Timeline */}
        <div className="space-y-3">
          {filteredCommunications.map((comm, index) => (
            <div key={comm.id} className="relative">
              {index !== filteredCommunications.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
              )}

              <div className="flex gap-4 p-4 bg-surface rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${getTypeColor(comm.type)}`}
                  >
                    {getTypeIcon(comm.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-medium text-text">{comm.subject}</p>
                      <p className="text-sm text-text-secondary">
                        {comm.tenantName} • Unit {comm.unitNumber}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getTypeColor(comm.type)}`}
                    >
                      {comm.type.charAt(0).toUpperCase() + comm.type.slice(1).replace("-", " ")}
                    </span>
                  </div>

                  <p className="text-sm text-text mb-2 line-clamp-2">{comm.content}</p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-secondary">{formatDate(comm.createdAt)}</p>
                    <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCommunications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No communications found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
