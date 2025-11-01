"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { communicationLogSchema, type CommunicationLogFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { createCommunicationLog, updateCommunicationLog } from "@/app/actions/communications"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Tenant } from "@/lib/types"
import type { CommunicationLogWithTenant } from "@/app/actions/communications"

interface CommunicationFormProps {
  onClose: () => void
  tenants?: Tenant[]
  editingLog?: CommunicationLogWithTenant
  initialData?: CommunicationLogFormData
}

export function CommunicationForm({ onClose, tenants = [], editingLog, initialData }: CommunicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const isEditing = !!editingLog

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunicationLogFormData>({
    resolver: zodResolver(communicationLogSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: CommunicationLogFormData) => {
    setIsSubmitting(true)

    try {
      // Convert to FormData for server action
      const formData = new FormData()
      formData.append('tenantId', data.tenantId)
      formData.append('type', data.type)
      formData.append('subject', data.subject)
      formData.append('content', data.content)

      const result = isEditing
        ? await updateCommunicationLog(editingLog.id, formData)
        : await createCommunicationLog(formData)

      if (result.success) {
        toast.success(`Communication ${isEditing ? 'updated' : 'logged'} successfully!`)
        router.refresh()
        onClose()
      } else {
        toast.error(result.error || `Failed to ${isEditing ? 'update' : 'log'} communication`)
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">{isEditing ? 'Edit Communication' : 'Log Communication'}</h2>
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
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} (Unit {tenant.unitNumber})
                </option>
              ))}
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
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Communication"
                  : "Log Communication"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
