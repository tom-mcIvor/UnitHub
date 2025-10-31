import { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } from '@/app/actions/documents'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockDocuments,
          error: null,
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockDocuments[0],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockDocuments[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockDocuments[0],
              error: null,
            })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null,
        })),
      })),
    })),
  })),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const mockDocuments = [
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Lease Agreement',
    type: 'lease',
    file_url: 'https://example.com/lease.pdf',
    uploaded_at: '2024-01-01T00:00:00.000Z',
    extracted_data: null,
    tenants: {
      name: 'John Doe',
      unit_number: '101',
    },
  },
]

describe('Document Server Actions', () => {
  describe('getDocuments', () => {
    it('should fetch all documents successfully', async () => {
      const result = await getDocuments()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('getDocument', () => {
    it('should fetch a single document by id', async () => {
      const result = await getDocument('123e4567-e89b-12d3-a456-426614174003')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.title).toBe('Lease Agreement')
    })
  })

  describe('createDocument', () => {
    it('should create a document successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('title', 'Insurance Certificate')
      formData.append('type', 'insurance')
      formData.append('fileUrl', 'https://example.com/insurance.pdf')
      formData.append('storagePath', 'documents/insurance-certificate.pdf')

      const result = await createDocument(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should create a document without tenant successfully', async () => {
      const formData = new FormData()
      formData.append('title', 'Property Insurance')
      formData.append('type', 'insurance')
      formData.append('fileUrl', 'https://example.com/property-insurance.pdf')
      formData.append('storagePath', 'documents/property-insurance.pdf')

      const result = await createDocument(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should return error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('title', 'Insurance Certificate')
      // Missing required fields

      const result = await createDocument(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Missing required fields')
      expect(result.data).toBe(null)
    })
  })

  describe('updateDocument', () => {
    it('should update a document successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('title', 'Lease Agreement - Updated')
      formData.append('type', 'lease')
      formData.append('fileUrl', 'https://example.com/lease-updated.pdf')

      const result = await updateDocument('123e4567-e89b-12d3-a456-426614174003', formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('deleteDocument', () => {
    it('should delete a document successfully', async () => {
      const result = await deleteDocument('123e4567-e89b-12d3-a456-426614174003')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })
})
