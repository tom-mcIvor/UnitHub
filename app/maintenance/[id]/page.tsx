import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MaintenanceDetail } from "@/components/maintenance/maintenance-detail"

export default function MaintenanceDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <MaintenanceDetail requestId={params.id} />
    </DashboardLayout>
  )
}
