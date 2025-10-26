"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface AICategorization {
  category: string
  priority: string
  estimatedCost: number
  summary: string
}

interface AICategorizationProps {
  title: string
  description: string
  onApply: (data: AICategorization) => void
}

export function AICategorization({ title, description, onApply }: AICategorizationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AICategorization | null>(null)

  const handleAnalyze = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/categorize-maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })

      const data = await response.json()
      if (data.success) {
        setResult(data)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!result) {
    return (
      <Button onClick={handleAnalyze} disabled={isLoading} variant="outline" className="gap-2 bg-transparent">
        <Sparkles size={16} />
        {isLoading ? "Analyzing..." : "AI Analyze"}
      </Button>
    )
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <Sparkles size={16} />
          AI Analysis
        </h3>
        <Button
          onClick={() => {
            onApply(result)
            setResult(null)
          }}
          size="sm"
        >
          Apply
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <p className="text-blue-700 font-medium">Category: {result.category}</p>
        </div>
        <div>
          <p className="text-blue-700 font-medium">Priority: {result.priority}</p>
        </div>
        <div>
          <p className="text-blue-700 font-medium">Est. Cost: ${result.estimatedCost}</p>
        </div>
        <div>
          <p className="text-blue-700 font-medium">Summary:</p>
          <p className="text-blue-600">{result.summary}</p>
        </div>
      </div>
    </Card>
  )
}
