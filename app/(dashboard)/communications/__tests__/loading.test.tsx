import { render } from "@testing-library/react"
import CommunicationsLoading from "../loading"

describe("Communications loading state", () => {
  it("renders timeline skeletons", () => {
    const { container } = render(<CommunicationsLoading />)

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(20)
    expect(container.querySelectorAll(".space-y-3 > div").length).toBeGreaterThanOrEqual(3)
  })
})
