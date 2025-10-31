import React from 'react'
import { render, screen } from '@testing-library/react'
import { RecentTenants } from '@/components/dashboard/recent-tenants'
import type { RecentTenant } from '@/app/actions/dashboard'

const tenants: RecentTenant[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    unit_number: '201',
    lease_start: '2025-01-01',
    created_at: '2025-02-01T00:00:00Z',
  },
]

describe('RecentTenants', () => {
  it('should render tenant list with active badge', () => {
    render(<RecentTenants tenants={tenants} />)

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Unit 201')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /View All/i })).toBeInTheDocument()
    expect(screen.getByText(/Active/i)).toBeInTheDocument()
  })

  it('should render empty state when no tenants provided', () => {
    render(<RecentTenants tenants={[]} />)

    expect(screen.getByText(/No tenants yet/i)).toBeInTheDocument()
  })
})
