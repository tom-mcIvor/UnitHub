'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { documentMetadataSchema } from '@/lib/schemas'
import type { Document } from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'UnitHubDocuments'

// Extended type with tenant info for display
export interface DocumentWithTenant extends Document {
  tenantName?: string
  unitNumber?: string
}

// Convert database snake_case to TypeScript camelCase
function mapDbToDocument(row: any): Document {
  return {
    id: row.id,
    tenantId: row.tenant_id || undefined,
    title: row.title,
    type: row.type,
    fileUrl: row.file_url,
    storagePath: row.storage_path || undefined,
    uploadedAt: row.uploaded_at,
    extractedData: row.extracted_data || undefined,
  }
}

// Convert with tenant info
function mapDbToDocumentWithTenant(row: any): DocumentWithTenant {
  return {
    ...mapDbToDocument(row),
    tenantName: row.tenants?.name,
    unitNumber: row.tenants?.unit_number,
  }
}

// Get all documents with optional tenant info
export async function getDocuments(): Promise<{
  data: DocumentWithTenant[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('documents')
      .select(
        `
        *,
        tenants (
          name,
          unit_number
        )
      `)
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return { data: null, error: error.message }
    }

    const documents = data?.map(mapDbToDocumentWithTenant) || []
    return { data: documents, error: null }
  } catch (error) {
    console.error('Unexpected error fetching documents:', error)
    return { data: null, error: 'Failed to fetch documents' }
  }
}

// Get a single document by ID
export async function getDocument(id: string): Promise<{
  data: DocumentWithTenant | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('documents')
      .select(
        `
        *,
        tenants (
          name,
          unit_number
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching document:', error)
      return { data: null, error: error.message }
    }

    return { data: mapDbToDocumentWithTenant(data), error: null }
  } catch (error) {
    console.error('Unexpected error fetching document:', error)
    return { data: null, error: 'Failed to fetch document' }
  }
}

// Create a new document
export async function createDocument(formData: FormData): Promise<{
  success: boolean
  error: string | null
  data: Document | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated', data: null }

    const rawData = Object.fromEntries(formData.entries())
    const parsed = documentMetadataSchema.safeParse(rawData)

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, title, type, fileUrl } = parsed.data
    const storagePath = formData.get('storagePath') as string

    // Insert into database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        tenant_id: tenantId || null,
        title,
        type,
        file_url: fileUrl,
        storage_path: storagePath,
        extracted_data: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating document:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the documents page to show new data
    revalidatePath('/documents')

    return {
      success: true,
      error: null,
      data: mapDbToDocument(data),
    }
  } catch (error) {
    console.error('Unexpected error creating document:', error)
    return {
      success: false,
      error: 'Failed to create document',
      data: null,
    }
  }
}

// Update an existing document
export async function updateDocument(
  id: string,
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  data: Document | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated', data: null }

    const rawData = Object.fromEntries(formData.entries())
    const parsed = documentMetadataSchema.safeParse(rawData)

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, title, type, fileUrl } = parsed.data
    const storagePath = formData.get('storagePath') as string | null

    // Update in database
    const updatePayload: Record<string, unknown> = {
      tenant_id: tenantId || null,
      title,
      type,
      file_url: fileUrl,
    }

    if (storagePath) {
      updatePayload.storage_path = storagePath
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the documents page
    revalidatePath('/documents')

    return {
      success: true,
      error: null,
      data: mapDbToDocument(data),
    }
  } catch (error) {
    console.error('Unexpected error updating document:', error)
    return {
      success: false,
      error: 'Failed to update document',
      data: null,
    }
  }
}

// Delete a document
export async function deleteDocument(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated' }

    const { data: existing, error: fetchError } = await supabase
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching document before deletion:', fetchError)
      return {
        success: false,
        error: fetchError.message,
      }
    }

    const storagePath: string | undefined = existing?.storage_path || undefined

    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting document:', deleteError)
      return {
        success: false,
        error: deleteError.message,
      }
    }

    if (storagePath) {
      try {
        const adminClient = createAdminClient()
        const { error: storageError } = await adminClient.storage
          .from(STORAGE_BUCKET)
          .remove([storagePath])

        if (storageError) {
          console.error('Error deleting document from storage:', storageError)
        }
      } catch (storageCleanupError) {
        console.error('Unexpected error removing storage object:', storageCleanupError)
      }
    }

    // Revalidate the documents page
    revalidatePath('/documents')

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error deleting document:', error)
    return {
      success: false,
      error: 'Failed to delete document',
    }
  }
}
