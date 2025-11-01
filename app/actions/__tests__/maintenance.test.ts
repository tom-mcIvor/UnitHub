import {
  getMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} from '@/app/actions/maintenance'
import { maintenanceRequestSchema } from '@/lib/schemas'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const { createClient } = jest.requireMock('@/lib/supabase/server')
const { revalidatePath } = jest.requireMock('next/cache')

const maintenanceRow = {
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
}

const mappedMaintenance = {
  id: maintenanceRow.id,
  tenantId: maintenanceRow.tenant_id,
  title: maintenanceRow.title,
  description: maintenanceRow.description,
  category: maintenanceRow.category,
  priority: maintenanceRow.priority,
  status: maintenanceRow.status,
  estimatedCost: maintenanceRow.estimated_cost ? parseFloat(maintenanceRow.estimated_cost) : undefined,
  actualCost: maintenanceRow.actual_cost ? parseFloat(maintenanceRow.actual_cost) : undefined,
  assignedVendor: maintenanceRow.assigned_vendor ?? undefined,
  photos: maintenanceRow.photos,
  createdAt: maintenanceRow.created_at,
  updatedAt: maintenanceRow.updated_at,
  tenantName: maintenanceRow.tenants?.name ?? 'Unknown',
  unitNumber: maintenanceRow.tenants?.unit_number ?? 'N/A',
}

const createSupabaseMock = () => {
  const order = jest.fn()
  const selectSingle = jest.fn()
  const insertSingle = jest.fn()
  const updateSingle = jest.fn()
  const deleteEq = jest.fn()

  const from = jest.fn(() => ({
    select: jest.fn(() => ({
      order,
      eq: jest.fn(() => ({
        single: selectSingle,
      })),
      single: selectSingle,
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: insertSingle,
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        select: jest.fn(() => ({
          single: updateSingle,
        })),
      })),
    })),
    delete: jest.fn(() => ({
      eq: deleteEq,
    })),
  }))

  return {
    client: { from },
    order,
    selectSingle,
    insertSingle,
    updateSingle,
    deleteEq,
    from,
  }
}

const buildFormData = (overrides: Partial<Record<string, string>> = {}) => {
  const formData = new FormData()
  formData.append('tenantId', overrides.tenantId ?? maintenanceRow.tenant_id)
  formData.append('title', overrides.title ?? maintenanceRow.title)
  formData.append('description', overrides.description ?? maintenanceRow.description)
  formData.append('category', overrides.category ?? maintenanceRow.category)
  formData.append('priority', overrides.priority ?? maintenanceRow.priority)
  formData.append('status', overrides.status ?? maintenanceRow.status)
  if (overrides.estimatedCost !== undefined) {
    formData.append('estimatedCost', overrides.estimatedCost)
  } else if (maintenanceRow.estimated_cost) {
    formData.append('estimatedCost', maintenanceRow.estimated_cost)
  } else {
    formData.append('estimatedCost', '')
  }
  if (overrides.assignedVendor !== undefined) {
    formData.append('assignedVendor', overrides.assignedVendor)
  } else if (maintenanceRow.assigned_vendor) {
    formData.append('assignedVendor', maintenanceRow.assigned_vendor)
  } else {
    formData.append('assignedVendor', '')
  }
  return formData
}

describe('Maintenance Request Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMaintenanceRequests', () => {
    it('returns mapped requests on success', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: [maintenanceRow],
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getMaintenanceRequests()

      expect(createClient).toHaveBeenCalled()
      expect(supabase.from).toHaveBeenCalledWith('maintenance_requests')
      expect(result.error).toBeNull()
      expect(result.data).toEqual([mappedMaintenance])
    })

    it('returns Supabase error message', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database failure' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getMaintenanceRequests()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Database failure')
    })

    it('handles unexpected createClient rejection', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await getMaintenanceRequests()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch maintenance requests')
    })
  })

  describe('getMaintenanceRequest', () => {
    it('returns mapped request on success', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: maintenanceRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getMaintenanceRequest(maintenanceRow.id)

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mappedMaintenance)
    })

    it('propagates Supabase single error', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: null,
        error: { message: 'Request not found' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getMaintenanceRequest('missing-id')

      expect(result.data).toBeNull()
      expect(result.error).toBe('Request not found')
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('boom'))

      const result = await getMaintenanceRequest(maintenanceRow.id)

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch maintenance request')
    })
  })

  describe('createMaintenanceRequest', () => {
    it('creates request and revalidates path', async () => {
      const supabase = createSupabaseMock()
      const insertRow = { ...maintenanceRow, tenants: undefined }
      supabase.insertSingle.mockResolvedValue({
        data: insertRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createMaintenanceRequest(
        buildFormData({ estimatedCost: '150', assignedVendor: 'ABC Plumbing' })
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        id: insertRow.id,
        tenantId: insertRow.tenant_id,
        title: insertRow.title,
        description: insertRow.description,
        category: insertRow.category,
        priority: insertRow.priority,
        status: insertRow.status,
        estimatedCost: insertRow.estimated_cost ? parseFloat(insertRow.estimated_cost) : undefined,
        actualCost: insertRow.actual_cost ? parseFloat(insertRow.actual_cost) : undefined,
        assignedVendor: insertRow.assigned_vendor ?? undefined,
        photos: insertRow.photos,
        createdAt: insertRow.created_at,
        updatedAt: insertRow.updated_at,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/maintenance')
    })

    it('returns validation errors for invalid payload', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('title', 'Broken AC')

      const result = await createMaintenanceRequest(invalidForm)
      const raw = Object.fromEntries(invalidForm as any)
      const parsed = maintenanceRequestSchema.safeParse({
        ...raw,
        estimatedCost: raw.estimatedCost ? parseFloat(raw.estimatedCost as string) : undefined,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe(parsed.success ? null : parsed.error.errors.map((err) => err.message).join('\n'))
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns Supabase error message on insert failure', async () => {
      const supabase = createSupabaseMock()
      supabase.insertSingle.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createMaintenanceRequest(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('timeout'))

      const result = await createMaintenanceRequest(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create maintenance request')
      expect(result.data).toBeNull()
    })
  })

  describe('updateMaintenanceRequest', () => {
    it('updates request and revalidates path', async () => {
      const supabase = createSupabaseMock()
      const updatedRow = {
        ...maintenanceRow,
        title: 'Leaky faucet - Fixed',
        updated_at: '2024-01-02T00:00:00.000Z',
      }
      supabase.updateSingle.mockResolvedValue({
        data: updatedRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateMaintenanceRequest(
        maintenanceRow.id,
        buildFormData({ title: 'Leaky faucet - Fixed' })
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        id: updatedRow.id,
        tenantId: updatedRow.tenant_id,
        title: updatedRow.title,
        description: updatedRow.description,
        category: updatedRow.category,
        priority: updatedRow.priority,
        status: updatedRow.status,
        estimatedCost: updatedRow.estimated_cost ? parseFloat(updatedRow.estimated_cost) : undefined,
        actualCost: updatedRow.actual_cost ? parseFloat(updatedRow.actual_cost) : undefined,
        assignedVendor: updatedRow.assigned_vendor ?? undefined,
        photos: updatedRow.photos,
        createdAt: updatedRow.created_at,
        updatedAt: updatedRow.updated_at,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/maintenance')
    })

    it('returns validation errors when payload invalid', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('tenantId', '')

      const result = await updateMaintenanceRequest(maintenanceRow.id, invalidForm)
      const raw = Object.fromEntries(invalidForm as any)
      const parsed = maintenanceRequestSchema.safeParse({
        ...raw,
        estimatedCost: raw.estimatedCost ? parseFloat(raw.estimatedCost as string) : undefined,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe(parsed.success ? null : parsed.error.errors.map((err) => err.message).join('\n'))
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('propagates Supabase error message on failure', async () => {
      const supabase = createSupabaseMock()
      supabase.updateSingle.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateMaintenanceRequest(maintenanceRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('unavailable'))

      const result = await updateMaintenanceRequest(maintenanceRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update maintenance request')
    })
  })

  describe('deleteMaintenanceRequest', () => {
    it('deletes request and revalidates path', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: null })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteMaintenanceRequest(maintenanceRow.id)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(revalidatePath).toHaveBeenCalledWith('/maintenance')
    })

    it('propagates Supabase delete error', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: { message: 'Delete failed' } })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteMaintenanceRequest(maintenanceRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await deleteMaintenanceRequest(maintenanceRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete maintenance request')
    })
  })
})
