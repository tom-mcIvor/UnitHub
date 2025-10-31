"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DocumentUpload } from "./document-upload"
import { DocumentForm } from "./document-form"
import { LeaseExtractor } from "./lease-extractor"
import { Plus, Search, Download, Trash2, Eye, Edit2 } from "lucide-react"
import type { DocumentWithTenant } from "@/app/actions/documents"
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
import { deleteDocument } from "@/app/actions/documents"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DocumentsPageProps {
  initialDocuments: DocumentWithTenant[]
  tenants: Tenant[]
  error: string | null
}

export function DocumentsPage({ initialDocuments, tenants, error }: DocumentsPageProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [showLeaseExtractor, setShowLeaseExtractor] = useState(false)
  const [showDocumentForm, setShowDocumentForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<DocumentWithTenant | null>(null)
  const [deletingDocument, setDeletingDocument] = useState<DocumentWithTenant | null>(null)
  const [filterType, setFilterType] = useState<"all" | "lease" | "inspection" | "photo" | "other">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const documents = initialDocuments

  const handleDelete = async () => {
    if (!deletingDocument) return

    setIsDeleting(true)
    try {
      const result = await deleteDocument(deletingDocument.id)
      if (result.success) {
        router.refresh()
        setDeletingDocument(null)
      } else {
        alert(`Failed to delete document: ${result.error}`)
      }
    } catch (err) {
      console.error('Error deleting document:', err)
      alert('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (document: DocumentWithTenant) => {
    setEditingDocument(document)
    setShowDocumentForm(true)
  }

  const handleCloseForm = () => {
    setShowDocumentForm(false)
    setEditingDocument(null)
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesType = filterType === "all" || doc.type === filterType
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tenantName && doc.tenantName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lease":
        return "bg-blue-100 text-blue-700"
      case "inspection":
        return "bg-purple-100 text-purple-700"
      case "photo":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Documents</h1>
          <p className="text-text-secondary mt-1">Store and manage tenant documents</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowLeaseExtractor(true)} variant="outline" className="gap-2">
            <Plus size={20} />
            Extract Lease
          </Button>
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Plus size={20} />
            Upload Document
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-700">Error loading documents: {error}</p>
        </Card>
      )}

      {showUpload && <DocumentUpload onClose={() => setShowUpload(false)} tenants={tenants} />}
      {showLeaseExtractor && <LeaseExtractor onClose={() => setShowLeaseExtractor(false)} />}
      {showDocumentForm && editingDocument && (
        <DocumentForm
          onClose={handleCloseForm}
          tenants={tenants}
          editingDocument={editingDocument}
          initialData={{
            tenantId: editingDocument.tenantId ?? "",
            title: editingDocument.title,
            type: editingDocument.type,
            fileUrl: editingDocument.fileUrl,
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Total Documents</p>
          <p className="text-3xl font-bold text-text mt-2">{documents.length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Leases</p>
          <p className="text-3xl font-bold text-text mt-2">{documents.filter((d) => d.type === "lease").length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Inspections</p>
          <p className="text-3xl font-bold text-text mt-2">{documents.filter((d) => d.type === "inspection").length}</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Photos</p>
          <p className="text-3xl font-bold text-text mt-2">{documents.filter((d) => d.type === "photo").length}</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by title or tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "lease", "inspection", "photo", "other"] as const).map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                size="sm"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(doc.type)}`}>
                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => handleEdit(doc)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    asChild
                    disabled={!doc.storagePath && !doc.fileUrl}
                  >
                    {doc.storagePath ? (
                      <Link
                        href={`/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} />
                      </Link>
                    ) : (
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download size={16} />
                      </a>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-red-600 hover:text-red-700"
                    onClick={() => setDeletingDocument(doc)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <h3 className="font-medium text-text mb-2 line-clamp-2">{doc.title}</h3>

              <p className="text-sm text-text-secondary mb-3">
                {doc.tenantName} • {doc.uploadedAt}
              </p>

              {doc.extractedData && (
                <div className="bg-surface p-3 rounded mb-3 text-xs">
                  <p className="font-medium text-text mb-2">Extracted Data:</p>
                  <div className="space-y-1 text-text-secondary">
                    {Object.entries(doc.extractedData).map(([key, value]) => (
                      <p key={key}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                <Link href={`/documents/${doc.id}`}>
                  <Eye size={16} />
                  View
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No documents found</p>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deletingDocument} onOpenChange={() => setDeletingDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingDocument?.title}</strong>? This will only delete the metadata. The actual file in storage will remain (file upload not yet implemented). This action cannot be undone.
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
