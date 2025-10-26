"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { communicationLogSchema, type CommunicationLogFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface CommunicationFormProps {
  onClose: () => void
}

export function CommunicationForm({ onClose }: CommunicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunicationLogFormData>({
    resolver: zodResolver(communicationLogSchema),
  })

  const onSubmit = async (data: CommunicationLogFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Call API to save communication log
      console.log("Saving communication:", data)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Log Communication</h2>
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
            <label className="block text-sm font-medium text-text mb-2">Communication Type *</label>
            <select
              {...register("type")}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="in-person">In-Person</option>
              <option value="message">Message</option>
            </select>
            {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Subject *</label>
            <Input {...register("subject")} placeholder="Communication subject" />
            {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Details *</label>
            <textarea
              {...register("content")}
              placeholder="Describe the communication..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
            {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Log Communication"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
