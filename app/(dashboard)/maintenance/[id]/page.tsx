import { MaintenanceDetail } from "@/components/maintenance/maintenance-detail"
import { getMaintenanceRequest } from "@/app/actions/maintenance"
import { getTenants } from "@/app/actions/tenants"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: request, error }, { data: tenants }] = await Promise.all([
    getMaintenanceRequest(id),
    getTenants(),
  ])

  if (error || !request) {
    notFound()
  }

  return <MaintenanceDetail request={request} tenants={tenants || []} />
}
