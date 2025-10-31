import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Tenants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-20" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-16" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-24" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-24" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-20" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-20" /></th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary"><Skeleton className="h-4 w-20" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
