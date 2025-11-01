import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '@/app/actions/documents'
import { documentMetadataSchema } from '@/lib/schemas'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/supabase/admin', () => ({
  createAdminClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

const { createClient } = jest.requireMock('@/lib/supabase/server')
const { createAdminClient } = jest.requireMock('@/lib/supabase/admin')
const { revalidatePath } = jest.requireMock('next/cache')

const documentRow = {
  id: '123e4567-e89b-12d3-a456-426614174003',
  tenant_id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Lease Agreement',
  type: 'lease',
  file_url: 'https://example.com/lease.pdf',
  storage_path: 'documents/lease-agreement.pdf',
  uploaded_at: '2024-01-01T00:00:00.000Z',
  extracted_data: { clause: 'Rent due first of month' },
  tenants: {
    name: 'John Doe',
    unit_number: '101',
  },
}

const baseDocument = {
  id: documentRow.id,
  tenantId: documentRow.tenant_id,
  title: documentRow.title,
  type: documentRow.type,
  fileUrl: documentRow.file_url,
  storagePath: documentRow.storage_path,
  uploadedAt: documentRow.uploaded_at,
  extractedData: documentRow.extracted_data,
}

const mappedDocument = {
  ...baseDocument,
  tenantName: documentRow.tenants?.name,
  unitNumber: documentRow.tenants?.unit_number,
}

const createSupabaseMock = () => {
  const selectOrder = jest.fn()
  const selectSingle = jest.fn()
  const insertSingle = jest.fn()
  const updateSingle = jest.fn()
  const deleteEq = jest.fn()

  const mockUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00.000Z',
  }

  const auth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
  }

  const from = jest.fn(() => ({
    select: jest.fn(() => ({
      order: selectOrder,
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: selectSingle,
        })),
        single: selectSingle,
        order: selectOrder,
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
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: updateSingle,
          })),
        })),
        select: jest.fn(() => ({
          single: updateSingle,
        })),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: deleteEq,
      })),
    })),
  }))

  return {
    client: { from, auth },
    selectOrder,
    selectSingle,
    insertSingle,
    updateSingle,
    deleteEq,
    from,
    auth,
    mockUser,
  }
}

const createAdminMock = () => {
  const remove = jest.fn().mockResolvedValue({ error: null })
  const storageFrom = jest.fn(() => ({ remove }))
  return {
    admin: {
      storage: {
        from: storageFrom,
      },
    },
    remove,
    storageFrom,
  }
}

const buildFormData = (overrides: Record<string, string | undefined> = {}) => {
  const formData = new FormData()
  formData.append('tenantId', overrides.tenantId ?? documentRow.tenant_id)
  formData.append('title', overrides.title ?? documentRow.title)
  formData.append('type', overrides.type ?? documentRow.type)
  formData.append('fileUrl', overrides.fileUrl ?? documentRow.file_url)
  const storagePath = overrides.storagePath ?? documentRow.storage_path
  if (storagePath) {
    formData.append('storagePath', storagePath)
  }
  return formData
}

describe('Document Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDocuments', () => {
    it('returns mapped documents on success', async () => {
      const supabase = createSupabaseMock()
      supabase.selectOrder.mockResolvedValue({
        data: [documentRow],
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getDocuments()

      expect(createClient).toHaveBeenCalled()
      expect(result.error).toBeNull()
      expect(result.data).toEqual([mappedDocument])
    })

    it('returns error when Supabase query fails', async () => {
      const supabase = createSupabaseMock()
      supabase.selectOrder.mockResolvedValue({
        data: null,
        error: { message: 'Database failure' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getDocuments()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Database failure')
    })

    it('handles unexpected failures from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('network down'))

      const result = await getDocuments()

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch documents')
    })
  })

  describe('getDocument', () => {
    it('returns mapped document on success', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: documentRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getDocument(documentRow.id)

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mappedDocument)
      expect(supabase.from).toHaveBeenCalledWith('documents')
    })

    it('returns error when Supabase cannot find record', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: null,
        error: { message: 'Document not found' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await getDocument('missing-id')

      expect(result.data).toBeNull()
      expect(result.error).toBe('Document not found')
    })

    it('handles unexpected errors from Supabase client creation', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('boom'))

      const result = await getDocument(documentRow.id)

      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to fetch document')
    })
  })

  describe('createDocument', () => {
    it('creates document and revalidates path on success', async () => {
      const supabase = createSupabaseMock()
      supabase.insertSingle.mockResolvedValue({
        data: documentRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const formData = buildFormData()
      const result = await createDocument(formData)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual(baseDocument)
      expect(revalidatePath).toHaveBeenCalledWith('/documents')
    })

    it('returns validation errors when payload is invalid', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const formData = new FormData()
      formData.append('title', 'Missing file URL')

      const result = await createDocument(formData)
      const parsed = documentMetadataSchema.safeParse(Object.fromEntries(formData))

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe(parsed.success ? null : parsed.error.errors.map((err) => err.message).join('\n'))
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns Supabase error message when insert fails', async () => {
      const supabase = createSupabaseMock()
      supabase.insertSingle.mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await createDocument(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insert failed')
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('timeout'))

      const result = await createDocument(buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create document')
      expect(result.data).toBeNull()
    })
  })

  describe('updateDocument', () => {
    it('updates document and revalidates path on success', async () => {
      const supabase = createSupabaseMock()
      supabase.updateSingle.mockResolvedValue({
        data: documentRow,
        error: null,
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateDocument(documentRow.id, buildFormData({ title: 'Updated Lease' }))

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual(baseDocument)
      expect(revalidatePath).toHaveBeenCalledWith('/documents')
    })

    it('returns validation errors when payload invalid', async () => {
      const supabase = createSupabaseMock()
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)
      const invalidFormData = new FormData()
      invalidFormData.append('title', '')

      const result = await updateDocument(documentRow.id, invalidFormData)
      const parsed = documentMetadataSchema.safeParse(Object.fromEntries(invalidFormData))

      expect(result.success).toBe(false)
      expect(result.error).toBe(parsed.success ? null : parsed.error.errors.map((err) => err.message).join('\n'))
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns Supabase error message when update fails', async () => {
      const supabase = createSupabaseMock()
      supabase.updateSingle.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await updateDocument(documentRow.id, buildFormData({ title: 'Lease' }))

      expect(result.success).toBe(false)
      expect(result.error).toBe('Update failed')
      expect(result.data).toBeNull()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('unavailable'))

      const result = await updateDocument(documentRow.id, buildFormData())

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to update document')
      expect(result.data).toBeNull()
    })
  })

  describe('deleteDocument', () => {
    it('removes record and associated storage object', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: { storage_path: documentRow.storage_path },
        error: null,
      })
      supabase.deleteEq.mockResolvedValue({ error: null })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const admin = createAdminMock()
      ;(createAdminClient as jest.Mock).mockReturnValue(admin.admin)

      const result = await deleteDocument(documentRow.id)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(admin.storageFrom).toHaveBeenCalledWith(expect.any(String))
      expect(admin.remove).toHaveBeenCalledWith([documentRow.storage_path])
      expect(revalidatePath).toHaveBeenCalledWith('/documents')
    })

    it('returns error when initial fetch fails', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: null,
        error: { message: 'Fetch failed' },
      })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteDocument(documentRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Fetch failed')
      expect(createAdminClient).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('returns error when delete mutation fails', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: { storage_path: documentRow.storage_path },
        error: null,
      })
      supabase.deleteEq.mockResolvedValue({ error: { message: 'Delete failed' } })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const result = await deleteDocument(documentRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Delete failed')
      expect(createAdminClient).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
    })

    it('ignores storage removal failure and still succeeds', async () => {
      const supabase = createSupabaseMock()
      supabase.selectSingle.mockResolvedValue({
        data: { storage_path: documentRow.storage_path },
        error: null,
      })
      supabase.deleteEq.mockResolvedValue({ error: null })
      ;(createClient as jest.Mock).mockResolvedValue(supabase.client)

      const admin = createAdminMock()
      admin.remove.mockResolvedValueOnce({ error: { message: 'Storage not found' } })
      ;(createAdminClient as jest.Mock).mockReturnValue(admin.admin)

      const result = await deleteDocument(documentRow.id)

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(admin.remove).toHaveBeenCalledWith([documentRow.storage_path])
      expect(revalidatePath).toHaveBeenCalledWith('/documents')
    })

    it('handles unexpected errors from createClient', async () => {
      ;(createClient as jest.Mock).mockRejectedValue(new Error('offline'))

      const result = await deleteDocument(documentRow.id)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to delete document')
      expect(createAdminClient).not.toHaveBeenCalled()
    })
  })
})
