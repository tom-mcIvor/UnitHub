import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DocumentForm } from "../document-form"
import { createDocument, updateDocument } from "@/app/actions/documents"
import { toast } from "sonner"

const refreshMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    refresh: refreshMock,
  })),
}))

jest.mock("@/app/actions/documents", () => ({
  ...(jest.requireActual("@/app/actions/documents") as object),
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const tenants = [
  {
    id: "tenant-1",
    name: "John Doe",
    unitNumber: "101",
  },
]

const onClose = jest.fn()

describe("DocumentForm", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    onClose.mockReset()
    refreshMock.mockClear()
    ;(createDocument as jest.Mock).mockReset()
    ;(updateDocument as jest.Mock).mockReset()
    ;(createDocument as jest.Mock).mockResolvedValue({ success: true, error: null, data: null })
    ;(updateDocument as jest.Mock).mockResolvedValue({ success: true, error: null, data: null })
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("shows validation errors when required fields are missing", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<DocumentForm onClose={onClose} tenants={tenants as any} />)

    await user.click(screen.getByRole("button", { name: /save document/i }))

    expect(await screen.findAllByText(/is required/i)).not.toHaveLength(0)
    expect(createDocument).not.toHaveBeenCalled()
  })

  it("creates a new document when form is submitted successfully", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(createDocument as jest.Mock).mockResolvedValue({ success: true, error: null, data: null })

    render(<DocumentForm onClose={onClose} tenants={tenants as any} />)

    const selects = screen.getAllByRole("combobox")
    await user.selectOptions(selects[0], "tenant-1")
    await user.clear(screen.getByPlaceholderText(/document title/i))
    await user.type(screen.getByPlaceholderText(/document title/i), "Signed Lease")
    await user.selectOptions(selects[1], "lease")
    const fileUrlInput = screen.getByPlaceholderText("https://...")
    await user.clear(fileUrlInput)
    await user.type(fileUrlInput, "https://example.com/lease.pdf")

    await user.click(screen.getByRole("button", { name: /save document/i }))

    await waitFor(() => {
      expect(createDocument).toHaveBeenCalledTimes(1)
    })

    const formDataEntries = Array.from((createDocument as jest.Mock).mock.calls[0][0].entries())
    expect(formDataEntries).toEqual(
      expect.arrayContaining([
        ["tenantId", "tenant-1"],
        ["title", "Signed Lease"],
        ["type", "lease"],
        ["fileUrl", "https://example.com/lease.pdf"],
      ]),
    )

    expect(toast.success).toHaveBeenCalledWith("Document saved successfully!")
    expect(refreshMock).toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("updates an existing document when editing", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(updateDocument as jest.Mock).mockResolvedValue({ success: true, error: null, data: null })

    render(
      <DocumentForm
        onClose={onClose}
        tenants={tenants as any}
        editingDocument={{
          id: "doc-1",
          tenantId: "tenant-1",
          tenantName: "John Doe",
          unitNumber: "101",
          title: "Lease",
          type: "lease",
          fileUrl: "https://example.com/lease.pdf",
          storagePath: "tenant-1/old.pdf",
          uploadedAt: "2024-01-01T00:00:00.000Z",
          extractedData: null,
        }}
      />,
    )

    await user.clear(screen.getByPlaceholderText(/document title/i))
    await user.type(screen.getByPlaceholderText(/document title/i), "Updated Lease")
    await user.click(screen.getByRole("button", { name: /update document/i }))

    await waitFor(() => {
      expect(updateDocument).toHaveBeenCalledWith(
        "doc-1",
        expect.any(FormData),
      )
    })

    expect(toast.success).toHaveBeenCalledWith("Document updated successfully!")
    expect(refreshMock).toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("shows backend error message when submission fails", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    ;(createDocument as jest.Mock).mockResolvedValue({
      success: false,
      error: "Failed to save document",
      data: null,
    })

    render(<DocumentForm onClose={onClose} tenants={tenants as any} />)

    await user.type(screen.getByPlaceholderText(/document title/i), "Lease")
    await user.selectOptions(screen.getAllByRole("combobox")[1], "lease")
    await user.type(screen.getByPlaceholderText("https://..."), "https://example.com/lease.pdf")

    await user.click(screen.getByRole("button", { name: /save document/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to save document")
    })
  })
})
