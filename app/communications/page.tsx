import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CommunicationsPage } from "@/components/communications/communications-page"
import { getCommunicationLogs } from "@/app/actions/communications"
import { getTenants } from "@/app/actions/tenants"

export const dynamic = 'force-dynamic'

export default async function CommunicationsRoute() {
  const { data: communications, error } = await getCommunicationLogs()
  const { data: tenants } = await getTenants()

  return (
    <DashboardLayout>
      <CommunicationsPage
        initialCommunications={communications || []}
        tenants={tenants || []}
        error={error}
      />
    </DashboardLayout>
  )
}
