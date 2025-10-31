import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MaintenanceDetail } from "@/components/maintenance/maintenance-detail"
import { getMaintenanceRequest } from "@/app/actions/maintenance"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: request, error } = await getMaintenanceRequest(id)

  if (error || !request) {
    notFound()
  }

  return (
    <DashboardLayout>
      <MaintenanceDetail request={request} />
    </DashboardLayout>
  )
}
