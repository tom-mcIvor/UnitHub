import { DocumentDetail } from "@/components/documents/document-detail"
import { getDocument } from "@/app/actions/documents"
import { getTenants } from "@/app/actions/tenants"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: document, error }, { data: tenants }] = await Promise.all([getDocument(id), getTenants()])

  if (error || !document) {
    notFound()
  }

  return <DocumentDetail document={document} tenants={tenants || []} />
}
