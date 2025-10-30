"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MaintenanceForm } from "./maintenance-form"
import { Plus, Search, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import type { MaintenanceRequestWithTenant } from "@/app/actions/maintenance"
import type { Tenant } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteMaintenanceRequest } from "@/app/actions/maintenance"
import { useRouter } from "next/navigation"

interface MaintenancePageProps {
  initialRequests: MaintenanceRequestWithTenant[]
  tenants: Tenant[]
  error: string | null
}

export function MaintenancePage({ initialRequests, tenants, error }: MaintenancePageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequestWithTenant | null>(null)
  const [deletingRequest, setDeletingRequest] = useState<MaintenanceRequestWithTenant | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "in-progress" | "completed" | "cancelled">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high" | "urgent">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const requests = initialRequests

  const handleEdit = (request: MaintenanceRequestWithTenant) => {
    setEditingRequest(request)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deletingRequest) return

    setIsDeleting(true)
    try {
      const result = await deleteMaintenanceRequest(deletingRequest.id)
      if (result.success) {
        router.refresh()
        setDeletingRequest(null)
      } else {
        alert(`Failed to delete request: ${result.error}`)
      }
    } catch (err) {
      console.error('Error deleting maintenance request:', err)
      alert('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingRequest(null)
  }

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.unitNumber.includes(searchTerm)
    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    open: requests.filter((r) => r.status === "open").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    urgent: requests.filter((r) => r.priority === "urgent").length,
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">Error loading maintenance requests: {error}</p>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Maintenance Requests</h1>
          <p className="text-text-secondary mt-1">Track and manage maintenance issues</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          New Request
        </Button>
      </div>

      {showForm && (
        <MaintenanceForm
          onClose={handleCloseForm}
          tenants={tenants}
          editingRequest={editingRequest || undefined}
          initialData={editingRequest ? {
            tenantId: editingRequest.tenantId,
            title: editingRequest.title,
            description: editingRequest.description,
            category: editingRequest.category,
            priority: editingRequest.priority,
            estimatedCost: editingRequest.estimatedCost || 0,
            assignedVendor: editingRequest.assignedVendor || '',
          } : undefined}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Open</p>
          <p className="text-3xl font-bold text-text mt-2">{stats.open}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">In Progress</p>
          <p className="text-3xl font-bold text-text mt-2">{stats.inProgress}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Completed</p>
          <p className="text-3xl font-bold text-text mt-2">{stats.completed}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Urgent</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.urgent}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by title, tenant, or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {(["all", "open", "in-progress", "completed", "cancelled"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  size="sm"
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">Priority</p>
            <div className="flex gap-2 flex-wrap">
              {(["all", "low", "medium", "high", "urgent"] as const).map((priority) => (
                <Button
                  key={priority}
                  variant={filterPriority === priority ? "default" : "outline"}
                  onClick={() => setFilterPriority(priority)}
                  size="sm"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Title</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Tenant</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Category</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Est. Cost</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4 font-medium text-text">{request.title}</td>
                  <td className="py-3 px-4 text-text-secondary">
                    {request.tenantName} (Unit {request.unitNumber})
                  </td>
                  <td className="py-3 px-4 text-text">{request.category}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.priority === "urgent"
                          ? "bg-red-100 text-red-700"
                          : request.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : request.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        request.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : request.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : request.status === "cancelled"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text">${request.estimatedCost}</td>
                  <td className="py-3 px-4 text-text-secondary">{request.assignedVendor || "-"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/maintenance/${request.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleEdit(request)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() => setDeletingRequest(request)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No maintenance requests found</p>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deletingRequest} onOpenChange={() => setDeletingRequest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Maintenance Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this maintenance request: <strong>{deletingRequest?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
