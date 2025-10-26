"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your UnitHub account and integrations</p>
      </div>

      {/* API Keys Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">API Integrations</h2>
        <p className="text-text-secondary text-sm mb-4">
          Configure API keys for AI features and integrations. These are required for lease extraction, maintenance
          categorization, and other AI-powered features.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">OpenAI API Key</label>
            <div className="flex gap-2">
              <Input type="password" placeholder="sk-..." className="flex-1" />
              <Button variant="outline" className="bg-transparent">
                Save
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-1">Used for lease extraction and maintenance categorization</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Stripe API Key</label>
            <div className="flex gap-2">
              <Input type="password" placeholder="sk_live_..." className="flex-1" />
              <Button variant="outline" className="bg-transparent">
                Save
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-1">For future payment processing features</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Supabase URL</label>
            <div className="flex gap-2">
              <Input placeholder="https://your-project.supabase.co" className="flex-1" />
              <Button variant="outline" className="bg-transparent">
                Save
              </Button>
            </div>
            <p className="text-xs text-text-secondary mt-1">For database and file storage</p>
          </div>
        </div>
      </Card>

      {/* Feature Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Feature Status</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div>
              <p className="font-medium text-text">AI Lease Extraction</p>
              <p className="text-sm text-text-secondary">Automatically extract data from lease PDFs</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div>
              <p className="font-medium text-text">Maintenance Categorization</p>
              <p className="text-sm text-text-secondary">AI-powered priority and category detection</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div>
              <p className="font-medium text-text">Payment Reminders</p>
              <p className="text-sm text-text-secondary">Generate professional payment reminder messages</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Not Configured</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Account Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Company Name</label>
            <Input placeholder="Your property management company" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Email</label>
            <Input type="email" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Phone</label>
            <Input placeholder="555-0000" />
          </div>

          <Button className="mt-4">Save Changes</Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-800 mb-4">These actions cannot be undone. Please proceed with caution.</p>
        <Button variant="destructive">Delete Account</Button>
      </Card>
    </div>
  )
}
