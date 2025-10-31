import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RentPaymentForm } from '@/components/rent/rent-payment-form'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

// Mock server action
jest.mock('@/app/actions/rent', () => ({
  createRentPayment: jest.fn(() => Promise.resolve({
    success: true,
    error: null,
    data: { id: '123' },
  })),
}))

const mockTenants = [
  {
    id: '123',
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

describe('RentPaymentForm', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders form with tenant dropdown', () => {
    render(<RentPaymentForm onClose={mockOnClose} tenants={mockTenants} />)

    expect(screen.getByText('Tenant *')).toBeInTheDocument()
    expect(screen.getByText('Amount *')).toBeInTheDocument()
    expect(screen.getByText('Due Date *')).toBeInTheDocument()
    expect(screen.getByText('Status *')).toBeInTheDocument()
  })

  it('populates tenant dropdown with provided tenants', () => {
    render(<RentPaymentForm onClose={mockOnClose} tenants={mockTenants} />)

    // Check if tenant option is in the dropdown
    const option = screen.getByText(/John Doe \(Unit 101\)/i)
    expect(option).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(<RentPaymentForm onClose={mockOnClose} tenants={mockTenants} />)

    const submitButton = screen.getByRole('button', { name: /record payment/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0)
    })
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<RentPaymentForm onClose={mockOnClose} tenants={mockTenants} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<RentPaymentForm onClose={mockOnClose} tenants={mockTenants} />)

    const [tenantSelect, statusSelect] = screen.getAllByRole('combobox')
    await user.selectOptions(tenantSelect, '123')
    await user.selectOptions(statusSelect, 'paid')

    const amountInput = screen.getByPlaceholderText(/1200/i)
    await user.clear(amountInput)
    await user.type(amountInput, '1200')

    const dueDateInput = document.querySelector('input[name="dueDate"]') as HTMLInputElement | null
    expect(dueDateInput).not.toBeNull()
    fireEvent.change(dueDateInput!, { target: { value: '2024-01-31' } })

    const submitButton = screen.getByRole('button', { name: /record payment/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/payment recorded successfully/i)).toBeInTheDocument()
    })
  })
})
