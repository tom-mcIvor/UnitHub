import React from 'react'
import { render, screen } from '@testing-library/react'
import { MaintenanceOverview } from '@/components/dashboard/maintenance-overview'
import type { RecentMaintenanceRequest } from '@/app/actions/dashboard'

const requests: RecentMaintenanceRequest[] = [
  {
    id: 'req-1',
    tenant_id: 'tenant-1',
    unit_number: '401',
    title: 'Water Leak',
    priority: 'urgent',
    status: 'open',
    created_at: '2025-10-31T00:00:00Z',
  },
]

describe('MaintenanceOverview', () => {
  it('should render maintenance request details', () => {
    render(<MaintenanceOverview requests={requests} />)

    expect(screen.getByText('Water Leak')).toBeInTheDocument()
    expect(screen.getByText('Unit 401')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText(/open/i)).toBeInTheDocument()
  })

  it('should render empty state when there are no maintenance requests', () => {
    render(<MaintenanceOverview requests={[]} />)

    expect(screen.getByText(/No open maintenance requests/i)).toBeInTheDocument()
  })
})
