import { render } from "@testing-library/react"
import TenantsLoading from "../loading"

describe("Tenants loading state", () => {
  it("renders tenant table skeleton rows", () => {
    const { container } = render(<TenantsLoading />)

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThanOrEqual(20)
    const rows = container.querySelectorAll("tbody tr")
    expect(rows.length).toBe(5)
  })
})
