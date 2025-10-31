import React from 'react'
import { render, screen } from '@testing-library/react'
import CommunicationsRoute from '@/app/communications/page'
import { getCommunicationLogs } from '@/app/actions/communications'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockCommunicationsPage = jest.fn(() => <div data-testid="communications-page" />)

jest.mock('@/components/communications/communications-page', () => ({
  CommunicationsPage: (props: any) => mockCommunicationsPage(props),
}))

jest.mock('@/app/actions/communications', () => ({
  getCommunicationLogs: jest.fn(),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenants: jest.fn(),
}))

const mockCommunicationsData = [
  {
    id: 'c1',
    tenantId: 't1',
    type: 'email',
    subject: 'Rent reminder',
    content: 'This is a reminder that your rent is due',
    sentAt: '2025-03-01T10:00:00Z',
    tenantName: 'John Doe',
    unitNumber: '101',
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'c2',
    tenantId: 't2',
    type: 'sms',
    subject: 'Maintenance update',
    content: 'Your maintenance request has been scheduled',
    sentAt: '2025-03-02T14:30:00Z',
    tenantName: 'Jane Smith',
    unitNumber: '102',
    createdAt: '2025-03-02T14:30:00Z',
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

describe('Communications Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders communications page with fetched data', async () => {
    ;(getCommunicationLogs as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCommunicationsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await CommunicationsRoute()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockCommunicationsPage).toHaveBeenCalledTimes(1)
    expect(mockCommunicationsPage).toHaveBeenCalledWith({
      initialCommunications: mockCommunicationsData,
      tenants: mockTenantsData,
      error: null,
    })
  })

  it('handles error when fetching communications fails', async () => {
    ;(getCommunicationLogs as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch communications',
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await CommunicationsRoute()
    render(element)

    expect(mockCommunicationsPage).toHaveBeenCalledWith({
      initialCommunications: [],
      tenants: mockTenantsData,
      error: 'Failed to fetch communications',
    })
  })

  it('handles empty tenants list gracefully', async () => {
    ;(getCommunicationLogs as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCommunicationsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: null,
      error: null,
    })

    const element = await CommunicationsRoute()
    render(element)

    expect(mockCommunicationsPage).toHaveBeenCalledWith({
      initialCommunications: mockCommunicationsData,
      tenants: [],
      error: null,
    })
  })

  it('passes empty arrays when no data exists', async () => {
    ;(getCommunicationLogs as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })

    const element = await CommunicationsRoute()
    render(element)

    expect(mockCommunicationsPage).toHaveBeenCalledWith({
      initialCommunications: [],
      tenants: [],
      error: null,
    })
  })
})
