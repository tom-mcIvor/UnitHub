import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RentTrackingPage } from "@/components/rent/rent-tracking-page"
import { getRentPayments } from "@/app/actions/rent"
import { getTenants } from "@/app/actions/tenants"

export const dynamic = 'force-dynamic'

export default async function RentPage() {
  const { data: payments, error } = await getRentPayments()
  const { data: tenants } = await getTenants()

  return (
    <DashboardLayout>
      <RentTrackingPage
        initialPayments={payments || []}
        tenants={tenants || []}
        error={error}
      />
    </DashboardLayout>
  )
}
