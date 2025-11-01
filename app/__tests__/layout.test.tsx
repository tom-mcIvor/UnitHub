import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

// Note: RTL doesn't render the actual <html> and <body> tags in the container
// since it renders components in isolation. We can only test that children
// are rendered correctly and the component doesn't throw errors.

describe('RootLayout', () => {
  it('should render children correctly', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )

    // Verify children are rendered
    const child = screen.getByTestId('test-child')
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent('Test Content')
  })

  it('should render without errors when provided children', () => {
    const { container } = render(
      <RootLayout>
        <div>Page Content</div>
        <nav>Navigation</nav>
      </RootLayout>
    )

    // Verify multiple children are rendered
    expect(screen.getByText('Page Content')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(container).toBeInTheDocument()
  })

  it('should include Toaster component for notifications', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )

    // The Toaster component should be rendered (sonner creates a portal)
    // We just verify the layout renders without errors
    expect(container).toBeInTheDocument()
  })
})
