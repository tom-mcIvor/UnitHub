"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { documentMetadataSchema, type DocumentFormData } from "@/lib/schemas"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { createDocument, updateDocument, type DocumentWithTenant } from "@/app/actions/documents"
import { useRouter } from "next/navigation"
import type { Tenant } from "@/lib/types"

interface DocumentFormProps {
  onClose: () => void
  tenants?: Tenant[]
  editingDocument?: DocumentWithTenant
  initialData?: DocumentFormData
}

export function DocumentForm({ onClose, tenants = [], editingDocument, initialData }: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const isEditing = !!editingDocument

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentMetadataSchema),
    defaultValues: initialData ?? {
      tenantId: editingDocument?.tenantId ?? "",
      title: editingDocument?.title ?? "",
      type: editingDocument?.type ?? "other",
      fileUrl: editingDocument?.fileUrl ?? "",
    },
  })

  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      if (data.tenantId && data.tenantId !== "") {
        formData.append("tenantId", data.tenantId)
      } else {
        formData.append("tenantId", "")
      }
      formData.append("title", data.title)
      formData.append("type", data.type)
      formData.append("fileUrl", data.fileUrl)

      const result = isEditing
        ? await updateDocument(editingDocument.id, formData)
        : await createDocument(formData)

      if (result.success) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => {
          onClose()
        }, 1000)
      } else {
        setError(result.error || `Failed to ${isEditing ? "update" : "save"} document`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">{isEditing ? "Edit Document" : "Add Document"}</h2>
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
              <p className="text-green-700 text-sm">
                Document {isEditing ? "updated" : "saved"} successfully!
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text mb-2">Tenant</label>
            <select
              {...register("tenantId")}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Property-level document</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} (Unit {tenant.unitNumber})
                </option>
              ))}
            </select>
            {errors.tenantId && <p className="text-red-600 text-sm mt-1">{errors.tenantId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Title *</label>
            <Input {...register("title")} placeholder="Document title" />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Document Type *</label>
            <select
              {...register("type")}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="lease">Lease</option>
              <option value="inspection">Inspection</option>
              <option value="photo">Photo</option>
              <option value="other">Other</option>
            </select>
            {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">File URL *</label>
            <Input {...register("fileUrl")} placeholder="https://..." />
            {errors.fileUrl && <p className="text-red-600 text-sm mt-1">{errors.fileUrl.message}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success}>
              {isSubmitting ? "Saving..." : success ? "Saved!" : isEditing ? "Update Document" : "Save Document"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
