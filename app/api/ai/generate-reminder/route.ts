import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { tenantName, daysOverdue, rentAmount } = await request.json()

    if (!tenantName || daysOverdue === undefined || !rentAmount) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `Generate a professional but friendly rent payment reminder message for a tenant. The message should:
1. Be polite and professional
2. Clearly state the amount due
3. Mention how many days overdue (if applicable)
4. Request payment within 5 business days
5. Provide contact information placeholder

Tenant Name: ${tenantName}
Days Overdue: ${daysOverdue}
Rent Amount: $${rentAmount}

Return as JSON with field "message" containing the full message text. Return ONLY valid JSON.`,
    })

    const result = JSON.parse(text)

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Reminder generation error:", error)
    return NextResponse.json({ error: "Failed to generate reminder" }, { status: 500 })
  }
}
