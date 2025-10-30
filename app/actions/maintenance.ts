'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { MaintenanceRequest } from '@/lib/types'

// Extended type with tenant info for display
export interface MaintenanceRequestWithTenant extends MaintenanceRequest {
  tenantName: string
  unitNumber: string
}

// Convert database snake_case to TypeScript camelCase
function mapDbToMaintenanceRequest(row: any): MaintenanceRequest {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    estimatedCost: row.estimated_cost ? parseFloat(row.estimated_cost) : undefined,
    actualCost: row.actual_cost ? parseFloat(row.actual_cost) : undefined,
    assignedVendor: row.assigned_vendor || undefined,
    photos: row.photos || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Convert with tenant info
function mapDbToMaintenanceRequestWithTenant(row: any): MaintenanceRequestWithTenant {
  return {
    ...mapDbToMaintenanceRequest(row),
    tenantName: row.tenants?.name || 'Unknown',
    unitNumber: row.tenants?.unit_number || 'N/A',
  }
}

// Get all maintenance requests with tenant info
export async function getMaintenanceRequests(): Promise<{
  data: MaintenanceRequestWithTenant[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        tenants (
          name,
          unit_number
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching maintenance requests:', error)
      return { data: null, error: error.message }
    }

    const requests = data?.map(mapDbToMaintenanceRequestWithTenant) || []
    return { data: requests, error: null }
  } catch (error) {
    console.error('Unexpected error fetching maintenance requests:', error)
    return { data: null, error: 'Failed to fetch maintenance requests' }
  }
}

// Get a single maintenance request by ID
export async function getMaintenanceRequest(id: string): Promise<{
  data: MaintenanceRequestWithTenant | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        tenants (
          name,
          unit_number
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching maintenance request:', error)
      return { data: null, error: error.message }
    }

    return { data: mapDbToMaintenanceRequestWithTenant(data), error: null }
  } catch (error) {
    console.error('Unexpected error fetching maintenance request:', error)
    return { data: null, error: 'Failed to fetch maintenance request' }
  }
}

// Create a new maintenance request
export async function createMaintenanceRequest(formData: FormData): Promise<{
  success: boolean
  error: string | null
  data: MaintenanceRequest | null
}> {
  try {
    const supabase = await createClient()

    // Extract and validate required fields
    const tenantId = formData.get('tenantId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const status = formData.get('status') as string
    const estimatedCost = formData.get('estimatedCost') as string
    const actualCost = formData.get('actualCost') as string
    const assignedVendor = formData.get('assignedVendor') as string

    if (!tenantId || !title || !description || !category || !priority) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null,
      }
    }

    // Insert into database
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({
        tenant_id: tenantId,
        title,
        description,
        category,
        priority,
        status: status || 'open',
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        actual_cost: actualCost ? parseFloat(actualCost) : null,
        assigned_vendor: assignedVendor || null,
        photos: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating maintenance request:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the maintenance page to show new data
    revalidatePath('/maintenance')

    return {
      success: true,
      error: null,
      data: mapDbToMaintenanceRequest(data),
    }
  } catch (error) {
    console.error('Unexpected error creating maintenance request:', error)
    return {
      success: false,
      error: 'Failed to create maintenance request',
      data: null,
    }
  }
}

// Update an existing maintenance request
export async function updateMaintenanceRequest(
  id: string,
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  data: MaintenanceRequest | null
}> {
  try {
    const supabase = await createClient()

    // Extract fields
    const tenantId = formData.get('tenantId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const status = formData.get('status') as string
    const estimatedCost = formData.get('estimatedCost') as string
    const actualCost = formData.get('actualCost') as string
    const assignedVendor = formData.get('assignedVendor') as string

    if (!tenantId || !title || !description || !category || !priority) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null,
      }
    }

    // Update in database
    const { data, error } = await supabase
      .from('maintenance_requests')
      .update({
        tenant_id: tenantId,
        title,
        description,
        category,
        priority,
        status: status || 'open',
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        actual_cost: actualCost ? parseFloat(actualCost) : null,
        assigned_vendor: assignedVendor || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating maintenance request:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the maintenance page
    revalidatePath('/maintenance')

    return {
      success: true,
      error: null,
      data: mapDbToMaintenanceRequest(data),
    }
  } catch (error) {
    console.error('Unexpected error updating maintenance request:', error)
    return {
      success: false,
      error: 'Failed to update maintenance request',
      data: null,
    }
  }
}

// Delete a maintenance request
export async function deleteMaintenanceRequest(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('maintenance_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting maintenance request:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the maintenance page
    revalidatePath('/maintenance')

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error deleting maintenance request:', error)
    return {
      success: false,
      error: 'Failed to delete maintenance request',
      data: null,
    }
  }
}
