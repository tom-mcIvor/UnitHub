import { getMaintenanceRequests, getMaintenanceRequest, createMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } from '@/app/actions/maintenance'
import { maintenanceRequestSchema } from '@/lib/schemas'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockRequests,
          error: null,
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockRequests[0],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockRequests[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockRequests[0],
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

const mockRequests = [
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    tenant_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Leaky faucet',
    description: 'Kitchen faucet is dripping',
    category: 'plumbing',
    priority: 'medium',
    status: 'open',
    estimated_cost: '150.00',
    actual_cost: null,
    assigned_vendor: 'ABC Plumbing',
    photos: [],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    tenants: {
      name: 'John Doe',
      unit_number: '101',
    },
  },
]

describe('Maintenance Request Server Actions', () => {
  describe('getMaintenanceRequests', () => {
    it('should fetch all maintenance requests successfully', async () => {
      const result = await getMaintenanceRequests()

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('getMaintenanceRequest', () => {
    it('should fetch a single maintenance request by id', async () => {
      const result = await getMaintenanceRequest('123e4567-e89b-12d3-a456-426614174002')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data?.title).toBe('Leaky faucet')
    })
  })

  describe('createMaintenanceRequest', () => {
    it('should create a maintenance request successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('title', 'Broken AC')
      formData.append('description', 'Air conditioner not working')
      formData.append('category', 'hvac')
      formData.append('priority', 'high')
      formData.append('status', 'open')
      formData.append('estimatedCost', '500')
      formData.append('assignedVendor', 'Cool Air Services')

      const result = await createMaintenanceRequest(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should return error when required fields are missing', async () => {
      const formData = new FormData()
      formData.append('title', 'Broken AC')
      // Missing required fields

      const result = await createMaintenanceRequest(formData)
      const parsed = maintenanceRequestSchema.safeParse(Object.fromEntries(formData))

      expect(result.success).toBe(false)
      if (!parsed.success) {
        expect(result.error).toBe(parsed.error.errors.map((e) => e.message).join('\n'))
      }
      expect(result.data).toBe(null)
    })
  })

  describe('updateMaintenanceRequest', () => {
    it('should update a maintenance request successfully', async () => {
      const formData = new FormData()
      formData.append('tenantId', '123e4567-e89b-12d3-a456-426614174000')
      formData.append('title', 'Leaky faucet - Fixed')
      formData.append('description', 'Kitchen faucet is dripping - now fixed')
      formData.append('category', 'plumbing')
      formData.append('priority', 'medium')
      formData.append('status', 'completed')
      formData.append('estimatedCost', '150')
      formData.append('actualCost', '125')
      formData.append('assignedVendor', 'ABC Plumbing')

      const result = await updateMaintenanceRequest('123e4567-e89b-12d3-a456-426614174002', formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('deleteMaintenanceRequest', () => {
    it('should delete a maintenance request successfully', async () => {
      const result = await deleteMaintenanceRequest('123e4567-e89b-12d3-a456-426614174002')

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })
})