"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Wrench, User, Calendar } from "lucide-react"
import Link from "next/link"
import type { MaintenanceRequestWithTenant } from "@/app/actions/maintenance"

interface MaintenanceDetailProps {
  request: MaintenanceRequestWithTenant
}

export function MaintenanceDetail({ request }: MaintenanceDetailProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatCost = (amount?: number) => {
    if (amount === undefined || amount === null) return null
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const estimatedCost = formatCost(request.estimatedCost)
  const actualCost = formatCost(request.actualCost)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/maintenance">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={20} />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text">{request.title}</h1>
          <p className="text-text-secondary mt-1">Unit {request.unitNumber || 'N/A'}</p>
        </div>
        <Button className="gap-2">
          <Edit2 size={20} />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Status and Priority */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text">Status</h2>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-sm text-text-secondary mb-2">Current Status</p>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("-", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Priority</p>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Description</h2>
            <p className="text-text leading-relaxed">{request.description}</p>
          </Card>

          {/* Cost Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Cost Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg">
                <p className="text-sm text-text-secondary mb-1">Estimated Cost</p>
                <p className="text-2xl font-bold text-text">{estimatedCost ? `$${estimatedCost}` : '-'}</p>
              </div>
              <div className="p-4 bg-surface rounded-lg">
                <p className="text-sm text-text-secondary mb-1">Actual Cost</p>
                <p className="text-2xl font-bold text-text">{actualCost ? `$${actualCost}` : '-'}</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Created</p>
                  <p className="text-text font-medium">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Last Updated</p>
                  <p className="text-text font-medium">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Tenant</h2>
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Name</p>
                <p className="text-text font-medium">{request.tenantName || 'Unknown'}</p>
              </div>
            </div>
            <Link href={`/tenants/${request.tenantId}`}>
              <Button variant="outline" className="w-full bg-transparent">
                View Tenant
              </Button>
            </Link>
          </Card>

          {/* Category */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Category</h2>
            <div className="flex items-center gap-3">
              <Wrench size={20} className="text-primary" />
              <p className="text-text font-medium">{request.category}</p>
            </div>
          </Card>

          {/* Vendor */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Assigned Vendor</h2>
            {request.assignedVendor ? (
              <div className="flex items-center gap-3">
                <User size={20} className="text-primary" />
                <p className="text-text font-medium">{request.assignedVendor}</p>
              </div>
            ) : (
              <p className="text-text-secondary">No vendor assigned</p>
            )}
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Update Status
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Assign Vendor
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Add Photos
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
