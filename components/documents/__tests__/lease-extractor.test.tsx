import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LeaseExtractor } from "../lease-extractor"

describe("LeaseExtractor", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("guides the user to upload a lease PDF", () => {
    const onClose = jest.fn()
    render(<LeaseExtractor onClose={onClose} />)

    expect(screen.getByText(/upload a lease pdf/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /select pdf/i })).toBeInTheDocument()
  })

  it("processes a selected file and exposes extracted data", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const onClose = jest.fn()
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {})
    render(<LeaseExtractor onClose={onClose} />)

    const file = new File(["content"], "lease.pdf", { type: "application/pdf" })
    const fileInput = document.getElementById("lease-file-input") as HTMLInputElement
    await user.upload(fileInput, file)

    expect(screen.getByText(/processing/i)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(await screen.findByText(/extraction complete/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue("John Smith")).toBeInTheDocument()
    expect(screen.getByText(/import data/i)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /import data/i }))
    expect(onClose).toHaveBeenCalled()
    consoleLogSpy.mockRestore()
  })
})
