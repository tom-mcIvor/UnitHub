"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rentPaymentSchema, type RentPaymentFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { createRentPayment, updateRentPayment } from "@/app/actions/rent"
import { useRouter } from "next/navigation"
import type { Tenant } from "@/lib/types"
import type { RentPaymentWithTenant } from "@/app/actions/rent"

interface RentPaymentFormProps {
  onClose: () => void
  tenants?: Tenant[]
  editingPayment?: RentPaymentWithTenant
  initialData?: RentPaymentFormData
}

export function RentPaymentForm({ onClose, tenants = [], editingPayment, initialData }: RentPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const isEditing = !!editingPayment

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RentPaymentFormData>({
    resolver: zodResolver(rentPaymentSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: RentPaymentFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert to FormData for server action
      const formData = new FormData()
      formData.append('tenantId', data.tenantId)
      formData.append('amount', data.amount.toString())
      formData.append('dueDate', data.dueDate)
      if (data.paidDate) {
        formData.append('paidDate', data.paidDate)
      }
      formData.append('status', data.status)
      formData.append('notes', data.notes || '')

      const result = isEditing
        ? await updateRentPayment(editingPayment.id, formData)
        : await createRentPayment(formData)

      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setError(result.error || `Failed to ${isEditing ? 'update' : 'save'} payment`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">{isEditing ? 'Edit Payment' : 'Record Payment'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Payment {isEditing ? 'updated' : 'recorded'} successfully!</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-2">Tenant *</label>
            <select
              {...register("tenantId")}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} (Unit {tenant.unitNumber})
                </option>
              ))}
            </select>
            {errors.tenantId && <p className="text-red-600 text-sm mt-1">{errors.tenantId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Amount *</label>
            <Input {...register("amount", { valueAsNumber: true })} type="number" placeholder="1200" />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Due Date *</label>
            <Input {...register("dueDate")} type="date" />
            {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Paid Date</label>
            <Input {...register("paidDate")} type="date" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Status *</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Notes</label>
            <textarea
              {...register("notes")}
              placeholder="Add any notes about this payment..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success}>
              {isSubmitting ? "Saving..." : success ? "Saved!" : isEditing ? "Update Payment" : "Record Payment"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
