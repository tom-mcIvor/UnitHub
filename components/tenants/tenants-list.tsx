"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TenantForm } from "./tenant-form"
import { Plus, Search, Edit2, Trash2, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
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
import { deleteTenant } from "@/app/actions/tenants"
import { useRouter } from "next/navigation"

interface TenantsListProps {
  initialTenants: Tenant[]
  error: string | null
}

export function TenantsList({ initialTenants, error }: TenantsListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUnit, setFilterUnit] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Use real data from database
  const tenants = initialTenants

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deletingTenant) return

    setIsDeleting(true)
    try {
      const result = await deleteTenant(deletingTenant.id)
      if (result.success) {
        router.refresh()
        setDeletingTenant(null)
      } else {
        alert(`Failed to delete tenant: ${result.error}`)
      }
    } catch (err) {
      console.error('Error deleting tenant:', err)
      alert('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTenant(null)
  }

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnit = !filterUnit || tenant.unitNumber === filterUnit
    return matchesSearch && matchesUnit
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Tenants</h1>
          <p className="text-text-secondary mt-1">Manage all your tenants and their information</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Add Tenant
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <p className="font-medium">Error loading tenants: {error}</p>
          </div>
        </Card>
      )}

      {showForm && (
        <TenantForm
          onClose={handleCloseForm}
          editingTenant={editingTenant || undefined}
          initialData={editingTenant ? {
            name: editingTenant.name,
            email: editingTenant.email,
            phone: editingTenant.phone,
            unitNumber: editingTenant.unitNumber,
            leaseStartDate: editingTenant.leaseStartDate,
            leaseEndDate: editingTenant.leaseEndDate,
            rentAmount: editingTenant.rentAmount,
            depositAmount: editingTenant.depositAmount,
            petPolicy: editingTenant.petPolicy || '',
            notes: editingTenant.notes || '',
          } : undefined}
        />
      )}

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            placeholder="Filter by unit..."
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="md:w-40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Name</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Unit</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Rent</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Lease End</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4 font-medium text-text">{tenant.name}</td>
                  <td className="py-3 px-4 text-text">{tenant.unitNumber}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.email}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.phone}</td>
                  <td className="py-3 px-4 font-medium text-text">${tenant.rentAmount}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.leaseEndDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye size={16} />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleEdit(tenant)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() => setDeletingTenant(tenant)}
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

        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No tenants found</p>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deletingTenant} onOpenChange={() => setDeletingTenant(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingTenant?.name}</strong>? This will also delete all associated rent payments, maintenance requests, documents, and communication logs. This action cannot be undone.
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
