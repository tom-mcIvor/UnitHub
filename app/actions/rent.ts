'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { rentPaymentSchema } from '@/lib/schemas'
import type { RentPayment } from '@/lib/types'
import { z } from 'zod'

// Extended type with tenant info for display
export interface RentPaymentWithTenant extends RentPayment {
  tenantName: string
  unitNumber: string
}

// Convert database snake_case to TypeScript camelCase
function mapDbToRentPayment(row: any): RentPayment {
  // Calculate actual status based on due date
  let actualStatus = row.status

  // If status is 'pending' and due date has passed, mark as 'overdue'
  if (row.status === 'pending' && row.due_date) {
    const dueDate = new Date(row.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time for date-only comparison

    if (dueDate < today) {
      actualStatus = 'overdue'
    }
  }

  return {
    id: row.id,
    tenantId: row.tenant_id,
    amount: parseFloat(row.amount),
    dueDate: row.due_date,
    paidDate: row.paid_date || undefined,
    status: actualStatus,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Convert with tenant info
function mapDbToRentPaymentWithTenant(row: any): RentPaymentWithTenant {
  return {
    ...mapDbToRentPayment(row),
    tenantName: row.tenants?.name || 'Unknown',
    unitNumber: row.tenants?.unit_number || 'N/A',
  }
}

// Get all rent payments with tenant info
export async function getRentPayments(): Promise<{
  data: RentPaymentWithTenant[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('rent_payments')
      .select(
        `
        *,
        tenants (
          name,
          unit_number
        )
      `
      )
      .eq('user_id', user.id)
      .order('due_date', { ascending: false })

    if (error) {
      console.error('Error fetching rent payments:', error)
      return { data: null, error: error.message }
    }

    const payments = data?.map(mapDbToRentPaymentWithTenant) || []
    return { data: payments, error: null }
  } catch (error) {
    console.error('Unexpected error fetching rent payments:', error)
    return { data: null, error: 'Failed to fetch rent payments' }
  }
}

// Get a single rent payment by ID
export async function getRentPayment(id: string): Promise<{
  data: RentPaymentWithTenant | null
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('rent_payments')
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
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching rent payment:', error)
      return { data: null, error: error.message }
    }

    return { data: mapDbToRentPaymentWithTenant(data), error: null }
  } catch (error) {
    console.error('Unexpected error fetching rent payment:', error)
    return { data: null, error: 'Failed to fetch rent payment' }
  }
}

// Create a new rent payment
export async function createRentPayment(formData: FormData): Promise<{
  success: boolean
  error: string | null
  data: RentPayment | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated', data: null }

    const rawData = Object.fromEntries(formData.entries())
    const parsed = rentPaymentSchema.safeParse({
      ...rawData,
      amount: rawData.amount ? parseFloat(rawData.amount as string) : undefined,
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, amount, dueDate, paidDate, status, notes } = parsed.data

    // Insert into database
    const { data, error } = await supabase
      .from('rent_payments')
      .insert({
        user_id: user.id,
        tenant_id: tenantId,
        amount: amount,
        due_date: dueDate,
        paid_date: paidDate || null,
        status: status,
        notes: notes || '',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating rent payment:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the rent page to show new data
    revalidatePath('/rent')

    return {
      success: true,
      error: null,
      data: mapDbToRentPayment(data),
    }
  } catch (error) {
    console.error('Unexpected error creating rent payment:', error)
    return {
      success: false,
      error: 'Failed to create rent payment',
      data: null,
    }
  }
}

// Update an existing rent payment
export async function updateRentPayment(
  id: string,
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  data: RentPayment | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated', data: null }

    const rawData = Object.fromEntries(formData.entries())
    const parsed = rentPaymentSchema.safeParse({
      ...rawData,
      amount: rawData.amount ? parseFloat(rawData.amount as string) : undefined,
    })

    if (!parsed.success) {
      const errorString = parsed.error.errors.map((e) => e.message).join('\n')
      return {
        success: false,
        error: errorString,
        data: null,
      }
    }

    const { tenantId, amount, dueDate, paidDate, status, notes } = parsed.data

    // Update in database
    const { data, error } = await supabase
      .from('rent_payments')
      .update({
        tenant_id: tenantId,
        amount: amount,
        due_date: dueDate,
        paid_date: paidDate || null,
        status: status,
        notes: notes || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating rent payment:', error)
      return {
        success: false,
        error: error.message,
        data: null,
      }
    }

    // Revalidate the rent page
    revalidatePath('/rent')

    return {
      success: true,
      error: null,
      data: mapDbToRentPayment(data),
    }
  } catch (error) {
    console.error('Unexpected error updating rent payment:', error)
    return {
      success: false,
      error: 'Failed to update rent payment',
      data: null,
    }
  }
}

// Delete a rent payment
export async function deleteRentPayment(id: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'User not authenticated' }

    const { error } = await supabase
      .from('rent_payments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting rent payment:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the rent page
    revalidatePath('/rent')

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('Unexpected error deleting rent payment:', error)
    return {
      success: false,
      error: 'Failed to delete rent payment',
    }
  }
}
