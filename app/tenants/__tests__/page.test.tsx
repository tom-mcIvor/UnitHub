import React from 'react'
import { render, screen } from '@testing-library/react'
import TenantsPage from '@/app/tenants/page'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockTenantsList = jest.fn(() => <div data-testid="tenants-list" />)

jest.mock('@/components/tenants/tenants-list', () => ({
  TenantsList: (props: any) => mockTenantsList(props),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenants: jest.fn(),
}))

const mockTenantsData = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0100',
    unitNumber: '101',
    rentAmount: '1200.00',
    leaseStart: '2025-01-01',
    leaseEnd: '2026-01-01',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0101',
    unitNumber: '102',
    rentAmount: '1500.00',
    leaseStart: '2025-02-01',
    leaseEnd: '2026-02-01',
    createdAt: '2025-02-01T00:00:00Z',
  },
]

describe('Tenants Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders tenants list with fetched data', async () => {
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await TenantsPage()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockTenantsList).toHaveBeenCalledTimes(1)
    expect(mockTenantsList).toHaveBeenCalledWith({
      initialTenants: mockTenantsData,
      error: null,
    })
  })

  it('handles error when fetching tenants fails', async () => {
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch tenants',
    })

    const element = await TenantsPage()
    render(element)

    expect(mockTenantsList).toHaveBeenCalledWith({
      initialTenants: [],
      error: 'Failed to fetch tenants',
    })
  })

  it('passes empty array when no tenants exist', async () => {
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })

    const element = await TenantsPage()
    render(element)

    expect(mockTenantsList).toHaveBeenCalledWith({
      initialTenants: [],
      error: null,
    })
  })
})
