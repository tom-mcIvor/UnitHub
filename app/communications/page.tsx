import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CommunicationsPage } from "@/components/communications/communications-page"

export default function CommunicationsRoute() {
  return (
    <DashboardLayout>
      <CommunicationsPage />
    </DashboardLayout>
  )
}
