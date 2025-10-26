import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return Response.json({ error: "Title and description are required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `Analyze this maintenance request and provide:
1. Category (Plumbing, Electrical, HVAC, Painting, Security, Appliances, or Other)
2. Priority (low, medium, high, or urgent)
3. Estimated cost range (provide as a number, e.g., 150 for $150)
4. Brief summary

Title: ${title}
Description: ${description}

Return as JSON with fields: category, priority, estimatedCost, summary. Return ONLY valid JSON.`,
    })

    const analysis = JSON.parse(text)

    return Response.json({
      success: true,
      category: analysis.category,
      priority: analysis.priority,
      estimatedCost: analysis.estimatedCost,
      summary: analysis.summary,
    })
  } catch (error) {
    console.error("Maintenance categorization error:", error)
    return Response.json({ error: "Failed to categorize maintenance request" }, { status: 500 })
  }
}
