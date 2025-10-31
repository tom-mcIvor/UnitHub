import { getTenants, getTenant, createTenant, updateTenant, deleteTenant } from '@/app/actions/tenants'
import { tenantSchema } from '@/lib/schemas'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockTenants,
          error: null,
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockTenants[0],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockTenants[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockTenants[0],
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

const mockTenants = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    unit_number: '101',
    lease_start_date: '2024-01-01',
    lease_end_date: '2025-01-01',
    rent_amount: '1200.00',
    deposit_amount: '1200.00',
    pet_policy: 'No pets',
    notes: 'Good tenant',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
]

describe('Tenant Server Actions', () => {
  describe('getTenants', () => {
    it('should fetch all tenants successfully', async () => {
      const result = await getTenants()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('getTenant', () => {
    it('should fetch a single tenant by id', async () => {
      const result = await getTenant('123e4567-e89b-12d3-a456-426614174000')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.name).toBe('John Doe')
    })
  })

  describe('createTenant', () => {
    it('should create a tenant successfully', async () => {
      const formData = new FormData()
      formData.append('name', 'Jane Smith')
      formData.append('email', 'jane@example.com')
      formData.append('phone', '555-123-5678')
      formData.append('unitNumber', '102')
      formData.append('leaseStartDate', '2024-02-01')
      formData.append('leaseEndDate', '2025-02-01')
      formData.append('rentAmount', '1300')
      formData.append('depositAmount', '1300')
      formData.append('petPolicy', 'Cats allowed')
      formData.append('notes', 'New tenant')

      const result = await createTenant(formData)

      if (!result.success) {
        console.log('Create tenant error:', result.error)
      }

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should return error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('name', 'Jane Smith')
      // Missing required fields

      const result = await createTenant(formData)
      const parsed = tenantSchema.safeParse(Object.fromEntries(formData))

      expect(result.success).toBe(false)
      if (!parsed.success) {
        expect(result.error).toBe(parsed.error.errors.map((e) => e.message).join('\n'))
      }
    })
  })

  describe('updateTenant', () => {
    it('should update a tenant successfully', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe Updated')
      formData.append('email', 'john.updated@example.com')
      formData.append('phone', '555-123-9999')
      formData.append('unitNumber', '101')
      formData.append('leaseStartDate', '2024-01-01')
      formData.append('leaseEndDate', '2025-01-01')
      formData.append('rentAmount', '1250')
      formData.append('depositAmount', '1250')
      formData.append('petPolicy', 'No pets')
      formData.append('notes', 'Updated notes')

      const result = await updateTenant('123e4567-e89b-12d3-a456-426614174000', formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('deleteTenant', () => {
    it('should delete a tenant successfully', async () => {
      const result = await deleteTenant('123e4567-e89b-12d3-a456-426614174000')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })
})