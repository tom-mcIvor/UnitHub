import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function RecentTenants() {
  const tenants = [
    { id: 1, name: "John Smith", unit: "101", status: "Active" },
    { id: 2, name: "Sarah Johnson", unit: "202", status: "Active" },
    { id: 3, name: "Mike Davis", unit: "303", status: "Active" },
    { id: 4, name: "Emily Brown", unit: "104", status: "Active" },
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">Recent Tenants</h2>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-border transition-colors"
          >
            <div>
              <p className="font-medium text-text">{tenant.name}</p>
              <p className="text-sm text-text-secondary">Unit {tenant.unit}</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">{tenant.status}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
