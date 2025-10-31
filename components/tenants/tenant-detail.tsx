"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import type { Tenant } from "@/lib/types"

interface TenantDetailProps {
  tenant: Tenant
}

export function TenantDetail({ tenant }: TenantDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const isLeaseExpiringSoon = new Date(tenant.lease_end) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenants">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={20} />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text">{tenant.name}</h1>
          <p className="text-text-secondary mt-1">Unit {tenant.unit_number}</p>
        </div>
        <Button className="gap-2">
          <Edit2 size={20} />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Email</p>
                <p className="text-text font-medium">{tenant.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Phone</p>
                <p className="text-text font-medium">{tenant.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Unit</p>
                <p className="text-text font-medium">{tenant.unit_number}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Lease Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Lease Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Lease Period</p>
                <p className="text-text font-medium">
                  {formatDate(tenant.lease_start)} to {formatDate(tenant.lease_end)}
                </p>
                {isLeaseExpiringSoon && <Badge className="mt-2 bg-yellow-100 text-yellow-700">Expiring Soon</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-primary" />
              <div>
                <p className="text-sm text-text-secondary">Monthly Rent</p>
                <p className="text-text font-medium">${parseFloat(tenant.rent_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Pet Policy</p>
              <p className="text-text font-medium">{tenant.pet_policy || 'No policy specified'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Financial Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Monthly Rent</p>
            <p className="text-2xl font-bold text-text">${parseFloat(tenant.rent_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Security Deposit</p>
            <p className="text-2xl font-bold text-text">${parseFloat(tenant.deposit_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 bg-surface rounded-lg">
            <p className="text-sm text-text-secondary mb-1">Annual Income</p>
            <p className="text-2xl font-bold text-text">${(parseFloat(tenant.rent_amount) * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {tenant.notes && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Notes</h2>
          <p className="text-text">{tenant.notes}</p>
        </Card>
      )}

      {/* Tabs for related information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Related Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start bg-transparent">
            Payment History
          </Button>
          <Button variant="outline" className="justify-start bg-transparent">
            Maintenance Requests
          </Button>
          <Button variant="outline" className="justify-start bg-transparent">
            Communication Log
          </Button>
        </div>
      </Card>
    </div>
  )
}
