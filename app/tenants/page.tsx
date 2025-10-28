import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TenantsList } from "@/components/tenants/tenants-list"
import { getTenants } from "@/app/actions/tenants"

export default async function TenantsPage() {
  // Fetch tenants from database (Server Component)
  const { data: tenants, error } = await getTenants()

  return (
    <DashboardLayout>
      <TenantsList initialTenants={tenants || []} error={error} />
    </DashboardLayout>
  )
}
