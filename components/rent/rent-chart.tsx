"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface RentChartProps {
  payments: Array<{
    id: string
    tenantName: string
    amount: number
    status: "paid" | "pending" | "overdue"
    dueDate: string
  }>
}

export function RentChart({ payments }: RentChartProps) {
  // Prepare data for bar chart (monthly income)
  const monthlyData = [
    { month: "Aug", paid: 3600, pending: 0, overdue: 0 },
    { month: "Sep", paid: 3600, pending: 0, overdue: 0 },
    { month: "Oct", paid: 2400, pending: 1500, overdue: 1200 },
  ]

  // Prepare data for pie chart (payment status)
  const statusData = [
    {
      name: "Paid",
      value: payments.filter((p) => p.status === "paid").length,
      color: "#10b981",
    },
    {
      name: "Pending",
      value: payments.filter((p) => p.status === "pending").length,
      color: "#f59e0b",
    },
    {
      name: "Overdue",
      value: payments.filter((p) => p.status === "overdue").length,
      color: "#ef4444",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Income Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Monthly Income</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="paid" stackId="a" fill="#10b981" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
            <Bar dataKey="overdue" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Status Pie Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Payment Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
