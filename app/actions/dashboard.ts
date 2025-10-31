'use server'

import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
  totalTenants: number
  monthlyIncome: string
  pendingPayments: number
  openMaintenance: number
}

export interface RecentTenant {
  id: string
  name: string
  unit_number: string
  lease_start: string
  created_at: string
}

export interface UpcomingPayment {
  id: string
  tenant_id: string
  tenant_name: string
  unit_number: string
  amount: string
  due_date: string
  status: string
}

export interface RecentMaintenanceRequest {
  id: string
  tenant_id: string
  unit_number: string
  title: string
  priority: string
  status: string
  created_at: string
}

/**
 * Fetches dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  success: boolean
  data: DashboardStats | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    // Get total tenants count
    const { count: totalTenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*', { count: 'exact', head: true })

    if (tenantsError) throw tenantsError

    // Get monthly income (sum of all tenant rent amounts)
    const { data: tenantsData, error: rentError } = await supabase
      .from('tenants')
      .select('rent_amount')

    if (rentError) throw rentError

    const monthlyIncome = tenantsData
      ?.reduce((sum, tenant) => sum + parseFloat(tenant.rent_amount || '0'), 0)
      .toFixed(2) || '0.00'

    // Get pending payments count (status = 'pending' or 'overdue')
    const { count: pendingPayments, error: paymentsError } = await supabase
      .from('rent_payments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'overdue'])

    if (paymentsError) throw paymentsError

    // Get open maintenance requests count (status = 'open' or 'in-progress')
    const { count: openMaintenance, error: maintenanceError } = await supabase
      .from('maintenance_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in-progress'])

    if (maintenanceError) throw maintenanceError

    return {
      success: true,
      data: {
        totalTenants: totalTenants || 0,
        monthlyIncome,
        pendingPayments: pendingPayments || 0,
        openMaintenance: openMaintenance || 0,
      },
      error: null,
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch dashboard statistics',
    }
  }
}

/**
 * Fetches recent tenants (last 4)
 */
export async function getRecentTenants(): Promise<{
  success: boolean
  data: RecentTenant[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, unit_number, lease_start, created_at')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) throw error

    return {
      success: true,
      data: data || [],
      error: null,
    }
  } catch (err) {
    console.error('Error fetching recent tenants:', err)
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch recent tenants',
    }
  }
}

/**
 * Fetches upcoming payments (pending/overdue, next 7 days)
 */
export async function getUpcomingPayments(): Promise<{
  success: boolean
  data: UpcomingPayment[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    // Get payments that are pending or overdue, and due within next 30 days
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const { data, error } = await supabase
      .from('rent_payments')
      .select(`
        id,
        tenant_id,
        amount,
        due_date,
        status,
        tenants (
          name,
          unit_number
        )
      `)
      .in('status', ['pending', 'overdue'])
      .lte('due_date', thirtyDaysFromNow.toISOString().split('T')[0])
      .order('due_date', { ascending: true })
      .limit(5)

    if (error) throw error

    // Transform the data to flatten the tenants object
    const payments: UpcomingPayment[] = data?.map((payment: any) => ({
      id: payment.id,
      tenant_id: payment.tenant_id,
      tenant_name: payment.tenants?.name || 'Unknown',
      unit_number: payment.tenants?.unit_number || 'N/A',
      amount: payment.amount,
      due_date: payment.due_date,
      status: payment.status,
    })) || []

    return {
      success: true,
      data: payments,
      error: null,
    }
  } catch (err) {
    console.error('Error fetching upcoming payments:', err)
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch upcoming payments',
    }
  }
}

/**
 * Fetches recent maintenance requests (last 5)
 */
export async function getRecentMaintenanceRequests(): Promise<{
  success: boolean
  data: RecentMaintenanceRequest[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        id,
        tenant_id,
        title,
        priority,
        status,
        created_at,
        tenants (
          unit_number
        )
      `)
      .in('status', ['open', 'in-progress'])
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    // Transform the data
    const requests: RecentMaintenanceRequest[] = data?.map((request: any) => ({
      id: request.id,
      tenant_id: request.tenant_id,
      unit_number: request.tenants?.unit_number || 'N/A',
      title: request.title,
      priority: request.priority,
      status: request.status,
      created_at: request.created_at,
    })) || []

    return {
      success: true,
      data: requests,
      error: null,
    }
  } catch (err) {
    console.error('Error fetching recent maintenance requests:', err)
    return {
      success: false,
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch recent maintenance requests',
    }
  }
}
