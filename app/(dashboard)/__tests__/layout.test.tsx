import { render, screen } from '@testing-library/react'
import DashboardRouteLayout from '../layout'

// Mock the DashboardLayout component
jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">
      <div data-testid="dashboard-content">{children}</div>
    </div>
  ),
}))

describe('DashboardRouteLayout', () => {
  it('should render children within DashboardLayout', () => {
    render(
      <DashboardRouteLayout>
        <div data-testid="test-content">Dashboard Content</div>
      </DashboardRouteLayout>
    )

    // Verify DashboardLayout wrapper is rendered
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()

    // Verify children are passed through
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toHaveTextContent('Dashboard Content')
  })

  it('should handle multiple children elements', () => {
    render(
      <DashboardRouteLayout>
        <div>First Child</div>
        <div>Second Child</div>
      </DashboardRouteLayout>
    )

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
  })
})
