import { render, screen } from '@testing-library/react'
import { Header } from '../header'

describe('Header', () => {
  it('should render header component', () => {
    render(<Header />)

    // Header renders as a simple component
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
  })
})
