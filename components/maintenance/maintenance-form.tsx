"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { maintenanceRequestSchema, type MaintenanceRequestFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface MaintenanceFormProps {
  onClose: () => void
}

export function MaintenanceForm({ onClose }: MaintenanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceRequestFormData>({
    resolver: zodResolver(maintenanceRequestSchema),
  })

  const onSubmit = async (data: MaintenanceRequestFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Call API to save maintenance request
      console.log("Saving maintenance request:", data)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">New Maintenance Request</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Tenant *</label>
              <select
                {...register("tenantId")}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a tenant</option>
                <option value="1">John Smith (Unit 101)</option>
                <option value="2">Sarah Johnson (Unit 202)</option>
                <option value="3">Mike Davis (Unit 303)</option>
              </select>
              {errors.tenantId && <p className="text-red-600 text-sm mt-1">{errors.tenantId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Category *</label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Painting">Painting</option>
                <option value="Security">Security</option>
                <option value="Appliances">Appliances</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Title *</label>
            <Input {...register("title")} placeholder="Brief description of the issue" />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Description *</label>
            <textarea
              {...register("description")}
              placeholder="Detailed description of the maintenance issue..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Priority *</label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Estimated Cost</label>
              <Input {...register("estimatedCost", { valueAsNumber: true })} type="number" placeholder="0.00" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Assigned Vendor</label>
            <Input {...register("assignedVendor")} placeholder="Vendor name (optional)" />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
