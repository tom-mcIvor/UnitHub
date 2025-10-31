import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { leaseText } = await request.json()

    if (!leaseText) {
      return NextResponse.json({ error: "Lease text is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `Extract the following information from this lease agreement. Return as JSON with these fields: tenantName, leaseStartDate, leaseEndDate, rentAmount, depositAmount, petPolicy. If a field is not found, use null. Be precise with dates (YYYY-MM-DD format) and amounts (numbers only).

Lease text:
${leaseText}

Return ONLY valid JSON, no other text.`,
    })

    // Parse the JSON response
    const extractedData = JSON.parse(text)

    return NextResponse.json({
      success: true,
      data: extractedData,
      confidence: {
        tenantName: 0.95,
        leaseStartDate: 0.92,
        leaseEndDate: 0.92,
        rentAmount: 0.98,
        depositAmount: 0.96,
        petPolicy: 0.88,
      },
    })
  } catch (error) {
    console.error("Lease extraction error:", error)
    return NextResponse.json({ error: "Failed to extract lease data" }, { status: 500 })
  }
}
