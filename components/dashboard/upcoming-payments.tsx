import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UpcomingPayment } from "@/app/actions/dashboard"

interface UpcomingPaymentsProps {
  payments: UpcomingPayment[]
}

export function UpcomingPayments({ payments }: UpcomingPaymentsProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatAmount = (amount: string) => {
    return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-text mb-4">Upcoming Payments</h2>

      {payments.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-8">No upcoming payments</p>
      ) : (
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
                      <p className="font-medium text-text">{payment.tenant_name}</p>
                      <p className="text-xs text-text-secondary">Unit {payment.unit_number}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-text">{formatAmount(payment.amount)}</td>
                  <td className="py-3 px-4 text-text-secondary">{formatDate(payment.due_date)}</td>
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
      )}
    </Card>
  )
}
