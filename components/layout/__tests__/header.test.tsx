import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Header } from '../header'

describe('Header', () => {
  it('should render header component', () => {
    render(<Header onMenuClick={jest.fn()} />)

    // Header renders as a simple component
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('should call auth click handler when user icon pressed', async () => {
    const onAuthClick = jest.fn()
    const user = userEvent.setup()

    render(<Header onMenuClick={jest.fn()} onAuthClick={onAuthClick} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onAuthClick).toHaveBeenCalledTimes(1)
  })
})
