import React from 'react'
import { render, screen } from '@testing-library/react'
import RentPage from '@/app/rent/page'
import { getRentPayments } from '@/app/actions/rent'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockRentTrackingPage = jest.fn(() => <div data-testid="rent-tracking-page" />)

jest.mock('@/components/rent/rent-tracking-page', () => ({
  RentTrackingPage: (props: any) => mockRentTrackingPage(props),
}))

jest.mock('@/app/actions/rent', () => ({
  getRentPayments: jest.fn(),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenants: jest.fn(),
}))

const mockPaymentsData = [
  {
    id: 'p1',
    tenantId: 't1',
    amount: '1200.00',
    dueDate: '2025-03-01',
    status: 'pending',
    paymentDate: null,
    tenantName: 'John Doe',
    unitNumber: '101',
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'p2',
    tenantId: 't2',
    amount: '1500.00',
    dueDate: '2025-03-01',
    status: 'paid',
    paymentDate: '2025-02-28',
    tenantName: 'Jane Smith',
    unitNumber: '102',
    createdAt: '2025-02-01T00:00:00Z',
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

describe('Rent Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders rent tracking page with fetched data', async () => {
    ;(getRentPayments as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPaymentsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await RentPage()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockRentTrackingPage).toHaveBeenCalledTimes(1)
    expect(mockRentTrackingPage).toHaveBeenCalledWith({
      initialPayments: mockPaymentsData,
      tenants: mockTenantsData,
      error: null,
    })
  })

  it('handles error when fetching payments fails', async () => {
    ;(getRentPayments as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch payments',
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await RentPage()
    render(element)

    expect(mockRentTrackingPage).toHaveBeenCalledWith({
      initialPayments: [],
      tenants: mockTenantsData,
      error: 'Failed to fetch payments',
    })
  })

  it('handles empty tenants list gracefully', async () => {
    ;(getRentPayments as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPaymentsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: null,
      error: null,
    })

    const element = await RentPage()
    render(element)

    expect(mockRentTrackingPage).toHaveBeenCalledWith({
      initialPayments: mockPaymentsData,
      tenants: [],
      error: null,
    })
  })

  it('passes empty arrays when no data exists', async () => {
    ;(getRentPayments as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })

    const element = await RentPage()
    render(element)

    expect(mockRentTrackingPage).toHaveBeenCalledWith({
      initialPayments: [],
      tenants: [],
      error: null,
    })
  })
})
