import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import type {
  DashboardStats,
  RecentTenant,
  UpcomingPayment,
  RecentMaintenanceRequest,
} from '@/app/actions/dashboard'

const mockStats: DashboardStats = {
  totalTenants: 12,
  monthlyIncome: '15500.00',
  pendingPayments: 3,
  openMaintenance: 2,
}

const mockTenants: RecentTenant[] = [
  {
    id: 'tenant-1',
    name: 'John Smith',
    unit_number: '101',
    lease_start: '2025-01-01',
    created_at: '2025-02-01T12:00:00Z',
  },
]

const mockPayments: UpcomingPayment[] = [
  {
    id: 'payment-1',
    tenant_id: 'tenant-1',
    tenant_name: 'John Smith',
    unit_number: '101',
    amount: '1200',
    due_date: '2025-11-15',
    status: 'pending',
  },
]

const mockMaintenance: RecentMaintenanceRequest[] = [
  {
    id: 'maint-1',
    tenant_id: 'tenant-1',
    unit_number: '101',
    title: 'HVAC Repair',
    priority: 'high',
    status: 'in-progress',
    created_at: '2025-10-29T10:00:00Z',
  },
]

describe('DashboardOverview', () => {
  it('should render stats and dashboard data when provided', () => {
    render(
      <DashboardOverview
        stats={mockStats}
        recentTenants={mockTenants}
        upcomingPayments={mockPayments}
        recentMaintenance={mockMaintenance}
        error={null}
      />
    )

    expect(screen.getByText('Total Tenants')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Monthly Income')).toBeInTheDocument()
    expect(screen.getByText('$15,500.00')).toBeInTheDocument()

    const tenantsCard = screen
      .getByRole('heading', { name: /Recent Tenants/i })
      .closest('[data-slot="card"]') as HTMLElement
    expect(within(tenantsCard).getByText('John Smith')).toBeInTheDocument()
    expect(within(tenantsCard).getByText(/Unit 101/)).toBeInTheDocument()

    const paymentsSection = screen
      .getByRole('heading', { name: /Upcoming Payments/i })
      .closest('[data-slot="card"]') as HTMLElement
    expect(within(paymentsSection).getByText('John Smith')).toBeInTheDocument()
    expect(within(paymentsSection).getByText('$1,200.00')).toBeInTheDocument()
    expect(within(paymentsSection).getByText('Pending')).toBeInTheDocument()
    expect(within(paymentsSection).getByText(/Nov 15, 2025/)).toBeInTheDocument()

    expect(screen.getByText('HVAC Repair')).toBeInTheDocument()
    expect(screen.getByText(/In-progress/i)).toBeInTheDocument()
  })

  it('should show error state and empty data messages when provided', () => {
    render(
      <DashboardOverview
        stats={null}
        recentTenants={[]}
        upcomingPayments={[]}
        recentMaintenance={[]}
        error="Failed to load dashboard data"
      />
    )

    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument()
    expect(screen.getByText(/No tenants yet/i)).toBeInTheDocument()
    expect(screen.getByText(/No upcoming payments/i)).toBeInTheDocument()
    expect(screen.getByText(/No open maintenance requests/i)).toBeInTheDocument()
  })
})
