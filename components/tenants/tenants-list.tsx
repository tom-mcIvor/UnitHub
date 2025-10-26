"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TenantForm } from "./tenant-form"
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export function TenantsList() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUnit, setFilterUnit] = useState("")

  // Mock data - will be replaced with real data from API
  const tenants = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "555-0101",
      unitNumber: "101",
      leaseStartDate: "2023-01-15",
      leaseEndDate: "2025-01-14",
      rentAmount: 1200,
      depositAmount: 1200,
      petPolicy: "No pets",
      notes: "Excellent tenant",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "555-0102",
      unitNumber: "202",
      leaseStartDate: "2023-06-01",
      leaseEndDate: "2025-05-31",
      rentAmount: 1200,
      depositAmount: 1200,
      petPolicy: "One cat allowed",
      notes: "Pays on time",
    },
    {
      id: "3",
      name: "Mike Davis",
      email: "mike@example.com",
      phone: "555-0103",
      unitNumber: "303",
      leaseStartDate: "2024-03-01",
      leaseEndDate: "2026-02-28",
      rentAmount: 1500,
      depositAmount: 1500,
      petPolicy: "No pets",
      notes: "New tenant",
    },
  ]

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnit = !filterUnit || tenant.unitNumber === filterUnit
    return matchesSearch && matchesUnit
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Tenants</h1>
          <p className="text-text-secondary mt-1">Manage all your tenants and their information</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Add Tenant
        </Button>
      </div>

      {showForm && <TenantForm onClose={() => setShowForm(false)} />}

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            placeholder="Filter by unit..."
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="md:w-40"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Name</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Unit</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Email</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Rent</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Lease End</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4 font-medium text-text">{tenant.name}</td>
                  <td className="py-3 px-4 text-text">{tenant.unitNumber}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.email}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.phone}</td>
                  <td className="py-3 px-4 font-medium text-text">${tenant.rentAmount}</td>
                  <td className="py-3 px-4 text-text-secondary">{tenant.leaseEndDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/tenants/${tenant.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye size={16} />
                          View
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No tenants found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
