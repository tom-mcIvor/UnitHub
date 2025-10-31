import React from 'react'
import { render, screen } from '@testing-library/react'
import { TenantDetail } from '@/components/tenants/tenant-detail'
import type { Tenant } from '@/lib/types'

jest.mock('@/components/tenants/tenant-form', () => ({
  TenantForm: () => null,
}))

const baseTenant: Tenant = {
  id: 'tenant-1',
  name: 'Emily Carter',
  email: 'emily@example.com',
  phone: '555-0101',
  unitNumber: '305',
  leaseStartDate: '2024-01-01',
  leaseEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  rentAmount: 1500,
  depositAmount: 1500,
  petPolicy: 'Dogs allowed',
  notes: 'Pays on time every month.',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-02-01T00:00:00.000Z',
}

describe('TenantDetail', () => {
  it('should render tenant contact, lease, and financial information', () => {
    render(<TenantDetail tenant={baseTenant} />)

    expect(screen.getByText('Emily Carter')).toBeInTheDocument()
    expect(screen.getByText('emily@example.com')).toBeInTheDocument()
    expect(screen.getByText('555-0101')).toBeInTheDocument()
    expect(screen.getByText('Unit 305')).toBeInTheDocument()
    expect(screen.getByText(/Dogs allowed/)).toBeInTheDocument()
    expect(screen.getAllByText('$1,500.00')).toHaveLength(3)
    expect(screen.getByText('$18,000.00')).toBeInTheDocument()
    expect(screen.getByText(/Expiring Soon/i)).toBeInTheDocument()
    expect(screen.getByText('Pays on time every month.')).toBeInTheDocument()
  })

  it('should fallback when optional tenant fields are missing', () => {
    const tenantWithoutOptional: Tenant = {
      ...baseTenant,
      petPolicy: '',
      notes: '',
    }

    render(<TenantDetail tenant={tenantWithoutOptional} />)

    expect(screen.getByText(/No policy specified/i)).toBeInTheDocument()
    expect(screen.queryByText(/Pays on time every month./)).not.toBeInTheDocument()
  })
})
