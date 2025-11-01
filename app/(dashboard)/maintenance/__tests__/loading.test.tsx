import { render } from "@testing-library/react"
import MaintenanceLoading from "../loading"

describe("Maintenance loading state", () => {
  it("renders request table skeletons", () => {
    const { container } = render(<MaintenanceLoading />)

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(25)
    expect(container.querySelectorAll("table").length).toBe(1)
  })
})
