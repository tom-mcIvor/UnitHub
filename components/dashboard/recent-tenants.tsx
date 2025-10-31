import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { RecentTenant } from "@/app/actions/dashboard"
import Link from "next/link"

interface RecentTenantsProps {
  tenants: RecentTenant[]
}

export function RecentTenants({ tenants }: RecentTenantsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text">Recent Tenants</h2>
        <Link href="/tenants">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {tenants.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-8">No tenants yet</p>
      ) : (
        <div className="space-y-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-border transition-colors"
            >
              <div>
                <p className="font-medium text-text">{tenant.name}</p>
                <p className="text-sm text-text-secondary">Unit {tenant.unit_number}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Active</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
