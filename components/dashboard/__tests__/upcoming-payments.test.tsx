import React from 'react'
import { render, screen } from '@testing-library/react'
import { UpcomingPayments } from '@/components/dashboard/upcoming-payments'
import type { UpcomingPayment } from '@/app/actions/dashboard'

const payments: UpcomingPayment[] = [
  {
    id: 'payment-1',
    tenant_id: 'tenant-1',
    tenant_name: 'Michael Green',
    unit_number: '302',
    amount: '1400.5',
    due_date: '2025-11-30',
    status: 'overdue',
  },
]

describe('UpcomingPayments', () => {
  it('should render payment rows with formatted values', () => {
    render(<UpcomingPayments payments={payments} />)

    expect(screen.getByText('Michael Green')).toBeInTheDocument()
    expect(screen.getByText('Unit 302')).toBeInTheDocument()
    expect(screen.getByText('$1,400.50')).toBeInTheDocument()
    expect(screen.getByText(/Nov 30, 2025/)).toBeInTheDocument()
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('should render empty state when there are no upcoming payments', () => {
    render(<UpcomingPayments payments={[]} />)

    expect(screen.getByText(/No upcoming payments/i)).toBeInTheDocument()
  })
})
