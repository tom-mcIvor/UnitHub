import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MaintenanceOverview() {
  const requests = [
    {
      id: 1,
      title: "Leaky faucet in kitchen",
      unit: "101",
      priority: "medium",
      status: "open",
    },
    {
      id: 2,
      title: "HVAC not cooling",
      unit: "202",
      priority: "urgent",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Door lock replacement",
      unit: "303",
      priority: "high",
      status: "open",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-text mb-4">Recent Maintenance Requests</h2>

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-border transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-text">{request.title}</p>
              <p className="text-sm text-text-secondary">Unit {request.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
              </Badge>
              <Badge variant="outline">{request.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
