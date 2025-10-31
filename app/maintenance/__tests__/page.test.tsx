import React from 'react'
import { render, screen } from '@testing-library/react'
import MaintenanceRoute from '@/app/maintenance/page'
import { getMaintenanceRequests } from '@/app/actions/maintenance'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockMaintenancePage = jest.fn(() => <div data-testid="maintenance-page" />)

jest.mock('@/components/maintenance/maintenance-page', () => ({
  MaintenancePage: (props: any) => mockMaintenancePage(props),
}))

jest.mock('@/app/actions/maintenance', () => ({
  getMaintenanceRequests: jest.fn(),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenants: jest.fn(),
}))

const mockRequestsData = [
  {
    id: 'm1',
    tenantId: 't1',
    title: 'Leaking faucet',
    description: 'Kitchen faucet is dripping',
    category: 'plumbing',
    priority: 'medium',
    status: 'open',
    estimatedCost: '150.00',
    actualCost: null,
    vendorName: null,
    completedAt: null,
    tenantName: 'John Doe',
    unitNumber: '101',
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'm2',
    tenantId: 't2',
    title: 'HVAC not working',
    description: 'Heating system failure',
    category: 'hvac',
    priority: 'high',
    status: 'in-progress',
    estimatedCost: '500.00',
    actualCost: null,
    vendorName: 'HVAC Pros',
    completedAt: null,
    tenantName: 'Jane Smith',
    unitNumber: '102',
    createdAt: '2025-02-10T00:00:00Z',
  },
]

const mockTenantsData = [
  {
    id: 't1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0100',
    unitNumber: '101',
    rentAmount: '1200.00',
    leaseStart: '2025-01-01',
    leaseEnd: '2026-01-01',
    createdAt: '2025-01-01T00:00:00Z',
  },
]

describe('Maintenance Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders maintenance page with fetched data', async () => {
    ;(getMaintenanceRequests as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRequestsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await MaintenanceRoute()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockMaintenancePage).toHaveBeenCalledTimes(1)
    expect(mockMaintenancePage).toHaveBeenCalledWith({
      initialRequests: mockRequestsData,
      tenants: mockTenantsData,
      error: null,
    })
  })

  it('handles error when fetching requests fails', async () => {
    ;(getMaintenanceRequests as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch maintenance requests',
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await MaintenanceRoute()
    render(element)

    expect(mockMaintenancePage).toHaveBeenCalledWith({
      initialRequests: [],
      tenants: mockTenantsData,
      error: 'Failed to fetch maintenance requests',
    })
  })

  it('handles empty tenants list gracefully', async () => {
    ;(getMaintenanceRequests as jest.Mock).mockResolvedValue({
      success: true,
      data: mockRequestsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: null,
      error: null,
    })

    const element = await MaintenanceRoute()
    render(element)

    expect(mockMaintenancePage).toHaveBeenCalledWith({
      initialRequests: mockRequestsData,
      tenants: [],
      error: null,
    })
  })

  it('passes empty arrays when no data exists', async () => {
    ;(getMaintenanceRequests as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })

    const element = await MaintenanceRoute()
    render(element)

    expect(mockMaintenancePage).toHaveBeenCalledWith({
      initialRequests: [],
      tenants: [],
      error: null,
    })
  })
})
