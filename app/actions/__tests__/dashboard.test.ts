import {
  getDashboardStats,
  getRecentTenants,
  getUpcomingPayments,
  getRecentMaintenanceRequests,
} from '@/app/actions/dashboard'

type SupabaseOverrides = {
  tenantsCount?: number
  tenantsCountError?: Error
  rentAmountRows?: Array<{ rent_amount: string }>
  recentTenants?: Array<{
    id: string
    name: string
    unit_number: string
    lease_start: string
    created_at: string
  }>
  rentPaymentsCountError?: Error
  rentPayments?: Array<{
    id: string
    tenant_id: string
    amount: string
    due_date: string
    status: string
    tenants?: { name?: string; unit_number?: string }
  }>
  maintenanceCountError?: Error
  maintenanceRequests?: Array<{
    id: string
    tenant_id: string
    unit_number: string
    title: string
    priority: string
    status: string
    created_at: string
    tenants?: { unit_number?: string }
  }>
}

let mockSupabase: any

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}))

const baseRentAmounts = [
  { rent_amount: '1200.00' },
  { rent_amount: '1350.50' },
]

const baseRecentTenants = [
  {
    id: 'tenant-1',
    name: 'Ava Martin',
    unit_number: '101',
    lease_start: '2025-01-01',
    created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'tenant-2',
    name: 'Noah Green',
    unit_number: '202',
    lease_start: '2025-02-15',
    created_at: '2025-02-20T10:00:00Z',
  },
]

const baseRentPayments = [
  {
    id: 'payment-1',
    tenant_id: 'tenant-1',
    amount: '1200.00',
    due_date: '2025-11-15',
    status: 'pending',
    tenants: {
      name: 'Ava Martin',
      unit_number: '101',
    },
  },
  {
    id: 'payment-2',
    tenant_id: 'tenant-2',
    amount: '1350.50',
    due_date: '2025-11-20',
    status: 'overdue',
    tenants: {
      name: 'Noah Green',
      unit_number: '202',
    },
  },
]

const baseMaintenanceRequests = [
  {
    id: 'request-1',
    tenant_id: 'tenant-1',
    unit_number: '101',
    title: 'Fix leaking sink',
    priority: 'high',
    status: 'in-progress',
    created_at: '2025-10-30T08:00:00Z',
    tenants: {
      unit_number: '101',
    },
  },
  {
    id: 'request-2',
    tenant_id: 'tenant-3',
    unit_number: '302',
    title: 'Replace AC filter',
    priority: 'medium',
    status: 'open',
    created_at: '2025-10-29T08:00:00Z',
    tenants: {
      unit_number: '302',
    },
  },
]

function buildSupabaseMock(overrides: SupabaseOverrides = {}) {
  const {
    tenantsCount = overrides.rentAmountRows?.length ?? baseRentAmounts.length,
    tenantsCountError,
    rentAmountRows = baseRentAmounts,
    recentTenants = baseRecentTenants,
    rentPayments = baseRentPayments,
    rentPaymentsCountError,
    maintenanceRequests = baseMaintenanceRequests,
    maintenanceCountError,
  } = overrides

  const tenantsSelect = jest.fn((columns?: string, options?: { head?: boolean }) => {
    if (options?.head) {
      const eqChain = {
        count: tenantsCountError ? null : tenantsCount,
        error: tenantsCountError || null,
      }
      return { eq: jest.fn(() => eqChain) }
    }

    if (columns === 'rent_amount') {
      return { eq: jest.fn(() => ({ data: rentAmountRows, error: null })) }
    }

    if (columns?.includes('id') && columns?.includes('name')) {
      const chain: any = {}
      chain.eq = jest.fn(() => chain)
      chain.order = jest.fn(() => chain)
      chain.limit = jest.fn(() => ({ data: recentTenants, error: null }))
      return chain
    }

    return { data: [], error: null }
  })

  const rentPaymentsSelect = jest.fn((_, options?: { head?: boolean }) => {
    if (options?.head) {
      if (rentPaymentsCountError) {
        return {
          eq: jest.fn(() => ({
            in: jest.fn(() => ({ count: null, error: rentPaymentsCountError })),
          })),
        }
      }
      return {
        eq: jest.fn(() => ({
          in: jest.fn(() => ({ count: rentPayments.length, error: null })),
        })),
      }
    }

    const chain: any = {}
    chain.eq = jest.fn(() => chain)
    chain.in = jest.fn(() => chain)
    chain.lte = jest.fn(() => chain)
    chain.order = jest.fn(() => chain)
    chain.limit = jest.fn(() => ({ data: rentPayments, error: null }))
    return chain
  })

  const maintenanceSelect = jest.fn((_, options?: { head?: boolean }) => {
    if (options?.head) {
      if (maintenanceCountError) {
        return {
          eq: jest.fn(() => ({
            in: jest.fn(() => ({ count: null, error: maintenanceCountError })),
          })),
        }
      }
      return {
        eq: jest.fn(() => ({
          in: jest.fn(() => ({ count: maintenanceRequests.length, error: null })),
        })),
      }
    }

    const chain: any = {}
    chain.eq = jest.fn(() => chain)
    chain.in = jest.fn(() => chain)
    chain.order = jest.fn(() => chain)
    chain.limit = jest.fn(() => ({ data: maintenanceRequests, error: null }))
    return chain
  })

  const tenantsTable = {
    select: tenantsSelect,
  }

  const rentPaymentsTable = {
    select: rentPaymentsSelect,
  }

  const maintenanceTable = {
    select: maintenanceSelect,
  }

  const mockUser = {
    id: 'test-user-id-123',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }

  return {
    from: jest.fn((table: string) => {
      if (table === 'tenants') return tenantsTable
      if (table === 'rent_payments') return rentPaymentsTable
      if (table === 'maintenance_requests') return maintenanceTable
      return {}
    }),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
    },
  }
}

describe('Dashboard server actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase = buildSupabaseMock()
  })

  describe('getDashboardStats', () => {
    it('returns aggregate dashboard statistics', async () => {
      const result = await getDashboardStats()

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toEqual({
        totalTenants: 2,
        monthlyIncome: '2550.50',
        pendingPayments: 2,
        openMaintenance: 2,
      })
    })

    it('handles Supabase errors gracefully', async () => {
      const failure = new Error('Failed to count tenants')
      mockSupabase = buildSupabaseMock({ tenantsCountError: failure })

      const result = await getDashboardStats()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Failed to count tenants')
    })
  })

  describe('getRecentTenants', () => {
    it('returns most recently created tenants', async () => {
      const result = await getRecentTenants()

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]).toEqual(
        expect.objectContaining({
          id: 'tenant-1',
          name: 'Ava Martin',
          unit_number: '101',
        })
      )
    })

    it('returns error details when Supabase fails', async () => {
      const failure = new Error('Recent tenants query failed')
      const baseSupabase = buildSupabaseMock()
      const errorSupabase = {
        ...baseSupabase,
        from: jest.fn((table: string) => {
          if (table === 'tenants') {
            return {
              select: jest.fn(() => ({
                eq: jest.fn(() => ({
                  order: jest.fn(() => ({
                    limit: jest.fn(() => ({ data: null, error: failure })),
                  })),
                })),
              })),
            }
          }
          return baseSupabase.from(table)
        }),
        auth: baseSupabase.auth,
      }

      mockSupabase = errorSupabase

      const result = await getRecentTenants()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Recent tenants query failed')
    })
  })

  describe('getUpcomingPayments', () => {
    it('returns paginated upcoming rent payments with tenant info', async () => {
      const result = await getUpcomingPayments()

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]).toEqual(
        expect.objectContaining({
          tenant_name: 'Ava Martin',
          unit_number: '101',
          amount: '1200.00',
          status: 'pending',
        })
      )
    })

    it('returns error metadata when payment query fails', async () => {
      const failure = new Error('Upcoming payments failed')
      const baseSupabase = buildSupabaseMock()
      const errorSupabase = {
        ...baseSupabase,
        from: jest.fn((table: string) => {
          if (table === 'rent_payments') {
            const chain: any = {}
            chain.eq = jest.fn(() => chain)
            chain.in = jest.fn(() => chain)
            chain.lte = jest.fn(() => chain)
            chain.order = jest.fn(() => chain)
            chain.limit = jest.fn(() => ({ data: null, error: failure }))
            return {
              select: jest.fn(() => chain),
            }
          }
          return baseSupabase.from(table)
        }),
        auth: baseSupabase.auth,
      }
      mockSupabase = errorSupabase

      const result = await getUpcomingPayments()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Upcoming payments failed')
    })
  })

  describe('getRecentMaintenanceRequests', () => {
    it('returns open maintenance requests with tenant units', async () => {
      const result = await getRecentMaintenanceRequests()

      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]).toEqual(
        expect.objectContaining({
          unit_number: '101',
          title: 'Fix leaking sink',
          priority: 'high',
        })
      )
    })

    it('surfaces Supabase errors encountered during fetch', async () => {
      const failure = new Error('Maintenance feed failed')
      const baseSupabase = buildSupabaseMock()
      const errorSupabase = {
        ...baseSupabase,
        from: jest.fn((table: string) => {
          if (table === 'maintenance_requests') {
            const chain: any = {}
            chain.eq = jest.fn(() => chain)
            chain.in = jest.fn(() => chain)
            chain.order = jest.fn(() => chain)
            chain.limit = jest.fn(() => ({ data: null, error: failure }))
            return {
              select: jest.fn(() => chain),
            }
          }
          return baseSupabase.from(table)
        }),
        auth: baseSupabase.auth,
      }

      mockSupabase = errorSupabase

      const result = await getRecentMaintenanceRequests()

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBe('Maintenance feed failed')
    })
  })
})
