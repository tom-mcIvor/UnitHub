import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CommunicationForm } from "../communication-form"
import { createCommunicationLog, updateCommunicationLog } from "@/app/actions/communications"
import { toast } from "sonner"

const refreshMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}))

jest.mock("@/app/actions/communications", () => ({
  ...(jest.requireActual("@/app/actions/communications") as object),
  createCommunicationLog: jest.fn(),
  updateCommunicationLog: jest.fn(),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockTenants = [
  { id: "tenant-1", name: "John Doe", unitNumber: "101" },
  { id: "tenant-2", name: "Jane Smith", unitNumber: "202" },
] as any

const baseFormDataEntries = (fd: FormData) => Array.from(fd.entries())

describe("CommunicationForm", () => {
  const onClose = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    refreshMock.mockClear()
    onClose.mockReset()
    ;(createCommunicationLog as jest.Mock).mockReset()
    ;(updateCommunicationLog as jest.Mock).mockReset()
    ;(createCommunicationLog as jest.Mock).mockResolvedValue({ success: true, error: null })
    ;(updateCommunicationLog as jest.Mock).mockResolvedValue({ success: true, error: null })
    jest.clearAllMocks()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it("renders required fields and defaults", () => {
    render(<CommunicationForm onClose={onClose} tenants={mockTenants} />)

    expect(screen.getByText("Tenant *")).toBeInTheDocument()
    expect(screen.getByText("Communication Type *")).toBeInTheDocument()
    expect(screen.getByText("Subject *")).toBeInTheDocument()
    expect(screen.getByText("Details *")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Select a tenant" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /john doe/i })).toBeInTheDocument()
  })

  it("shows validation messages when required fields are missing", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<CommunicationForm onClose={onClose} tenants={mockTenants} />)

    await user.click(screen.getByRole("button", { name: /log communication/i }))

    expect(await screen.findAllByText(/is required/i)).not.toHaveLength(0)
    expect(createCommunicationLog).not.toHaveBeenCalled()
  })

  it("submits a new communication successfully", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<CommunicationForm onClose={onClose} tenants={mockTenants} />)

    const [tenantSelect, typeSelect] = screen.getAllByRole("combobox")
    await user.selectOptions(tenantSelect, "tenant-1")
    await user.selectOptions(typeSelect, "phone")
    await user.type(screen.getByPlaceholderText("Communication subject"), "Follow up")
    await user.type(screen.getByPlaceholderText("Describe the communication..."), "Called tenant about maintenance.")

    await user.click(screen.getByRole("button", { name: /log communication/i }))

    await waitFor(() => {
      expect(createCommunicationLog).toHaveBeenCalledTimes(1)
    })

    const formEntries = baseFormDataEntries((createCommunicationLog as jest.Mock).mock.calls[0][0])
    expect(formEntries).toEqual(
      expect.arrayContaining([
        ["tenantId", "tenant-1"],
        ["type", "phone"],
        ["subject", "Follow up"],
        ["content", "Called tenant about maintenance."],
      ]),
    )

    expect(refreshMock).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalledWith("Communication logged successfully!")

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("submits an edit when editingLog is provided", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(
      <CommunicationForm
        onClose={onClose}
        tenants={mockTenants}
        editingLog={{
          id: "log-1",
          tenantId: "tenant-2",
          type: "email",
          subject: "Lease renewal",
          content: "Sent lease renewal.",
          communicatedAt: "2024-01-01T00:00:00Z",
          createdAt: "2024-01-01T00:00:00Z",
          tenantName: "Jane Smith",
          unitNumber: "202",
        }}
        initialData={{
          tenantId: "tenant-2",
          type: "email",
          subject: "Lease renewal",
          content: "Sent lease renewal.",
        }}
      />,
    )

    expect(screen.getByDisplayValue("Lease renewal")).toBeInTheDocument()

    await user.clear(screen.getByPlaceholderText("Communication subject"))
    await user.type(screen.getByPlaceholderText("Communication subject"), "Lease renewal update")
    await user.click(screen.getByRole("button", { name: /update communication/i }))

    await waitFor(() => {
      expect(updateCommunicationLog).toHaveBeenCalledWith(
        "log-1",
        expect.any(FormData),
      )
    })

    const updateEntries = baseFormDataEntries((updateCommunicationLog as jest.Mock).mock.calls[0][1])
    expect(updateEntries).toEqual(
      expect.arrayContaining([
        ["tenantId", "tenant-2"],
        ["type", "email"],
        ["subject", "Lease renewal update"],
        ["content", "Sent lease renewal."],
      ]),
    )
    expect(toast.success).toHaveBeenCalledWith("Communication updated successfully!")
  })

  it("shows backend error when server action fails", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(createCommunicationLog as jest.Mock).mockResolvedValue({
      success: false,
      error: "Failed to log communication",
    })

    render(<CommunicationForm onClose={onClose} tenants={mockTenants} />)

    const [tenantSelect] = screen.getAllByRole("combobox")
    await user.selectOptions(tenantSelect, "tenant-1")
    await user.type(screen.getByPlaceholderText("Communication subject"), "Follow up")
    await user.type(screen.getByPlaceholderText("Describe the communication..."), "Called tenant.")
    await user.click(screen.getByRole("button", { name: /log communication/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to log communication")
    })

    expect(onClose).not.toHaveBeenCalled()
  })
})
