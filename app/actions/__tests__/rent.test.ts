import { getRentPayments, getRentPayment, createRentPayment, updateRentPayment, deleteRentPayment } from '@/app/actions/rent'
import { rentPaymentSchema } from '@/lib/schemas'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
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

const mockOverduePayment = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  tenant_id: '123e4567-e89b-12d3-a456-426614174000',
  amount: '1200.00',
  due_date: '2020-01-01', // Past due date
  paid_date: null,
  status: 'pending',
  notes: '',
  created_at: '2020-01-01T00:00:00.000Z',
  updated_at: '2020-01-01T00:00:00.000Z',
  tenants: {
    name: 'Jane Smith',
    unit_number: '102',
  },
}

describe('Rent Payment Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getRentPayments', () => {
    it('should fetch all rent payments successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: mockPayments,
              error: null,
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await getRentPayments()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })

    it('should return error when database query fails', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: null,
              error: { message: 'Database error' },
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await getRentPayments()

      expect(result.success).toBeUndefined()
      expect(result.error).toBe('Database error')
      expect(result.data).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      (createClient as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      const result = await getRentPayments()

      expect(result.error).toBe('Failed to fetch rent payments')
      expect(result.data).toBeNull()
    })

    it('should calculate overdue status for pending payments past due date', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            order: jest.fn(() => ({
              data: [mockOverduePayment],
              error: null,
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await getRentPayments()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data![0].status).toBe('overdue')
    })
  })

  describe('getRentPayment', () => {
    it('should fetch a single rent payment by ID', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockPayments[0],
                error: null,
              })),
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await getRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe('123e4567-e89b-12d3-a456-426614174001')
      expect(result.data?.tenantName).toBe('John Doe')
    })

    it('should return error when payment not found', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { message: 'Payment not found' },
              })),
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await getRentPayment('non-existent-id')

      expect(result.error).toBe('Payment not found')
      expect(result.data).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      (createClient as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      const result = await getRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.error).toBe('Failed to fetch rent payment')
      expect(result.data).toBeNull()
    })
  })

  describe('createRentPayment', () => {
    it('should create a rent payment successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockPayments[0],
                error: null,
              })),
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

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
      const parsed = rentPaymentSchema.safeParse(Object.fromEntries(formData))

      expect(result.success).toBe(false)
      if (!parsed.success) {
        expect(result.error).toBe(parsed.error.errors.map((e) => e.message).join('\n'))
      }
      expect(result.data).toBe(null)
    })

    it('should return error when database insert fails', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          insert: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: null,
                error: { message: 'Insert failed' },
              })),
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1200')
      formData.append('dueDate', '2024-02-01')
      formData.append('status', 'pending')

      const result = await createRentPayment(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
      expect(result.data).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      (createClient as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1200')
      formData.append('dueDate', '2024-02-01')
      formData.append('status', 'pending')

      const result = await createRentPayment(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create rent payment')
      expect(result.data).toBeNull()
    })
  })

  describe('updateRentPayment', () => {
    it('should update a rent payment successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
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
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

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

    it('should return error when validation fails', async () => {
      const formData = new FormData()
      // Missing required fields

      const result = await updateRentPayment('123e4567-e89b-12d3-a456-426614174001', formData)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.data).toBeNull()
    })

    it('should return error when database update fails', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => ({
                  data: null,
                  error: { message: 'Update failed' },
                })),
              })),
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1300')
      formData.append('dueDate', '2024-02-01')
      formData.append('status', 'paid')

      const result = await updateRentPayment('123e4567-e89b-12d3-a456-426614174001', formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
      expect(result.data).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      (createClient as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('amount', '1300')
      formData.append('dueDate', '2024-02-01')
      formData.append('status', 'paid')

      const result = await updateRentPayment('123e4567-e89b-12d3-a456-426614174001', formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update rent payment')
      expect(result.data).toBeNull()
    })
  })

  describe('deleteRentPayment', () => {
    it('should delete a rent payment successfully', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          delete: jest.fn(() => ({
            eq: jest.fn(() => ({
              error: null,
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await deleteRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should return error when database delete fails', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          delete: jest.fn(() => ({
            eq: jest.fn(() => ({
              error: { message: 'Delete failed' },
            })),
          })),
        })),
      };
      (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const result = await deleteRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
    })

    it('should handle unexpected errors', async () => {
      (createClient as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      const result = await deleteRentPayment('123e4567-e89b-12d3-a456-426614174001')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete rent payment')
    })
  })
})