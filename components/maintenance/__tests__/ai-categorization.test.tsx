import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AICategorization } from '../ai-categorization'

global.fetch = jest.fn()

describe('AICategorization', () => {
  const mockOnApply = jest.fn()
  const mockTitle = 'Leaking faucet'
  const mockDescription = 'Kitchen faucet is dripping constantly'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('renders AI Analyze button initially', () => {
    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    expect(screen.getByText('AI Analyze')).toBeInTheDocument()
  })

  it('shows loading state when analyzing', async () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    const button = screen.getByText('AI Analyze')
    await user.click(button)

    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('displays AI analysis results when successful', async () => {
    const mockResult = {
      success: true,
      category: 'Plumbing',
      priority: 'medium',
      estimatedCost: 150,
      summary: 'Minor plumbing issue requiring immediate attention',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    })

    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    const button = screen.getByText('AI Analyze')
    await user.click(button)

    await waitFor(() => {
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
    })

    expect(screen.getByText(/Category: Plumbing/)).toBeInTheDocument()
    expect(screen.getByText(/Priority: medium/)).toBeInTheDocument()
    expect(screen.getByText(/Est\. Cost: \$150/)).toBeInTheDocument()
    expect(screen.getByText('Minor plumbing issue requiring immediate attention')).toBeInTheDocument()
  })

  it('calls API with correct data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, category: 'Plumbing', priority: 'medium', estimatedCost: 150, summary: 'Test' }),
    })

    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    const button = screen.getByText('AI Analyze')
    await user.click(button)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ai/categorize-maintenance',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: mockTitle, description: mockDescription }),
        }
      )
    })
  })

  it('calls onApply with result when Apply button clicked', async () => {
    const mockResult = {
      success: true,
      category: 'Plumbing',
      priority: 'medium',
      estimatedCost: 150,
      summary: 'Test summary',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    })

    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    // Click analyze
    await user.click(screen.getByText('AI Analyze'))

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Apply')).toBeInTheDocument()
    })

    // Click apply
    await user.click(screen.getByText('Apply'))

    expect(mockOnApply).toHaveBeenCalledWith({
      success: true,
      category: 'Plumbing',
      priority: 'medium',
      estimatedCost: 150,
      summary: 'Test summary',
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    await user.click(screen.getByText('AI Analyze'))

    await waitFor(() => {
      expect(screen.getByText('AI Analyze')).toBeInTheDocument()
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('resets to initial state after applying results', async () => {
    const mockResult = {
      success: true,
      category: 'Plumbing',
      priority: 'medium',
      estimatedCost: 150,
      summary: 'Test',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResult,
    })

    const user = userEvent.setup()

    render(<AICategorization title={mockTitle} description={mockDescription} onApply={mockOnApply} />)

    // Analyze
    await user.click(screen.getByText('AI Analyze'))
    await waitFor(() => expect(screen.getByText('Apply')).toBeInTheDocument())

    // Apply
    await user.click(screen.getByText('Apply'))

    // Should show analyze button again
    expect(screen.getByText('AI Analyze')).toBeInTheDocument()
    expect(screen.queryByText('Apply')).not.toBeInTheDocument()
  })
})
