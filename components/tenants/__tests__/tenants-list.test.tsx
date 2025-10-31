import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TenantsList } from '@/components/tenants/tenants-list'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

jest.mock('@/app/actions/tenants', () => ({
  createTenant: jest.fn(),
  updateTenant: jest.fn(),
  deleteTenant: jest.fn(() => Promise.resolve({ success: true, error: null })),
}))

const mockTenants = [
  {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    unitNumber: '101',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2025-01-01',
    rentAmount: 1200,
    depositAmount: 1200,
    petPolicy: 'No pets',
    notes: 'Good tenant',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '456',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-5678',
    unitNumber: '102',
    leaseStartDate: '2024-02-01',
    leaseEndDate: '2025-02-01',
    rentAmount: 1300,
    depositAmount: 1300,
    petPolicy: 'Cats allowed',
    notes: 'New tenant',
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
]

describe('TenantsList', () => {
  it('renders list of tenants', () => {
    render(<TenantsList initialTenants={mockTenants} error={null} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('101')).toBeInTheDocument()
    expect(screen.getByText('102')).toBeInTheDocument()
  })

  it('shows empty state when no tenants', () => {
    render(<TenantsList initialTenants={[]} error={null} />)

    expect(screen.getByText(/no tenants found/i)).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    render(<TenantsList initialTenants={[]} error="Failed to load tenants" />)

    expect(screen.getByText(/failed to load tenants/i)).toBeInTheDocument()
  })

  it('filters tenants by search term', () => {
    render(<TenantsList initialTenants={mockTenants} error={null} />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'John' } })

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('filters tenants by unit number', () => {
    render(<TenantsList initialTenants={mockTenants} error={null} />)

    const unitInput = screen.getByPlaceholderText(/filter by unit/i)
    fireEvent.change(unitInput, { target: { value: '102' } })

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows Add Tenant button', () => {
    render(<TenantsList initialTenants={mockTenants} error={null} />)

    const addButton = screen.getByRole('button', { name: /add tenant/i })
    expect(addButton).toBeInTheDocument()
  })

  it('opens form modal when Add Tenant is clicked', () => {
    render(<TenantsList initialTenants={mockTenants} error={null} />)

    const addButton = screen.getByRole('button', { name: /add tenant/i })
    fireEvent.click(addButton)

    // Form should appear
    expect(screen.getByRole('heading', { name: /add new tenant/i })).toBeInTheDocument()
  })
})
