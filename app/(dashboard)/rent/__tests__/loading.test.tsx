import { render } from "@testing-library/react"
import RentLoading from "../loading"

describe("Rent loading state", () => {
  it("renders chart and table skeletons", () => {
    const { container } = render(<RentLoading />)

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(20)
    expect(container.querySelectorAll("table").length).toBe(1)
  })
})
