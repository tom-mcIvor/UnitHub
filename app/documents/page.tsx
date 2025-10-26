import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentsPage } from "@/components/documents/documents-page"

export default function DocumentsRoute() {
  return (
    <DashboardLayout>
      <DocumentsPage />
    </DashboardLayout>
  )
}
