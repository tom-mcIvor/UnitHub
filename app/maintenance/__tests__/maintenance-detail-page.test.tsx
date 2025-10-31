import React from 'react'
import { render, screen } from '@testing-library/react'
import MaintenanceDetailPage from '@/app/maintenance/[id]/page'
import { getMaintenanceRequest } from '@/app/actions/maintenance'

const mockMaintenanceDetail = jest.fn(() => <div data-testid="maintenance-detail" />)

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

jest.mock('@/components/maintenance/maintenance-detail', () => ({
  MaintenanceDetail: (props: any) => mockMaintenanceDetail(props),
}))

jest.mock('@/app/actions/maintenance', () => ({
  getMaintenanceRequest: jest.fn(),
}))

const notFoundMock = jest.fn(() => {
  const error = new Error('NOT_FOUND')
  ;(error as any).digest = 'NEXT_NOT_FOUND'
  throw error
})

jest.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}))

const maintenanceResponse = {
  success: true,
  error: null,
  data: {
    id: 'req-1',
    tenantId: 'tenant-1',
    tenantName: 'Alice',
    unitNumber: '101',
    title: 'Fix HVAC',
    description: 'AC not working',
    category: 'HVAC',
    priority: 'high',
    status: 'open',
    estimatedCost: 200,
    actualCost: null,
    assignedVendor: null,
    photos: [],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-02T10:00:00Z',
  },
}

describe('MaintenanceDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getMaintenanceRequest as jest.Mock).mockResolvedValue(maintenanceResponse)
  })

  it('renders maintenance detail when request exists', async () => {
    const element = await MaintenanceDetailPage({ params: Promise.resolve({ id: 'req-1' }) })
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockMaintenanceDetail).toHaveBeenCalledWith({ request: maintenanceResponse.data })
  })

  it('invokes notFound when maintenance request is missing', async () => {
    ;(getMaintenanceRequest as jest.Mock).mockResolvedValueOnce({ success: false, error: 'missing', data: null })

    await expect(
      MaintenanceDetailPage({ params: Promise.resolve({ id: 'missing-request' }) })
    ).rejects.toThrowError('NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })
})
