import { TenantsList } from "@/components/tenants/tenants-list"
import { getTenants } from "@/app/actions/tenants"

export const dynamic = 'force-dynamic'

export default async function TenantsPage() {
  // Fetch tenants from database (Server Component)
  const { data: tenants, error } = await getTenants()

  return <TenantsList initialTenants={tenants || []} error={error} />
}
