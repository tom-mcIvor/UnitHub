import {
  getTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
} from '@/app/actions/tenants'
import { tenantSchema } from '@/lib/schemas'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const { createClient } = jest.requireMock('@/lib/supabase/server')
const { revalidatePath } = jest.requireMock('next/cache')

const tenantRow = {
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
  created_at: '2024-01-01T12:00:00.000Z',
  updated_at: '2024-01-10T12:00:00.000Z',
}

const mappedTenant = {
  id: tenantRow.id,
  name: tenantRow.name,
  email: tenantRow.email,
  phone: tenantRow.phone,
  unitNumber: tenantRow.unit_number,
  leaseStartDate: tenantRow.lease_start_date,
  leaseEndDate: tenantRow.lease_end_date,
  rentAmount: Number(tenantRow.rent_amount),
  depositAmount: Number(tenantRow.deposit_amount),
  petPolicy: tenantRow.pet_policy,
  notes: tenantRow.notes,
  createdAt: tenantRow.created_at,
  updatedAt: tenantRow.updated_at,
}

const buildFormData = (overrides: Record<string, string> = {}) => {
  const formData = new FormData()
  formData.append('name', overrides.name ?? 'Jane Smith')
  formData.append('email', overrides.email ?? 'jane@example.com')
  formData.append('phone', overrides.phone ?? '555-123-5678')
  formData.append('unitNumber', overrides.unitNumber ?? '102')
  formData.append('leaseStartDate', overrides.leaseStartDate ?? '2024-02-01')
  formData.append('leaseEndDate', overrides.leaseEndDate ?? '2025-02-01')
  formData.append('rentAmount', overrides.rentAmount ?? '1300')
  formData.append('depositAmount', overrides.depositAmount ?? '1300')
  if (overrides.petPolicy !== undefined) {
    formData.append('petPolicy', overrides.petPolicy)
  } else {
    formData.append('petPolicy', 'Cats allowed')
  }
  if (overrides.notes !== undefined) {
    formData.append('notes', overrides.notes)
  } else {
    formData.append('notes', 'New tenant')
  }
  return formData
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
    from,
    order,
    selectSingle,
    insertSingle,
    updateSingle,
    deleteEq,
  }
}

describe('Tenant Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTenants', () => {
    it('returns mapped tenants on success', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: [tenantRow],
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getTenants()

      expect(createClient).toHaveBeenCalled()
      expect(supabase.from).toHaveBeenCalledWith('tenants')
      expect(result.error).toBeNull()
      expect(result.data).toEqual([mappedTenant])
    })

    it('returns error when Supabase query fails', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database failure' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getTenants()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Database failure')
    })

    it('handles unexpected rejections from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await getTenants()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch tenants')
    })
  })

  describe('getTenant', () => {
    it('returns mapped tenant when found', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: tenantRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getTenant(tenantRow.id)

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mappedTenant)
      expect(supabase.from).toHaveBeenCalledWith('tenants')
    })

    it('propagates Supabase error message when record missing', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: null,
        error: { message: 'Tenant not found' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getTenant('missing-id')

      expect(result.data).toBeNull()
      expect(result.error).toBe('Tenant not found')
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('boom'))

      const result = await getTenant(tenantRow.id)

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch tenant')
    })
  })

  describe('createTenant', () => {
    it('creates tenant and revalidates index path', async () => {
      const supabase = createSupabaseMock()
      supabase.insertSingle.mockResolvedValue({
        data: tenantRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createTenant(buildFormData())

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual(mappedTenant)
      expect(revalidatePath).toHaveBeenCalledWith('/tenants')
    })

    it('returns validation errors for invalid payload', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('name', 'Jane')

      const result = await createTenant(invalidForm)
      const rawData = Object.fromEntries(invalidForm as any)
      const validation = tenantSchema.safeParse({
        ...rawData,
        rentAmount: rawData.rentAmount ? parseFloat(rawData.rentAmount as string) : undefined,
        depositAmount: rawData.depositAmount ? parseFloat(rawData.depositAmount as string) : undefined,
      })

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBe(validation.success ? null : validation.error.errors.map((err) => err.message).join('\n'))
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns Supabase error message on insert failure', async () => {
      const supabase = createSupabaseMock()
      supabase.insertSingle.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createTenant(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('timeout'))

      const result = await createTenant(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create tenant')
    })
  })

  describe('updateTenant', () => {
    it('updates tenant and revalidates related paths', async () => {
      const supabase = createSupabaseMock()
      const updatedRow = { ...tenantRow, name: 'John Updated', notes: 'Updated notes' }
      supabase.updateSingle.mockResolvedValue({
        data: updatedRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateTenant(
        tenantRow.id,
        buildFormData({
          name: 'John Updated',
          notes: 'Updated notes',
        })
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        ...mappedTenant,
        name: 'John Updated',
        notes: 'Updated notes',
      })
      expect(revalidatePath).toHaveBeenCalledWith('/tenants')
      expect(revalidatePath).toHaveBeenCalledWith(`/tenants/${tenantRow.id}`)
    })

    it('returns validation errors on invalid payload', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('name', '')

      const result = await updateTenant(tenantRow.id, invalidForm)
      const rawData = Object.fromEntries(invalidForm as any)
      const validation = tenantSchema.safeParse({
        ...rawData,
        rentAmount: rawData.rentAmount ? parseFloat(rawData.rentAmount as string) : undefined,
        depositAmount: rawData.depositAmount ? parseFloat(rawData.depositAmount as string) : undefined,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe(validation.success ? null : validation.error.errors.map((err) => err.message).join('\n'))
      expect(result.data).toBeUndefined()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('propagates Supabase error message on failure', async () => {
      const supabase = createSupabaseMock()
      supabase.updateSingle.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateTenant(tenantRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('unavailable'))

      const result = await updateTenant(tenantRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update tenant')
    })
  })

  describe('deleteTenant', () => {
    it('deletes tenant and revalidates index', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: null })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteTenant(tenantRow.id)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(revalidatePath).toHaveBeenCalledWith('/tenants')
    })

    it('returns Supabase error message when delete fails', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: { message: 'Delete failed' } })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteTenant(tenantRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await deleteTenant(tenantRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete tenant')
    })
  })
})
