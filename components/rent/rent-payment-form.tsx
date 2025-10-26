"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rentPaymentSchema, type RentPaymentFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface RentPaymentFormProps {
  onClose: () => void
}

export function RentPaymentForm({ onClose }: RentPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RentPaymentFormData>({
    resolver: zodResolver(rentPaymentSchema),
  })

  const onSubmit = async (data: RentPaymentFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Call API to save payment
      console.log("Saving payment:", data)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Record Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
