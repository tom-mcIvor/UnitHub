import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MaintenancePage } from "@/components/maintenance/maintenance-page"

export default function MaintenanceRoute() {
  return (
    <DashboardLayout>
      <MaintenancePage />
    </DashboardLayout>
  )
}
