import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TenantForm } from '@/components/tenants/tenant-form'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

// Mock server action
jest.mock('@/app/actions/tenants', () => ({
  createTenant: jest.fn(() => Promise.resolve({
    success: true,
    error: null,
    data: { id: '123' },
  })),
}))

describe('TenantForm', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders all form fields', () => {
    render(<TenantForm onClose={mockOnClose} />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/unit number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lease start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lease end date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rent amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/deposit amount/i)).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(<TenantForm onClose={mockOnClose} />)

    const submitButton = screen.getByRole('button', { name: /add tenant/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0)
    })
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<TenantForm onClose={mockOnClose} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<TenantForm onClose={mockOnClose} />)

    // Fill out form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '555-1234')
    await user.type(screen.getByLabelText(/unit number/i), '101')
    await user.type(screen.getByLabelText(/lease start date/i), '2024-01-01')
    await user.type(screen.getByLabelText(/lease end date/i), '2025-01-01')
    await user.type(screen.getByLabelText(/rent amount/i), '1200')
    await user.type(screen.getByLabelText(/deposit amount/i), '1200')

    const submitButton = screen.getByRole('button', { name: /add tenant/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/tenant added successfully/i)).toBeInTheDocument()
    })
  })
})
