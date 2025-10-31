'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { tenantSchema } from '@/lib/schemas'
import type { Tenant } from '@/lib/types'

// Convert database snake_case to TypeScript camelCase
function mapDbToTenant(row: any): Tenant {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    unitNumber: row.unit_number,
    leaseStartDate: row.lease_start_date,
    leaseEndDate: row.lease_end_date,
    rentAmount: parseFloat(row.rent_amount),
    depositAmount: parseFloat(row.deposit_amount),
    petPolicy: row.pet_policy || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Get all tenants
export async function getTenants(): Promise<{ data: Tenant[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tenants:', error)
      return { data: null, error: error.message }
    }

    const tenants = data?.map(mapDbToTenant) || []
    return { data: tenants, error: null }
  } catch (error) {
    console.error('Unexpected error fetching tenants:', error)
    return { data: null, error: 'Failed to fetch tenants' }
  }
}

// Get a single tenant by ID
export async function getTenant(id: string): Promise<{ data: Tenant | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching tenant:', error)
      return { data: null, error: error.message }
    }

    const tenant = data ? mapDbToTenant(data) : null
    return { data: tenant, error: null }
  } catch (error) {
    console.error('Unexpected error fetching tenant:', error)
    return { data: null, error: 'Failed to fetch tenant' }
  }
}

export async function createTenant(formData: FormData): Promise<{ success: boolean; error: string | null; data?: Tenant }> {
  try {
    const supabase = await createClient()

    const rawData = Object.fromEntries(formData.entries())
    const parsed = tenantSchema.safeParse({
      ...rawData,
      rentAmount: parseFloat(rawData.rentAmount as string),
      depositAmount: parseFloat(rawData.depositAmount as string),
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
      }
    }

    const { name, email, phone, unitNumber, leaseStartDate, leaseEndDate, rentAmount, depositAmount, petPolicy, notes } = parsed.data

    const { data, error } = await supabase
      .from('tenants')
      .insert([
        {
          name,
          email,
          phone,
          unit_number: unitNumber,
          lease_start_date: leaseStartDate,
          lease_end_date: leaseEndDate,
          rent_amount: rentAmount,
          deposit_amount: depositAmount,
          pet_policy: petPolicy || '',
          notes: notes || '',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating tenant:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the tenants page to show new data
    revalidatePath('/tenants')

    const tenant = mapDbToTenant(data)
    return { success: true, error: null, data: tenant }
  } catch (error) {
    console.error('Unexpected error creating tenant:', error)
    return { success: false, error: 'Failed to create tenant' }
  }
}
    const parsed = tenantSchema.safeParse({
      ...rawData,
      rentAmount: parseFloat(rawData.rentAmount as string),
      depositAmount: parseFloat(rawData.depositAmount as string),
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
      }
    }

    const { name, email, phone, unitNumber, leaseStartDate, leaseEndDate, rentAmount, depositAmount, petPolicy, notes } = parsed.data

    const { data, error } = await supabase
      .from('tenants')
      .insert([
        {
          name,
          email,
          phone,
          unit_number: unitNumber,
          lease_start_date: leaseStartDate,
          lease_end_date: leaseEndDate,
          rent_amount: rentAmount,
          deposit_amount: depositAmount,
          pet_policy: petPolicy || '',
          notes: notes || '',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating tenant:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the tenants page to show new data
    revalidatePath('/tenants')

    const tenant = mapDbToTenant(data)
    return { success: true, error: null, data: tenant }
  } catch (error) {
    console.error('Unexpected error creating tenant:', error)
    return { success: false, error: 'Failed to create tenant' }
  }
}
    const parsed = tenantSchema.safeParse({
      ...rawData,
      rentAmount: parseFloat(rawData.rentAmount as string),
      depositAmount: parseFloat(rawData.depositAmount as string),
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
      }
    }

    const { name, email, phone, unitNumber, leaseStartDate, leaseEndDate, rentAmount, depositAmount, petPolicy, notes } = parsed.data

    const { data, error } = await supabase
      .from('tenants')
      .insert([
        {
          name,
          email,
          phone,
          unit_number: unitNumber,
          lease_start_date: leaseStartDate,
          lease_end_date: leaseEndDate,
          rent_amount: rentAmount,
          deposit_amount: depositAmount,
          pet_policy: petPolicy || '',
          notes: notes || '',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating tenant:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the tenants page to show new data
    revalidatePath('/tenants')

    const tenant = mapDbToTenant(data)
    return { success: true, error: null, data: tenant }
  } catch (error) {
    console.error('Unexpected error creating tenant:', error)
    return { success: false, error: 'Failed to create tenant' }
  }
}

// Update an existing tenant
export async function updateTenant(id: string, formData: FormData): Promise<{ success: boolean; error: string | null; data?: Tenant }> {
  try {
    const supabase = await createClient()

    const rawData = Object.fromEntries(formData.entries())
    const parsed = tenantSchema.safeParse({
      ...rawData,
      rentAmount: parseFloat(rawData.rentAmount as string),
      depositAmount: parseFloat(rawData.depositAmount as string),
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
      }
    }

    const { name, email, phone, unitNumber, leaseStartDate, leaseEndDate, rentAmount, depositAmount, petPolicy, notes } = parsed.data

    const { data, error } = await supabase
      .from('tenants')
      .update({
        name,
        email,
        phone,
        unit_number: unitNumber,
        lease_start_date: leaseStartDate,
        lease_end_date: leaseEndDate,
        rent_amount: rentAmount,
        deposit_amount: depositAmount,
        pet_policy: petPolicy || '',
        notes: notes || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tenant:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the tenants page to show updated data
    revalidatePath('/tenants')
    revalidatePath(`/tenants/${id}`)

    const tenant = mapDbToTenant(data)
    return { success: true, error: null, data: tenant }
  } catch (error) {
    console.error('Unexpected error updating tenant:', error)
    return { success: false, error: 'Failed to update tenant' }
  }
}

// Delete a tenant
export async function deleteTenant(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tenant:', error)
      return { success: false, error: error.message }
    }

    // Revalidate the tenants page
    revalidatePath('/tenants')

    return { success: true, error: null }
  } catch (error) {
    console.error('Unexpected error deleting tenant:', error)
    return { success: false, error: 'Failed to delete tenant' }
  }
}
