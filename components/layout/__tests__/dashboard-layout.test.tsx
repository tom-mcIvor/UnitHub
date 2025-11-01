import { render, screen } from '@testing-library/react'
import { DashboardLayout } from '../dashboard-layout'

// Mock components
jest.mock('../sidebar', () => ({
  Sidebar: () => <div>Mock Sidebar</div>,
}))

jest.mock('../header', () => ({
  Header: () => <div>Mock Header</div>,
}))

jest.mock('@/components/auth/sign-in-form', () => ({
  SignInForm: () => <div>Mock Sign In Form</div>,
}))

jest.mock('@/components/auth/sign-up-form', () => ({
  SignUpForm: () => <div>Mock Sign Up Form</div>,
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: any) => <div>{children}</div>,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
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
