import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  color: string
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-text mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}
