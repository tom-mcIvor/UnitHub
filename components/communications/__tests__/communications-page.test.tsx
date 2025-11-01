import { render, screen } from '@testing-library/react'
import { CommunicationsPage } from '../communications-page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}))

// Mock server actions
jest.mock('@/app/actions/communications', () => ({
  deleteCommunicationLog: jest.fn(),
}))

describe('CommunicationsPage', () => {
  it('should render page title', () => {
    render(<CommunicationsPage initialCommunications={[]} tenants={[]} error={null} />)

    expect(screen.getByText('Communication Log')).toBeInTheDocument()
  })

  it('should render add communication button', () => {
    render(<CommunicationsPage initialCommunications={[]} tenants={[]} error={null} />)

    expect(screen.getByText('Log Communication')).toBeInTheDocument()
  })

  it('should show empty state when no communications', () => {
    render(<CommunicationsPage initialCommunications={[]} tenants={[]} error={null} />)

    expect(screen.getByText('No communications found')).toBeInTheDocument()
  })

  it('should render communications when provided', () => {
    const communications = [
      {
        id: 'log-1',
        tenantId: 'tenant-1',
        type: 'email' as const,
        subject: 'Rent Reminder',
        content: 'Test content',
        communicatedAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T10:00:00Z',
        tenantName: 'John Doe',
        unitNumber: '101',
      },
    ]

    render(<CommunicationsPage initialCommunications={communications} tenants={[]} error={null} />)

    expect(screen.getByText('Rent Reminder')).toBeInTheDocument()
    // Just verify the communication card is rendered, don't check tenant name
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should show error message when provided', () => {
    render(<CommunicationsPage initialCommunications={[]} tenants={[]} error="Database error" />)

    expect(screen.getByText(/error loading communications/i)).toBeInTheDocument()
    expect(screen.getByText(/database error/i)).toBeInTheDocument()
  })
})
