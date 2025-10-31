"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tenantSchema, type TenantFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import { createTenant, updateTenant } from "@/app/actions/tenants"
import { useRouter } from "next/navigation"
import type { Tenant } from "@/lib/types"

interface TenantFormProps {
  onClose: () => void
  initialData?: TenantFormData
  editingTenant?: Tenant
  onSuccess?: (tenant: Tenant) => void
}

export function TenantForm({ onClose, initialData, editingTenant, onSuccess }: TenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const isEditing = !!editingTenant

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert form data to FormData for server action
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() || '')
      })

      const result = isEditing
        ? await updateTenant(editingTenant.id, formData)
        : await createTenant(formData)

      if (result.success) {
        setSuccess(true)
        // Call onSuccess callback if provided (for optimistic updates)
        if (result.data && onSuccess) {
          onSuccess(result.data)
        }
        // Wait a moment to show success message
        setTimeout(() => {
          router.refresh() // Refresh the page data
          onClose()
        }, 1000)
      } else {
        setError(result.error || `Failed to ${isEditing ? 'update' : 'create'} tenant`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">{isEditing ? 'Edit Tenant' : 'Add New Tenant'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Full Name *</label>
              <Input {...register("name")} placeholder="John Smith" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Email *</label>
              <Input {...register("email")} type="email" placeholder="john@example.com" />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Phone *</label>
              <Input {...register("phone")} placeholder="555-0101" />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Unit Number *</label>
              <Input {...register("unitNumber")} placeholder="101" />
              {errors.unitNumber && <p className="text-red-600 text-sm mt-1">{errors.unitNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Lease Start Date *</label>
              <Input {...register("leaseStartDate")} type="date" />
              {errors.leaseStartDate && <p className="text-red-600 text-sm mt-1">{errors.leaseStartDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Lease End Date *</label>
              <Input {...register("leaseEndDate")} type="date" />
              {errors.leaseEndDate && <p className="text-red-600 text-sm mt-1">{errors.leaseEndDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Monthly Rent *</label>
              <Input {...register("rentAmount", { valueAsNumber: true })} type="number" placeholder="1200" />
              {errors.rentAmount && <p className="text-red-600 text-sm mt-1">{errors.rentAmount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Security Deposit *</label>
              <Input {...register("depositAmount", { valueAsNumber: true })} type="number" placeholder="1200" />
              {errors.depositAmount && <p className="text-red-600 text-sm mt-1">{errors.depositAmount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Pet Policy</label>
            <Input {...register("petPolicy")} placeholder="No pets allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Notes</label>
            <textarea
              {...register("notes")}
              placeholder="Additional notes about the tenant..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <p className="text-sm">Tenant {isEditing ? 'updated' : 'created'} successfully!</p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success}>
              {isSubmitting ? "Saving..." : success ? "Saved!" : isEditing ? "Update Tenant" : "Save Tenant"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
