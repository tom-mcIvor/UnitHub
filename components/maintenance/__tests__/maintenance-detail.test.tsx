import React from 'react'
import { render, screen } from '@testing-library/react'
import { MaintenanceDetail } from '@/components/maintenance/maintenance-detail'
import type { MaintenanceRequestWithTenant } from '@/app/actions/maintenance'

const baseRequest: MaintenanceRequestWithTenant = {
  id: 'req-1',
  tenantId: 'tenant-1',
  tenantName: 'Emily Carter',
  unitNumber: '305',
  title: 'Fix kitchen leak',
  description: 'Water leaking under the sink requiring urgent repair.',
  category: 'Plumbing',
  priority: 'high',
  status: 'in-progress',
  estimatedCost: 250,
  actualCost: 200,
  assignedVendor: 'Plumb Pros',
  photos: [],
  createdAt: '2025-10-01T10:00:00Z',
  updatedAt: '2025-10-02T10:00:00Z',
}

const tenants = [
  {
    id: 'tenant-1',
    name: 'Emily Carter',
    email: 'emily@example.com',
    phone: '555-1234',
    unitNumber: '305',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2025-12-31',
    rentAmount: 1800,
    depositAmount: 1800,
    petPolicy: '',
    notes: '',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]

describe('MaintenanceDetail', () => {
  it('should render maintenance details with formatted values', () => {
    render(<MaintenanceDetail request={baseRequest} tenants={tenants} />)

    expect(screen.getByText('Fix kitchen leak')).toBeInTheDocument()
    expect(screen.getByText(/Unit 305/)).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
    expect(screen.getByText('$200.00')).toBeInTheDocument()
    expect(screen.getByText('Emily Carter')).toBeInTheDocument()
    expect(screen.getByText('Plumb Pros')).toBeInTheDocument()
    expect(screen.getByText('Oct 1, 2025')).toBeInTheDocument()
    expect(screen.getByText('Oct 2, 2025')).toBeInTheDocument()
  })

  it('should fallback when optional fields are not provided', () => {
    const requestWithoutOptional: MaintenanceRequestWithTenant = {
      ...baseRequest,
      tenantName: '',
      unitNumber: '',
      estimatedCost: undefined,
      actualCost: undefined,
      assignedVendor: undefined,
    }

    render(<MaintenanceDetail request={requestWithoutOptional} tenants={tenants} />)

    expect(screen.getByText(/Unit N\/A/)).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getAllByText('-')).toHaveLength(2)
    expect(screen.getByText(/No vendor assigned/i)).toBeInTheDocument()
  })
})
