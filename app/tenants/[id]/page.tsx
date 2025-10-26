import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TenantDetail } from "@/components/tenants/tenant-detail"

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <TenantDetail tenantId={params.id} />
    </DashboardLayout>
  )
}
