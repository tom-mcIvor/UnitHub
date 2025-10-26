"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Copy } from "lucide-react"

interface PaymentReminderGeneratorProps {
  tenantName: string
  rentAmount: number
  daysOverdue: number
}

export function PaymentReminderGenerator({ tenantName, rentAmount, daysOverdue }: PaymentReminderGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantName, rentAmount, daysOverdue }),
      })

      const data = await response.json()
      if (data.success) {
        setMessage(data.message)
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (message) {
      navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!message) {
    return (
      <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="gap-2 bg-transparent">
        <Sparkles size={16} />
        {isLoading ? "Generating..." : "Generate Reminder"}
      </Button>
    )
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-amber-900 flex items-center gap-2">
          <Sparkles size={16} />
          AI Generated Reminder
        </h3>
        <Button onClick={handleCopy} size="sm" variant="outline" className="gap-1 bg-transparent">
          <Copy size={14} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <p className="text-sm text-amber-900 whitespace-pre-wrap">{message}</p>
    </Card>
  )
}
