import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RentTrackingPage } from '@/components/rent/rent-tracking-page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

const mockPayments = [
  {
    id: '123',
    tenantId: '456',
    tenantName: 'John Doe',
    unitNumber: '101',
    amount: 1200,
    dueDate: '2024-01-31',
    paidDate: '2024-01-30',
    status: 'paid' as const,
    notes: 'Paid early',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-30T00:00:00.000Z',
  },
  {
    id: '789',
    tenantId: '012',
    tenantName: 'Jane Smith',
    unitNumber: '102',
    amount: 1300,
    dueDate: '2024-01-31',
    paidDate: undefined,
    status: 'pending' as const,
    notes: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

const mockTenants = [
  {
    id: '456',
    name: 'John Doe',
    unitNumber: '101',
    email: 'john@example.com',
    phone: '555-1234',
    leaseStartDate: '2024-01-01',
    leaseEndDate: '2025-01-01',
    rentAmount: 1200,
    depositAmount: 1200,
    petPolicy: 'No pets',
    notes: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

describe('RentTrackingPage', () => {
  it('renders rent tracking page with payments', () => {
    render(<RentTrackingPage initialPayments={mockPayments} tenants={mockTenants} error={null} />)

    expect(screen.getByText('Rent Tracking')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays statistics cards', () => {
    render(<RentTrackingPage initialPayments={mockPayments} tenants={mockTenants} error={null} />)

    expect(screen.getByText(/total income/i)).toBeInTheDocument()
    expect(screen.getByText(/pending payments/i)).toBeInTheDocument()
    expect(screen.getByText(/overdue payments/i)).toBeInTheDocument()
  })

  it('filters payments by status', () => {
    render(<RentTrackingPage initialPayments={mockPayments} tenants={mockTenants} error={null} />)

    // Click on "Paid" filter
    const paidButton = screen.getByRole('button', { name: /^paid$/i })
    fireEvent.click(paidButton)

    // Should show only paid payment
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('searches payments by tenant name', () => {
    render(<RentTrackingPage initialPayments={mockPayments} tenants={mockTenants} error={null} />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'Jane' } })

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows Record Payment button', () => {
    render(<RentTrackingPage initialPayments={mockPayments} tenants={mockTenants} error={null} />)

    const recordButton = screen.getByRole('button', { name: /record payment/i })
    expect(recordButton).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    render(<RentTrackingPage initialPayments={[]} tenants={[]} error="Failed to load payments" />)

    expect(screen.getByText(/failed to load payments/i)).toBeInTheDocument()
  })

  it('shows empty state when no payments', () => {
    render(<RentTrackingPage initialPayments={[]} tenants={mockTenants} error={null} />)

    expect(screen.getByText(/no payments found/i)).toBeInTheDocument()
  })
})
