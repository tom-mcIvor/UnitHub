import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MaintenancePage } from "@/components/maintenance/maintenance-page"
import { getMaintenanceRequests } from "@/app/actions/maintenance"
import { getTenants } from "@/app/actions/tenants"

export const dynamic = 'force-dynamic'

export default async function MaintenanceRoute() {
  const { data: requests, error } = await getMaintenanceRequests()
  const { data: tenants } = await getTenants()

  return (
    <DashboardLayout>
      <MaintenancePage
        initialRequests={requests || []}
        tenants={tenants || []}
        error={error}
      />
    </DashboardLayout>
  )
}
