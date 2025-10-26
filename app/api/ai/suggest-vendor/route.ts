import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { category, priority, description } = await request.json()

    if (!category || !priority) {
      return Response.json({ error: "Category and priority are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `Based on this maintenance request, suggest 3 types of vendors that could handle it. For each, provide the vendor type and a brief reason why they'd be suitable.

Category: ${category}
Priority: ${priority}
Description: ${description}

Return as JSON with array field "suggestions" containing objects with "vendorType" and "reason" fields. Return ONLY valid JSON.`,
    })

    const suggestions = JSON.parse(text)

    return Response.json({
      success: true,
      suggestions: suggestions.suggestions,
    })
  } catch (error) {
    console.error("Vendor suggestion error:", error)
    return Response.json({ error: "Failed to suggest vendors" }, { status: 500 })
  }
}
