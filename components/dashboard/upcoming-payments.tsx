import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function UpcomingPayments() {
  const payments = [
    {
      id: 1,
      tenant: "John Smith",
      unit: "101",
      amount: "$1,200",
      dueDate: "Oct 31, 2025",
      status: "pending",
    },
    {
      id: 2,
      tenant: "Sarah Johnson",
      unit: "202",
      amount: "$1,200",
      dueDate: "Oct 28, 2025",
      status: "overdue",
    },
    {
      id: 3,
      tenant: "Mike Davis",
      unit: "303",
      amount: "$1,500",
      dueDate: "Nov 1, 2025",
      status: "pending",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-text mb-4">Upcoming Payments</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Tenant</th>
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border hover:bg-surface">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-text">{payment.tenant}</p>
                    <p className="text-xs text-text-secondary">Unit {payment.unit}</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-text">{payment.amount}</td>
                <td className="py-3 px-4 text-text-secondary">{payment.dueDate}</td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
