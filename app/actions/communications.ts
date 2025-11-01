'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { communicationLogSchema } from '@/lib/schemas'
import type { CommunicationLog } from '@/lib/types'

// Extended type with tenant info for display
export interface CommunicationLogWithTenant extends CommunicationLog {
  tenantName: string
  unitNumber: string
}

// Convert database snake_case to TypeScript camelCase
function mapDbToCommunicationLog(row: any): CommunicationLog {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    type: row.type,
    subject: row.subject,
    content: row.content,
    createdAt: row.created_at,
  }
}

// Convert with tenant info
function mapDbToCommunicationLogWithTenant(row: any): CommunicationLogWithTenant {
  return {
    ...mapDbToCommunicationLog(row),
    tenantName: row.tenants?.name || 'Unknown',
    unitNumber: row.tenants?.unit_number || 'N/A',
  }
}

// Get all communication logs with tenant info
export async function getCommunicationLogs(): Promise<{
  data: CommunicationLogWithTenant[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('communication_logs')
      .select(
        `
        *,
        tenants (
          name,
          unit_number
        )
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching communication logs:', error)
      return { data: null, error: error.message }
    }

    const logs = data?.map(mapDbToCommunicationLogWithTenant) || []
    return { data: logs, error: null }
  } catch (error) {
    console.error('Unexpected error fetching communication logs:', error)
    return { data: null, error: 'Failed to fetch communication logs' }
  }
}

// Get a single communication log by ID
export async function getCommunicationLog(id: string): Promise<{
  data: CommunicationLogWithTenant | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('communication_logs')
      .select(
        `
        *,
        tenants (
          name,
          unit_number
        )
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching communication log:', error)
      return { data: null, error: error.message }
    }

    return { data: mapDbToCommunicationLogWithTenant(data), error: null }
  } catch (error) {
    console.error('Unexpected error fetching communication log:', error)
    return { data: null, error: 'Failed to fetch communication log' }
  }
}

// Create a new communication log
export async function createCommunicationLog(formData: FormData): Promise<{
  success: boolean
  error: string | null
  data: CommunicationLog | null
}> {
  try {
    const supabase = await createClient()

    const rawData = Object.fromEntries(formData.entries())
    const parsed = communicationLogSchema.safeParse(rawData)

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, type, subject, content } = parsed.data

    // Insert into database
    const { data, error } = await supabase
      .from('communication_logs')
      .insert({
        tenant_id: tenantId,
        type,
        subject,
        content,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating communication log:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the communications page to show new data
    revalidatePath('/communications')

    return {
      success: true,
      error: null,
      data: mapDbToCommunicationLog(data),
    }
  } catch (error) {
    console.error('Unexpected error creating communication log:', error)
    return {
      success: false,
      error: 'Failed to create communication log',
      data: null,
    }
  }
}

// Update an existing communication log
export async function updateCommunicationLog(
  id: string,
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  data: CommunicationLog | null
}> {
  try {
    const supabase = await createClient()

    const rawData = Object.fromEntries(formData.entries())
    const parsed = communicationLogSchema.safeParse(rawData)

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, type, subject, content } = parsed.data

    // Update in database
    const { data, error } = await supabase
      .from('communication_logs')
      .update({
        tenant_id: tenantId,
        type,
        subject,
        content,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating communication log:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the communications page
    revalidatePath('/communications')

    return {
      success: true,
      error: null,
      data: mapDbToCommunicationLog(data),
    }
  } catch (error) {
    console.error('Unexpected error updating communication log:', error)
    return {
      success: false,
      error: 'Failed to update communication log',
      data: null,
    }
  }
}

// Delete a communication log
export async function deleteCommunicationLog(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('communication_logs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting communication log:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the communications page
    revalidatePath('/communications')

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error deleting communication log:', error)
    return {
      success: false,
      error: 'Failed to delete communication log',
    }
  }
}
