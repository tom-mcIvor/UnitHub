import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import {
  getDashboardStats,
  getRecentTenants,
  getUpcomingPayments,
  getRecentMaintenanceRequests,
} from "@/app/actions/dashboard"

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch all dashboard data in parallel
  const [statsResult, tenantsResult, paymentsResult, maintenanceResult] = await Promise.all([
    getDashboardStats(),
    getRecentTenants(),
    getUpcomingPayments(),
    getRecentMaintenanceRequests(),
  ])

  return (
    <DashboardOverview
      stats={statsResult.data}
      recentTenants={tenantsResult.data || []}
      upcomingPayments={paymentsResult.data || []}
      recentMaintenance={maintenanceResult.data || []}
      error={statsResult.error || tenantsResult.error || paymentsResult.error || maintenanceResult.error}
    />
  )
}
