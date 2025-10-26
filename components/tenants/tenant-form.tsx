"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tenantSchema, type TenantFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface TenantFormProps {
  onClose: () => void
  initialData?: TenantFormData
}

export function TenantForm({ onClose, initialData }: TenantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    try {
      // TODO: Call API to save tenant
      console.log("Saving tenant:", data)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Add New Tenant</h2>
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

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Tenant"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
