import { render, screen } from '@testing-library/react'
import { SettingsPage } from '../settings-page'

describe('SettingsPage', () => {
  it('should render page title', () => {
    render(<SettingsPage />)

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Manage your UnitHub account and integrations')).toBeInTheDocument()
  })

  it('should render API integrations section', () => {
    render(<SettingsPage />)

    expect(screen.getByText('API Integrations')).toBeInTheDocument()
    expect(screen.getByText('OpenAI API Key')).toBeInTheDocument()
    expect(screen.getByText('Stripe API Key')).toBeInTheDocument()
    expect(screen.getByText('Supabase URL')).toBeInTheDocument()
  })

  it('should render feature status section', () => {
    render(<SettingsPage />)

    expect(screen.getByText('Feature Status')).toBeInTheDocument()
    expect(screen.getByText('AI Lease Extraction')).toBeInTheDocument()
    expect(screen.getByText('Maintenance Categorization')).toBeInTheDocument()
    expect(screen.getByText('Payment Reminders')).toBeInTheDocument()
  })

  it('should render account settings section', () => {
    render(<SettingsPage />)

    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByText('Company Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
  })

  it('should render danger zone', () => {
    render(<SettingsPage />)

    expect(screen.getByText('Danger Zone')).toBeInTheDocument()
    expect(screen.getByText('Delete Account')).toBeInTheDocument()
  })
})
