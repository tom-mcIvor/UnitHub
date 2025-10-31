"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Download, FileText, CalendarDays, User } from "lucide-react"
import type { DocumentWithTenant } from "@/app/actions/documents"
import type { Tenant } from "@/lib/types"
import { DocumentForm } from "./document-form"

interface DocumentDetailProps {
  document: DocumentWithTenant
  tenants: Tenant[]
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "—"
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const typeBadgeStyles: Record<string, string> = {
  lease: "bg-blue-100 text-blue-700",
  inspection: "bg-purple-100 text-purple-700",
  photo: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-700",
}

export function DocumentDetail({ document, tenants }: DocumentDetailProps) {
  const [showForm, setShowForm] = useState(false)

  const badgeClass = typeBadgeStyles[document.type] ?? typeBadgeStyles.other
  const initialFormData = {
    tenantId: document.tenantId ?? "",
    title: document.title,
    type: document.type,
    fileUrl: document.fileUrl,
  }

  const downloadHref = document.storagePath ? `/api/documents/${document.id}/download` : document.fileUrl
  const downloadDisabled = !document.storagePath && !document.fileUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/documents">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={20} />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text">{document.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={badgeClass}>
              {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            </Badge>
            <span className="text-sm text-text-secondary">
              Uploaded {formatDate(document.uploadedAt)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {!downloadDisabled && (
            <Button asChild variant="outline" className="gap-2">
              <a href={downloadHref} target="_blank" rel="noopener noreferrer">
                <Download size={18} />
                Download
              </a>
            </Button>
          )}
          <Button className="gap-2" onClick={() => setShowForm(true)}>
            <Edit2 size={18} />
            Edit
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-primary" />
          <div>
            <p className="text-sm text-text-secondary">Document Title</p>
            <p className="text-text font-medium">{document.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User size={20} className="text-primary" />
          <div>
            <p className="text-sm text-text-secondary">Associated Tenant</p>
            {document.tenantName ? (
              <div className="text-text">
                <p className="font-medium">{document.tenantName}</p>
                {document.unitNumber && <p className="text-sm text-text-secondary">Unit {document.unitNumber}</p>}
              </div>
            ) : (
              <p className="text-text font-medium">Property-level document</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={20} className="text-primary" />
          <div>
            <p className="text-sm text-text-secondary">Uploaded At</p>
            <p className="text-text font-medium">{formatDate(document.uploadedAt)}</p>
          </div>
        </div>
      </Card>

      {document.extractedData && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Extracted Data</h2>
          <div className="space-y-2 text-sm">
            {Object.entries(document.extractedData).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="font-medium text-text w-32 capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-text-secondary flex-1">{String(value)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showForm && (
        <DocumentForm
          onClose={() => setShowForm(false)}
          tenants={tenants}
          editingDocument={document}
          initialData={initialFormData}
        />
      )}
    </div>
  )
}
