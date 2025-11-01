import { GET } from '../route'
import { getDocument } from '@/app/actions/documents'
import { createAdminClient } from '@/lib/supabase/admin'

// Mock dependencies
jest.mock('@/app/actions/documents')
jest.mock('@/lib/supabase/admin')

// Mock Request
function createRequest(): Request {
  return {} as Request
}

describe('GET /api/documents/[id]/download', () => {
  const mockDocument = {
    id: 'doc-123',
    title: 'Lease Agreement',
    type: 'lease',
    storagePath: 'documents/lease-agreement.pdf',
    created_at: '2025-01-01',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 when document id is missing', async () => {
    const request = createRequest()
    const response = await GET(request, { params: { id: '' } })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Missing document id')
  })

  it('should return 404 when document is not found', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Document not found',
    })

    const request = createRequest()
    const response = await GET(request, { params: { id: 'non-existent' } })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe('Document not found')
  })

  it('should return 404 when document is missing storage path', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: { ...mockDocument, storagePath: null },
      error: null,
    })

    const request = createRequest()
    const response = await GET(request, { params: { id: 'doc-123' } })

    expect(response.status).toBe(404)
    const body = await response.json()
    expect(body.error).toBe('Document is missing storage path')
  })

  it('should call storage download when document exists with storage path', async () => {
    // Mock blob-like object
    const mockData = {
      type: 'application/pdf',
      arrayBuffer: async () => new ArrayBuffer(12),
    };

    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })

    const mockDownload = jest.fn().mockResolvedValue({
      data: mockData,
      error: null,
    })

    const mockStorage = {
      from: jest.fn().mockReturnValue({
        download: mockDownload,
      }),
    }

    ;(createAdminClient as jest.Mock).mockReturnValue({
      storage: mockStorage,
    })

    const request = createRequest()
    await GET(request, { params: { id: 'doc-123' } })

    // Verify the correct storage methods were called
    expect(mockStorage.from).toHaveBeenCalledWith('UnitHubDocuments')
    expect(mockDownload).toHaveBeenCalledWith('documents/lease-agreement.pdf')
  })

  it('should return 500 when storage download fails', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })

    const mockStorage = {
      from: jest.fn().mockReturnValue({
        download: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Storage error' },
        }),
      }),
    }

    ;(createAdminClient as jest.Mock).mockReturnValue({
      storage: mockStorage,
    })

    const request = createRequest()
    const response = await GET(request, { params: { id: 'doc-123' } })

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toBe('Storage error')
  })


  it('should handle unexpected errors during download', async () => {
    (getDocument as jest.Mock).mockResolvedValue({
      data: mockDocument,
      error: null,
    })

    ;(createAdminClient as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error')
    })

    const request = createRequest()
    const response = await GET(request, { params: { id: 'doc-123' } })

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body.error).toBe('Unexpected error downloading document')
  })

})
