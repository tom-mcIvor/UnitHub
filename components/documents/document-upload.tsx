"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload } from "lucide-react"
import type { Tenant } from "@/lib/types"
import { useRouter } from "next/navigation"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { createDocument } from "@/app/actions/documents"
import { toast } from "sonner"

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "UnitHubDocuments"

interface DocumentUploadProps {
  onClose: () => void
  tenants?: Tenant[]
}

export function DocumentUpload({ onClose, tenants = [] }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    tenantId: "",
    title: "",
    type: "other" as "lease" | "inspection" | "photo" | "other",
  })
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setFormData({
      tenantId: "",
      title: "",
      type: "other",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Please select a file to upload.")
      return
    }

    const title = formData.title.trim()
    if (!title) {
      toast.error("Please provide a document title.")
      return
    }

    setIsUploading(true)

    try {
      const supabase = createSupabaseClient()

      const fileExtension = selectedFile.name.includes(".")
        ? selectedFile.name.substring(selectedFile.name.lastIndexOf("."))
        : ""
      const fileName = `${crypto.randomUUID()}${fileExtension}`
      const directory = formData.tenantId || "property"
      const path = `${directory}/${fileName}`

      const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, selectedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: selectedFile.type || undefined,
      })

      if (uploadError) {
        console.error("Error uploading document:", uploadError)
        toast.error(uploadError.message || "Failed to upload document.")
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)

      if (!publicUrl) {
        toast.error("Could not generate document URL after upload.")
        return
      }

      const payload = new FormData()
      payload.append("title", title)
      payload.append("type", formData.type)
      payload.append("fileUrl", publicUrl)
      payload.append("tenantId", formData.tenantId ?? "")
      payload.append("storagePath", path)

      const result = await createDocument(payload)
      if (!result.success) {
        toast.error(result.error ?? "Failed to save document metadata.")
        return
      }

      toast.success("Document uploaded successfully!")
      router.refresh()
      resetForm()
      onClose()
    } catch (err) {
      toast.error("An unexpected error occurred during upload.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Upload Document</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-surface">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">Tenant *</label>
            <select
              value={formData.tenantId}
              onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Property-level document</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} (Unit {tenant.unitNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Document Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
              className="w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="lease">Lease Agreement</option>
              <option value="inspection">Inspection Report</option>
              <option value="photo">Photo</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value })
              }}
              placeholder="Document title"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">File *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                dragActive ? "border-primary bg-blue-50" : "border-border"
              }`}
            >
              <Upload size={32} className="mx-auto mb-2 text-text-secondary" />
              <p className="mb-2 text-sm text-text-secondary">Drag and drop your file here, or click to select</p>
              <input
                type="file"
                id="document-upload-input"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="document-upload-input" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" className="bg-transparent">
                  Select File
                </Button>
              </label>
            </div>
            {selectedFile && <p className="mt-2 text-sm text-green-600">✓ {selectedFile.name}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                resetForm()
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading || !selectedFile}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
