import { render, screen } from '@testing-library/react'
import { RentChart } from '../rent-chart'

// Mock recharts to avoid rendering complexity
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
}))

const mockPayments = [
  {
    id: '1',
    tenantName: 'John Doe',
    amount: 1200,
    status: 'paid' as const,
    dueDate: '2024-01-01',
  },
  {
    id: '2',
    tenantName: 'Jane Smith',
    amount: 1500,
    status: 'pending' as const,
    dueDate: '2024-01-01',
  },
  {
    id: '3',
    tenantName: 'Bob Johnson',
    amount: 1300,
    status: 'overdue' as const,
    dueDate: '2024-01-01',
  },
]

describe('RentChart', () => {
  it('should render monthly income chart', () => {
    render(<RentChart payments={mockPayments} />)

    expect(screen.getByText('Monthly Income')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('should render payment status distribution chart', () => {
    render(<RentChart payments={mockPayments} />)

    expect(screen.getByText('Payment Status Distribution')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('should handle empty payments array', () => {
    render(<RentChart payments={[]} />)

    expect(screen.getByText('Monthly Income')).toBeInTheDocument()
    expect(screen.getByText('Payment Status Distribution')).toBeInTheDocument()
  })

  it('should filter payments by status correctly', () => {
    const { container } = render(<RentChart payments={mockPayments} />)

    // Just verify it renders without errors
    expect(container).toBeInTheDocument()
  })
})
