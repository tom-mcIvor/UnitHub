import {
  getCommunicationLogs,
  getCommunicationLog,
  createCommunicationLog,
  updateCommunicationLog,
  deleteCommunicationLog,
} from '@/app/actions/communications'
import { communicationLogSchema } from '@/lib/schemas'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const { createClient } = jest.requireMock('@/lib/supabase/server')
const { revalidatePath } = jest.requireMock('next/cache')

const logRow = {
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
}

const mappedLog = {
  id: logRow.id,
  tenantId: logRow.tenant_id,
  type: logRow.type,
  subject: logRow.subject,
  content: logRow.content,
  createdAt: logRow.created_at,
  tenantName: logRow.tenants?.name ?? 'Unknown',
  unitNumber: logRow.tenants?.unit_number ?? 'N/A',
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
  formData.append('tenantId', overrides.tenantId ?? logRow.tenant_id)
  formData.append('type', overrides.type ?? 'email')
  formData.append('subject', overrides.subject ?? 'Rent Reminder')
  formData.append('content', overrides.content ?? 'Rent due next week')
  return formData
}

describe('Communication Log Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCommunicationLogs', () => {
    it('returns mapped logs on success', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: [logRow],
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getCommunicationLogs()

      expect(createClient).toHaveBeenCalled()
      expect(result.error).toBeNull()
      expect(result.data).toEqual([mappedLog])
      expect(supabase.from).toHaveBeenCalledWith('communication_logs')
    })

    it('returns Supabase error message', async () => {
      const supabase = createSupabaseMock()
      supabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database failure' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getCommunicationLogs()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Database failure')
    })

    it('handles unexpected createClient rejection', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await getCommunicationLogs()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch communication logs')
    })
  })

  describe('getCommunicationLog', () => {
    it('returns mapped log on success', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: logRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getCommunicationLog(logRow.id)

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mappedLog)
      expect(supabase.from).toHaveBeenCalledWith('communication_logs')
    })

    it('propagates Supabase single error', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: null,
        error: { message: 'Log not found' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getCommunicationLog('missing-id')

      expect(result.data).toBeNull()
      expect(result.error).toBe('Log not found')
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('boom'))

      const result = await getCommunicationLog(logRow.id)

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch communication log')
    })
  })

  describe('createCommunicationLog', () => {
    it('creates log and revalidates path', async () => {
      const supabase = createSupabaseMock()
      const insertRow = { ...logRow, tenants: undefined }
      supabase.insertSingle.mockResolvedValue({
        data: insertRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createCommunicationLog(buildFormData())

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        id: insertRow.id,
        tenantId: insertRow.tenant_id,
        type: insertRow.type,
        subject: insertRow.subject,
        content: insertRow.content,
        createdAt: insertRow.created_at,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/communications')
    })

    it('returns validation errors for invalid payload', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('tenantId', '')

      const result = await createCommunicationLog(invalidForm)
      const raw = Object.fromEntries(invalidForm as any)
      const parsed = communicationLogSchema.safeParse(raw)

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

      const result = await createCommunicationLog(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('timeout'))

      const result = await createCommunicationLog(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create communication log')
      expect(result.data).toBeNull()
    })
  })

  describe('updateCommunicationLog', () => {
    it('updates log and revalidates path', async () => {
      const supabase = createSupabaseMock()
      const updatedRow = { ...logRow, subject: 'Updated Subject' }
      supabase.updateSingle.mockResolvedValue({
        data: updatedRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateCommunicationLog(
        logRow.id,
        buildFormData({ subject: 'Updated Subject' })
      )

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        id: updatedRow.id,
        tenantId: updatedRow.tenant_id,
        type: updatedRow.type,
        subject: updatedRow.subject,
        content: updatedRow.content,
        createdAt: updatedRow.created_at,
      })
      expect(revalidatePath).toHaveBeenCalledWith('/communications')
    })

    it('returns validation errors when payload invalid', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidForm = new FormData()
      invalidForm.append('tenantId', '')

      const result = await updateCommunicationLog(logRow.id, invalidForm)
      const raw = Object.fromEntries(invalidForm as any)
      const parsed = communicationLogSchema.safeParse(raw)

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

      const result = await updateCommunicationLog(logRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('unavailable'))

      const result = await updateCommunicationLog(logRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update communication log')
    })
  })

  describe('deleteCommunicationLog', () => {
    it('deletes log and revalidates path', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: null })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteCommunicationLog(logRow.id)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(revalidatePath).toHaveBeenCalledWith('/communications')
    })

    it('propagates Supabase delete error', async () => {
      const supabase = createSupabaseMock()
      supabase.deleteEq.mockResolvedValue({ error: { message: 'Delete failed' } })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteCommunicationLog(logRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected rejection from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await deleteCommunicationLog(logRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete communication log')
    })
  })
})
