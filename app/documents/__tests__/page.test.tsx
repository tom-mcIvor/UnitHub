import React from 'react'
import { render, screen } from '@testing-library/react'
import DocumentsRoute from '@/app/documents/page'
import { getDocuments } from '@/app/actions/documents'
import { getTenants } from '@/app/actions/tenants'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockDocumentsPage = jest.fn(() => <div data-testid="documents-page" />)

jest.mock('@/components/documents/documents-page', () => ({
  DocumentsPage: (props: any) => mockDocumentsPage(props),
}))

jest.mock('@/app/actions/documents', () => ({
  getDocuments: jest.fn(),
}))

jest.mock('@/app/actions/tenants', () => ({
  getTenants: jest.fn(),
}))

const mockDocumentsData = [
  {
    id: 'd1',
    tenantId: 't1',
    title: 'Lease Agreement',
    type: 'lease',
    fileUrl: 'https://example.com/lease.pdf',
    uploadedAt: '2025-01-01T00:00:00Z',
    tenantName: 'John Doe',
    unitNumber: '101',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'd2',
    tenantId: null,
    title: 'Property Insurance',
    type: 'insurance',
    fileUrl: 'https://example.com/insurance.pdf',
    uploadedAt: '2025-01-15T00:00:00Z',
    tenantName: null,
    unitNumber: null,
    createdAt: '2025-01-15T00:00:00Z',
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

describe('Documents Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders documents page with fetched data', async () => {
    ;(getDocuments as jest.Mock).mockResolvedValue({
      success: true,
      data: mockDocumentsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await DocumentsRoute()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockDocumentsPage).toHaveBeenCalledTimes(1)
    expect(mockDocumentsPage).toHaveBeenCalledWith({
      initialDocuments: mockDocumentsData,
      tenants: mockTenantsData,
      error: null,
    })
  })

  it('handles error when fetching documents fails', async () => {
    ;(getDocuments as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
      error: 'Failed to fetch documents',
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: mockTenantsData,
      error: null,
    })

    const element = await DocumentsRoute()
    render(element)

    expect(mockDocumentsPage).toHaveBeenCalledWith({
      initialDocuments: [],
      tenants: mockTenantsData,
      error: 'Failed to fetch documents',
    })
  })

  it('handles empty tenants list gracefully', async () => {
    ;(getDocuments as jest.Mock).mockResolvedValue({
      success: true,
      data: mockDocumentsData,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: null,
      error: null,
    })

    const element = await DocumentsRoute()
    render(element)

    expect(mockDocumentsPage).toHaveBeenCalledWith({
      initialDocuments: mockDocumentsData,
      tenants: [],
      error: null,
    })
  })

  it('passes empty arrays when no data exists', async () => {
    ;(getDocuments as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      error: null,
    })

    const element = await DocumentsRoute()
    render(element)

    expect(mockDocumentsPage).toHaveBeenCalledWith({
      initialDocuments: [],
      tenants: [],
      error: null,
    })
  })
})
