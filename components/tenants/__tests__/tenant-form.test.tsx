import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TenantForm } from '@/components/tenants/tenant-form'
import { toast } from 'sonner'

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const getInputByLabel = (labelText: string) => {
  const label = screen.getByText(labelText)
  const field = label.parentElement?.querySelector('input, textarea')
  if (!field) {
    throw new Error(`Unable to find form control for label: ${labelText}`)
  }
  return field as HTMLInputElement | HTMLTextAreaElement
}

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
  updateTenant: jest.fn(() => Promise.resolve({
    success: true,
    error: null,
    data: { id: '123' },
  })),
}))

describe('TenantForm', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<TenantForm onClose={mockOnClose} />)

    expect(screen.getByText('Full Name *')).toBeInTheDocument()
    expect(screen.getByText('Email *')).toBeInTheDocument()
    expect(screen.getByText('Phone *')).toBeInTheDocument()
    expect(screen.getByText('Unit Number *')).toBeInTheDocument()
    expect(screen.getByText('Lease Start Date *')).toBeInTheDocument()
    expect(screen.getByText('Lease End Date *')).toBeInTheDocument()
    expect(screen.getByText('Monthly Rent *')).toBeInTheDocument()
    expect(screen.getByText('Security Deposit *')).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(<TenantForm onClose={mockOnClose} />)

    const submitButton = screen.getByRole('button', { name: /save tenant/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText(/is required/i).length).toBeGreaterThan(0)
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
    await user.type(getInputByLabel('Full Name *'), 'John Doe')
    await user.type(getInputByLabel('Email *'), 'john@example.com')
    await user.type(getInputByLabel('Phone *'), '5551234567')
    await user.type(getInputByLabel('Unit Number *'), '101')
    await user.type(getInputByLabel('Lease Start Date *'), '2024-01-01')
    await user.type(getInputByLabel('Lease End Date *'), '2025-01-01')
    await user.type(getInputByLabel('Monthly Rent *'), '1200')
    await user.type(getInputByLabel('Security Deposit *'), '1200')

    const submitButton = screen.getByRole('button', { name: /save tenant/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Tenant created successfully!')
    })
  })
})
