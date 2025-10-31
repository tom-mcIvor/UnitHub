import React from 'react'
import { render, screen } from '@testing-library/react'
import TenantDetailPage from '@/app/tenants/[id]/page'
import { getTenant } from '@/app/actions/tenants'

const mockTenantDetail = jest.fn(() => <div data-testid="tenant-detail" />)

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

jest.mock('@/components/tenants/tenant-detail', () => ({
  TenantDetail: (props: any) => mockTenantDetail(props),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenant: jest.fn(),
}))

const notFoundMock = jest.fn(() => {
  const error = new Error('NOT_FOUND')
  ;(error as any).digest = 'NEXT_NOT_FOUND'
  throw error
})

jest.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}))

const tenantResponse = {
  success: true,
  error: null,
  data: {
    id: 'tenant-1',
    name: 'Alice',
    email: 'alice@example.com',
    phone: '555-0101',
    unitNumber: '101',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2025-01-01',
    rentAmount: 1200,
    depositAmount: 1200,
    petPolicy: 'No pets',
    notes: 'Great tenant',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
}

describe('TenantDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getTenant as jest.Mock).mockResolvedValue(tenantResponse)
  })

  it('renders tenant detail when record exists', async () => {
    const element = await TenantDetailPage({ params: Promise.resolve({ id: 'tenant-1' }) })
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockTenantDetail).toHaveBeenCalledWith({ tenant: tenantResponse.data })
  })

  it('invokes notFound when tenant lookup fails', async () => {
    ;(getTenant as jest.Mock).mockResolvedValueOnce({ success: false, error: 'missing', data: null })

    await expect(
      TenantDetailPage({ params: Promise.resolve({ id: 'missing-tenant' }) })
    ).rejects.toThrowError('NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })
})
