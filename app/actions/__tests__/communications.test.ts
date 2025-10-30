import { getCommunicationLogs, getCommunicationLog, createCommunicationLog, updateCommunicationLog, deleteCommunicationLog } from '@/app/actions/communications'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockLogs,
          error: null,
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockLogs[0],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockLogs[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockLogs[0],
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

const mockLogs = [
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'email',
    subject: 'Rent Reminder',
    content: 'Rent due next week',
    created_at: '2024-01-01T00:00:00.000Z',
    tenants: {
      name: 'John Doe',
      unit_number: '101',
    },
  },
]

describe('Communication Log Server Actions', () => {
  describe('getCommunicationLogs', () => {
    it('should fetch all communication logs successfully', async () => {
      const result = await getCommunicationLogs()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('getCommunicationLog', () => {
    it('should fetch a single communication log by id', async () => {
      const result = await getCommunicationLog('123e4567-e89b-12d3-a456-426614174004')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.subject).toBe('Rent Reminder')
    })
  })

  describe('createCommunicationLog', () => {
    it('should create a communication log successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('type', 'phone')
      formData.append('subject', 'Maintenance Follow-up')
      formData.append('content', 'Called to confirm maintenance appointment')

      const result = await createCommunicationLog(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should return error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('type', 'email')
      // Missing required fields

      const result = await createCommunicationLog(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Missing required fields')
      expect(result.data).toBe(null)
    })
  })

  describe('updateCommunicationLog', () => {
    it('should update a communication log successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('type', 'email')
      formData.append('subject', 'Rent Reminder - Updated')
      formData.append('content', 'Rent due next week - second reminder sent')

      const result = await updateCommunicationLog('123e4567-e89b-12d3-a456-426614174004', formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('deleteCommunicationLog', () => {
    it('should delete a communication log successfully', async () => {
      const result = await deleteCommunicationLog('123e4567-e89b-12d3-a456-426614174004')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })
})
