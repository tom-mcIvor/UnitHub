import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PaymentReminderGenerator } from "../payment-reminder-generator"

const fetchMock = jest.fn()
const originalFetch = global.fetch
const originalClipboard = (navigator as any).clipboard
let writeTextSpy: jest.SpyInstance<Promise<void>, [string]>

describe("PaymentReminderGenerator", () => {
  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterAll(() => {
    global.fetch = originalFetch
    if (originalClipboard) {
      Object.defineProperty(navigator, "clipboard", {
        value: originalClipboard,
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (navigator as any).clipboard
    }
  })

  beforeEach(() => {
    jest.useFakeTimers()
    fetchMock.mockReset()
    const clipboard = navigator.clipboard
    if (!clipboard) {
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: () => Promise.resolve(),
        },
        configurable: true,
      })
    }
    writeTextSpy = jest.spyOn(navigator.clipboard!, "writeText").mockResolvedValue(undefined)
  })

  afterEach(() => {
    writeTextSpy.mockRestore()
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it("triggers AI reminder generation and displays the response", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    fetchMock.mockResolvedValue({
      json: async () => ({
        success: true,
        message: "Sample reminder",
      }),
    } as Response)

    render(<PaymentReminderGenerator tenantName="John Doe" rentAmount={1200} daysOverdue={5} />)

    const generateButton = screen.getByRole("button", { name: /generate reminder/i })
    await user.click(generateButton)

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/generate-reminder",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: "John Doe",
          rentAmount: 1200,
          daysOverdue: 5,
        }),
      }),
    )

    await waitFor(() => {
      expect(screen.getByText(/sample reminder/i)).toBeInTheDocument()
    })
  })

  it("copies the generated reminder to the clipboard", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    fetchMock.mockResolvedValue({
      json: async () => ({
        success: true,
        message: "Reminder text",
      }),
    } as Response)

    render(<PaymentReminderGenerator tenantName="John Doe" rentAmount={1200} daysOverdue={5} />)

    await user.click(screen.getByRole("button", { name: /generate reminder/i }))

    await waitFor(() => {
      expect(screen.getByText("Reminder text")).toBeInTheDocument()
    })

    const copyButton = screen.getByRole("button", { name: /copy/i })
    await user.click(copyButton)

    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith("Reminder text")
    })
    expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument()
  })
})
