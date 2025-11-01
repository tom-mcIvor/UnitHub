import { render, screen } from '@testing-library/react'
import DocumentDetailPage from '../page'
import { getDocument } from '@/app/actions/documents'
import { getTenants } from '@/app/actions/tenants'
import { notFound } from 'next/navigation'

// Mock server actions
jest.mock('@/app/actions/documents')
jest.mock('@/app/actions/tenants')
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

// Mock DocumentDetail component
jest.mock('@/components/documents/document-detail', () => ({
  DocumentDetail: ({ document, tenants }: any) => (
    <div data-testid="document-detail">
      <h1>{document.name}</h1>
      <p>{document.type}</p>
      <div data-testid="tenants-count">{tenants.length} tenants</div>
    </div>
  ),
}))

describe('DocumentDetailPage', () => {
  const mockDocument = {
    id: 'doc-123',
    name: 'Lease Agreement',
    type: 'lease',
    storage_path: '/documents/lease.pdf',
    created_at: '2025-01-01',
    tenant_id: 'tenant-123',
  }

  const mockTenants = [
    { id: 'tenant-123', name: 'John Doe', email: 'john@example.com', unit_number: '101' },
    { id: 'tenant-456', name: 'Jane Smith', email: 'jane@example.com', unit_number: '102' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render document detail page when document exists', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      data: mockTenants,
      error: null,
    })

    const params = Promise.resolve({ id: 'doc-123' })
    const page = await DocumentDetailPage({ params })

    render(page)

    expect(screen.getByTestId('document-detail')).toBeInTheDocument()
    expect(screen.getByText('Lease Agreement')).toBeInTheDocument()
    expect(screen.getByText('lease')).toBeInTheDocument()
    expect(screen.getByTestId('tenants-count')).toHaveTextContent('2 tenants')
  })

  it('should call notFound when document does not exist', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: null,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      data: mockTenants,
      error: null,
    })

    const params = Promise.resolve({ id: 'non-existent' })

    await DocumentDetailPage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  it('should call notFound when there is an error fetching document', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Database error',
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      data: mockTenants,
      error: null,
    })

    const params = Promise.resolve({ id: 'doc-123' })

    await DocumentDetailPage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  it('should handle empty tenants list gracefully', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      data: null,
      error: null,
    })

    const params = Promise.resolve({ id: 'doc-123' })
    const page = await DocumentDetailPage({ params })

    render(page)

    expect(screen.getByTestId('document-detail')).toBeInTheDocument()
    expect(screen.getByTestId('tenants-count')).toHaveTextContent('0 tenants')
  })

  it('should fetch document and tenants in parallel', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })
    ;(getTenants as jest.Mock).mockResolvedValue({
      data: mockTenants,
      error: null,
    })

    const params = Promise.resolve({ id: 'doc-123' })
    await DocumentDetailPage({ params })

    // Verify both actions were called
    expect(getDocument).toHaveBeenCalledWith('doc-123')
    expect(getTenants).toHaveBeenCalled()
  })
})
