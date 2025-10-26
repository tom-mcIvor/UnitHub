import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TenantsList } from "@/components/tenants/tenants-list"

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <TenantsList />
    </DashboardLayout>
  )
}
