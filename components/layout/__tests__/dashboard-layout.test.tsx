import { render, screen } from '@testing-library/react'
import { DashboardLayout } from '../dashboard-layout'

// Mock components
jest.mock('../sidebar', () => ({
  Sidebar: () => <div>Mock Sidebar</div>,
}))

jest.mock('../header', () => ({
  Header: () => <div>Mock Header</div>,
}))

describe('DashboardLayout', () => {
  it('should render children', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render sidebar and header', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    expect(screen.getByText('Mock Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
  })
})
