import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/(dashboard)/page'
import {
  getDashboardStats,
  getRecentTenants,
  getUpcomingPayments,
  getRecentMaintenanceRequests,
} from '@/app/actions/dashboard'

const mockDashboardOverview = jest.fn(() => <div data-testid="dashboard-overview" />)

jest.mock('@/components/dashboard/dashboard-overview', () => ({
  DashboardOverview: (props: any) => mockDashboardOverview(props),
}))

jest.mock('@/app/actions/dashboard', () => ({
  getDashboardStats: jest.fn(),
  getRecentTenants: jest.fn(),
  getUpcomingPayments: jest.fn(),
  getRecentMaintenanceRequests: jest.fn(),
}))

const statsPayload = {
  success: true,
  data: { totalTenants: 10, monthlyIncome: '4500.00', pendingPayments: 2, openMaintenance: 1 },
  error: null,
}

const tenantsPayload = {
  success: true,
  data: [{ id: 't1', name: 'Alice', unit_number: '101', lease_start: '2025-02-01', created_at: '2025-02-10' }],
  error: null,
}

const paymentsPayload = {
  success: true,
  data: [
    {
      id: 'p1',
      tenant_id: 't1',
      tenant_name: 'Alice',
      unit_number: '101',
      amount: '1200.00',
      due_date: '2025-03-01',
      status: 'pending',
    },
  ],
  error: null,
}

const maintenancePayload = {
  success: true,
  data: [
    {
      id: 'm1',
      tenant_id: 't1',
      unit_number: '101',
      title: 'Sink leak',
      priority: 'high',
      status: 'open',
      created_at: '2025-02-12',
    },
  ],
  error: null,
}

const dashboardActions = {
  getDashboardStats: getDashboardStats as jest.Mock,
  getRecentTenants: getRecentTenants as jest.Mock,
  getUpcomingPayments: getUpcomingPayments as jest.Mock,
  getRecentMaintenanceRequests: getRecentMaintenanceRequests as jest.Mock,
}

describe('Home dashboard page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    dashboardActions.getDashboardStats.mockResolvedValue(statsPayload)
    dashboardActions.getRecentTenants.mockResolvedValue(tenantsPayload)
    dashboardActions.getUpcomingPayments.mockResolvedValue(paymentsPayload)
    dashboardActions.getRecentMaintenanceRequests.mockResolvedValue(maintenancePayload)
  })

  it('renders dashboard overview with fetched data', async () => {
    const element = await Home()
    render(element)

    expect(mockDashboardOverview).toHaveBeenCalledTimes(1)
    expect(mockDashboardOverview).toHaveBeenCalledWith({
      stats: statsPayload.data,
      recentTenants: tenantsPayload.data,
      upcomingPayments: paymentsPayload.data,
      recentMaintenance: maintenancePayload.data,
      error: null,
    })
  })

  it('passes aggregated error messages when any fetch fails', async () => {
    dashboardActions.getDashboardStats.mockResolvedValueOnce({
      success: false,
      data: null,
      error: 'Failed to load stats',
    })

    const element = await Home()
    render(element)

    expect(mockDashboardOverview).toHaveBeenCalledWith(
      expect.objectContaining({
        stats: null,
        error: 'Failed to load stats',
      })
    )
  })
})
