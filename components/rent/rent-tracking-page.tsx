"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RentPaymentForm } from "./rent-payment-form"
import { RentChart } from "./rent-chart"
import { Plus, Search } from "lucide-react"

export function RentTrackingPage() {
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending" | "overdue">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - will be replaced with real data from API
  const payments = [
    {
      id: "1",
      tenantId: "1",
      tenantName: "John Smith",
      unitNumber: "101",
      amount: 1200,
      dueDate: "2025-10-31",
      paidDate: "2025-10-28",
      status: "paid" as const,
      notes: "Paid early",
    },
    {
      id: "2",
      tenantId: "2",
      tenantName: "Sarah Johnson",
      unitNumber: "202",
      amount: 1200,
      dueDate: "2025-10-28",
      paidDate: null,
      status: "overdue" as const,
      notes: "Follow up needed",
    },
    {
      id: "3",
      tenantId: "3",
      tenantName: "Mike Davis",
      unitNumber: "303",
      amount: 1500,
      dueDate: "2025-11-01",
      paidDate: null,
      status: "pending" as const,
      notes: "",
    },
    {
      id: "4",
      tenantId: "1",
      tenantName: "John Smith",
      unitNumber: "101",
      amount: 1200,
      dueDate: "2025-09-30",
      paidDate: "2025-09-29",
      status: "paid" as const,
      notes: "",
    },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || payment.unitNumber.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const stats = {
    totalIncome: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0),
    paidCount: payments.filter((p) => p.status === "paid").length,
    pendingCount: payments.filter((p) => p.status === "pending").length,
    overdueCount: payments.filter((p) => p.status === "overdue").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Rent Tracking</h1>
          <p className="text-text-secondary mt-1">Monitor and manage rent payments</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Record Payment
        </Button>
      </div>

      {showForm && <RentPaymentForm onClose={() => setShowForm(false)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Total Income (Paid)</p>
          <p className="text-3xl font-bold text-text mt-2">${stats.totalIncome.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-2">{stats.paidCount} payments received</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Pending Payments</p>
          <p className="text-3xl font-bold text-text mt-2">${stats.pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-yellow-600 mt-2">{stats.pendingCount} payments due</p>
        </Card>

        <Card className="p-6">
          <p className="text-text-secondary text-sm font-medium">Overdue Payments</p>
          <p className="text-3xl font-bold text-text mt-2">${stats.overdueAmount.toLocaleString()}</p>
          <p className="text-xs text-red-600 mt-2">{stats.overdueCount} payments overdue</p>
        </Card>
      </div>

      {/* Chart */}
      <RentChart payments={payments} />

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-text-secondary" size={20} />
            <Input
              placeholder="Search by tenant name or unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "paid" ? "default" : "outline"}
              onClick={() => setFilterStatus("paid")}
              size="sm"
            >
              Paid
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === "overdue" ? "default" : "outline"}
              onClick={() => setFilterStatus("overdue")}
              size="sm"
            >
              Overdue
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Tenant</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Unit</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Paid Date</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4 font-medium text-text">{payment.tenantName}</td>
                  <td className="py-3 px-4 text-text">{payment.unitNumber}</td>
                  <td className="py-3 px-4 font-medium text-text">${payment.amount}</td>
                  <td className="py-3 px-4 text-text-secondary">{payment.dueDate}</td>
                  <td className="py-3 px-4 text-text-secondary">{payment.paidDate || "-"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-xs">{payment.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">No payments found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
