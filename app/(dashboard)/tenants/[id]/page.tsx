import { TenantDetail } from "@/components/tenants/tenant-detail"
import { getTenant } from "@/app/actions/tenants"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: tenant, error } = await getTenant(id)

  if (error || !tenant) {
    notFound()
  }

  return <TenantDetail tenant={tenant} />
}
