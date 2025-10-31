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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-8 w-1/2" />
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Communications Timeline */}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative">
              <div className="flex gap-4 p-4 bg-surface rounded-lg">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <Skeleton className="h-5 w-48 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
