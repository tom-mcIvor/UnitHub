"use client"
import { StatCard } from "./stat-card"
import { RecentTenants } from "./recent-tenants"
import { UpcomingPayments } from "./upcoming-payments"
import { MaintenanceOverview } from "./maintenance-overview"
import { Users, DollarSign, AlertCircle, Wrench } from "lucide-react"

export function DashboardOverview() {
  // Mock data - will be replaced with real data from API
  const stats = [
    {
      label: "Total Tenants",
      value: "24",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Monthly Income",
      value: "$12,450",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Payments",
      value: "3",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Open Maintenance",
      value: "7",
      icon: Wrench,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's your property overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingPayments />
          <MaintenanceOverview />
        </div>

        <div>
          <RecentTenants />
        </div>
      </div>
    </div>
  )
}
