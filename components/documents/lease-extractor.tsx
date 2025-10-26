"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload, CheckCircle } from "lucide-react"

interface LeaseExtractorProps {
  onClose: () => void
}

export function LeaseExtractor({ onClose }: LeaseExtractorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setIsProcessing(true)

    try {
      // TODO: Call API to extract lease data using AI
      // For now, simulate extraction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setExtractedData({
        tenantName: "John Smith",
        leaseStartDate: "2023-01-15",
        leaseEndDate: "2025-01-14",
        rentAmount: 1200,
        depositAmount: 1200,
        petPolicy: "No pets allowed",
        confidence: {
          tenantName: 0.98,
          leaseStartDate: 0.95,
          leaseEndDate: 0.95,
          rentAmount: 0.99,
          depositAmount: 0.97,
          petPolicy: 0.92,
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async () => {
    if (!extractedData) return

    setIsProcessing(true)
    try {
      // TODO: Call API to import extracted data
      console.log("Importing extracted data:", extractedData)
      onClose()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border p-6 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-text">Extract Lease Data</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!extractedData ? (
            <div>
              <p className="text-text-secondary mb-4">
                Upload a lease PDF and we'll automatically extract key information like tenant name, dates, rent amount,
                and pet policy.
              </p>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-blue-50" : "border-border"
                }`}
              >
                <Upload size={40} className="mx-auto mb-3 text-text-secondary" />
                <p className="text-sm text-text-secondary mb-3">
                  Drag and drop your lease PDF here, or click to select
                </p>
                <input type="file" onChange={handleFileChange} className="hidden" id="lease-file-input" accept=".pdf" />
                <label htmlFor="lease-file-input" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" className="bg-transparent">
                    Select PDF
                  </Button>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-surface rounded-lg">
                  <p className="text-sm text-text-secondary mb-2">Selected file:</p>
                  <p className="font-medium text-text">{selectedFile.name}</p>
                  {isProcessing && <p className="text-sm text-primary mt-2">Processing...</p>}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={24} className="text-green-600" />
                <h3 className="text-lg font-semibold text-text">Extraction Complete</h3>
              </div>

              <div className="space-y-3">
                {Object.entries(extractedData).map(([key, value]) => {
                  if (key === "confidence") return null

                  const confidence = extractedData.confidence?.[key as keyof typeof extractedData.confidence]
                  const confidencePercent = confidence ? Math.round(confidence * 100) : 0

                  return (
                    <div key={key} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-text-secondary capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        {confidence && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              confidence > 0.9
                                ? "bg-green-100 text-green-700"
                                : confidence > 0.8
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {confidencePercent}% confidence
                          </span>
                        )}
                      </div>
                      <Input value={String(value)} readOnly className="bg-surface" />
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  Review the extracted data above. You can edit any fields before importing. Click "Import" to add this
                  data to the tenant's profile.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {extractedData && (
              <Button onClick={handleImport} disabled={isProcessing}>
                {isProcessing ? "Importing..." : "Import Data"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
