import React from 'react'
import { render, screen } from '@testing-library/react'
import SettingsRoute from '@/app/settings/page'

jest.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}))

const mockSettingsPage = jest.fn(() => <div data-testid="settings-page" />)

jest.mock('@/components/settings/settings-page', () => ({
  SettingsPage: () => mockSettingsPage(),
}))

describe('Settings Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders settings page within layout', () => {
    const element = SettingsRoute()
    render(element)

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(mockSettingsPage).toHaveBeenCalledTimes(1)
  })
})
