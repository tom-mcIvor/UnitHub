import { getRentPayments, createRentPayment, updateRentPayment, deleteRentPayment } from '@/app/actions/rent'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockPayments,
          error: null,
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockPayments[0],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockPayments[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockPayments[0],
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

const mockPayments = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    amount: '1200.00',
    due_date: '2024-01-01',
    paid_date: '2024-01-01',
    status: 'paid',
    notes: 'Payment received',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    tenants: {
      name: 'John Doe',
      unit_number: '101',
    },
  },
]

describe('Rent Payment Server Actions', () => {
  describe('getRentPayments', () => {
    it('should fetch all rent payments successfully', async () => {
      const result = await getRentPayments()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('createRentPayment', () => {
    it('should create a rent payment successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1200')
      formData.append('dueDate', '2024-02-01')
      formData.append('paidDate', '2024-02-01')
      formData.append('status', 'paid')
      formData.append('notes', 'Test payment')

      const result = await createRentPayment(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should return error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      // Missing required fields

      const result = await createRentPayment(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Missing required fields')
      expect(result.data).toBe(null)
    })
  })

  describe('updateRentPayment', () => {
    it('should update a rent payment successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1300')
      formData.append('dueDate', '2024-02-01')
      formData.append('paidDate', '2024-02-02')
      formData.append('status', 'paid')
      formData.append('notes', 'Updated payment')

      const result = await updateRentPayment('123e4567-e89b-12d3-a456-426614174001', formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('deleteRentPayment', () => {
    it('should delete a rent payment successfully', async () => {
      const result = await deleteRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })
})
