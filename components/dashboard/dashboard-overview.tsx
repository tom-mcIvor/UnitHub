"use client"
import { StatCard } from "./stat-card"
import { RecentTenants } from "./recent-tenants"
import { UpcomingPayments } from "./upcoming-payments"
import { MaintenanceOverview } from "./maintenance-overview"
import { Users, DollarSign, AlertCircle, Wrench } from "lucide-react"
import type { DashboardStats, RecentTenant, UpcomingPayment, RecentMaintenanceRequest } from "@/app/actions/dashboard"

interface DashboardOverviewProps {
  stats: DashboardStats | null
  recentTenants: RecentTenant[]
  upcomingPayments: UpcomingPayment[]
  recentMaintenance: RecentMaintenanceRequest[]
  error: string | null
}

export function DashboardOverview({
  stats,
  recentTenants,
  upcomingPayments,
  recentMaintenance,
  error,
}: DashboardOverviewProps) {
  const statCards = [
    {
      label: "Total Tenants",
      value: stats?.totalTenants.toString() || "0",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Monthly Income",
      value: `$${parseFloat(stats?.monthlyIncome || "0").toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Payments",
      value: stats?.pendingPayments.toString() || "0",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Open Maintenance",
      value: stats?.openMaintenance.toString() || "0",
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingPayments payments={upcomingPayments} />
          <MaintenanceOverview requests={recentMaintenance} />
        </div>

        <div>
          <RecentTenants tenants={recentTenants} />
        </div>
      </div>
    </div>
  )
}
