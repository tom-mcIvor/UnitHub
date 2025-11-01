import { render } from "@testing-library/react"
import DocumentsLoading from "../loading"

describe("Documents loading state", () => {
  it("renders a grid of document skeletons", () => {
    const { container } = render(<DocumentsLoading />)

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(20)
    const cards = container.querySelectorAll(".grid div.border-border")
    expect(cards.length).toBeGreaterThan(0)
  })
})
