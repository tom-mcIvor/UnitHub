import { DocumentsPage } from "@/components/documents/documents-page"
import { getDocuments } from "@/app/actions/documents"
import { getTenants } from "@/app/actions/tenants"

export const dynamic = 'force-dynamic'

export default async function DocumentsRoute() {
  const { data: documents, error } = await getDocuments()
  const { data: tenants } = await getTenants()

  return (
    <DocumentsPage
      initialDocuments={documents || []}
      tenants={tenants || []}
      error={error}
    />
  )
}
