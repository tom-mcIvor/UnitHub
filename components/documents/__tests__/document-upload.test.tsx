import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DocumentUpload } from "../document-upload"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import { createDocument } from "@/app/actions/documents"

const refreshMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    refresh: refreshMock,
  })),
}))

jest.mock("@/lib/supabase/client", () => {
  const uploadMock = jest.fn()
  const getPublicUrlMock = jest.fn()
  const fromMock = jest.fn(() => ({
    upload: uploadMock,
    getPublicUrl: getPublicUrlMock,
  }))

  return {
    createClient: jest.fn(() => ({
      storage: {
        from: fromMock,
      },
    })),
    __uploadMock: uploadMock,
    __getPublicUrlMock: getPublicUrlMock,
    __fromMock: fromMock,
  }
})

jest.mock("@/app/actions/documents", () => ({
  ...(jest.requireActual("@/app/actions/documents") as object),
  createDocument: jest.fn(),
}))

const supabaseClientModule = jest.requireMock("@/lib/supabase/client") as {
  createClient: jest.Mock
  __uploadMock: jest.Mock
  __getPublicUrlMock: jest.Mock
  __fromMock: jest.Mock
}

const uploadMock = supabaseClientModule.__uploadMock
const getPublicUrlMock = supabaseClientModule.__getPublicUrlMock
const storageFromMock = supabaseClientModule.__fromMock

const mockTenants = [
  {
    id: "tenant-1",
    name: "John Doe",
    unitNumber: "101",
  },
]

const onClose = jest.fn()
const originalCrypto = globalThis.crypto
const mockRandomUUID = jest.fn(() => "mock-uuid")

describe("DocumentUpload", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: { randomUUID: mockRandomUUID },
    })
  })

afterAll(() => {
    if (originalCrypto) {
      Object.defineProperty(globalThis, "crypto", {
        value: originalCrypto,
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (globalThis as any).crypto
    }
  })

  beforeEach(() => {
    jest.useFakeTimers()
    onClose.mockReset()
    ;(createSupabaseClient as jest.Mock).mockClear()
    uploadMock.mockReset()
    getPublicUrlMock.mockReset()
    storageFromMock.mockReset()
    ;(createDocument as jest.Mock).mockReset()
    refreshMock.mockClear()
    mockRandomUUID.mockClear()

    uploadMock.mockResolvedValue({ error: null })
    getPublicUrlMock.mockReturnValue({ data: { publicUrl: "https://example.com/mock.pdf" } })
    storageFromMock.mockImplementation(() => ({
      upload: uploadMock,
      getPublicUrl: getPublicUrlMock,
    }))
    ;(createDocument as jest.Mock).mockResolvedValue({
      success: true,
      error: null,
      data: null,
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it("renders tenant options and cancel button", () => {
    render(<DocumentUpload onClose={onClose} tenants={mockTenants as any} />)

    expect(screen.getByText("Upload Document")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /property-level document/i })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /john doe \(unit 101\)/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
  })

  it("disables the upload button until a file is selected", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<DocumentUpload onClose={onClose} tenants={mockTenants as any} />)

    const uploadButton = screen.getByRole("button", { name: /^upload$/i })
    expect(uploadButton).toBeDisabled()

    const file = new File(["dummy"], "lease.pdf", { type: "application/pdf" })
    const fileInput = document.getElementById("document-upload-input") as HTMLInputElement
    await user.upload(fileInput, file)

    expect(uploadButton).not.toBeDisabled()
  })

  it("uploads a file and creates document metadata on success", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<DocumentUpload onClose={onClose} tenants={mockTenants as any} />)

    const selects = screen.getAllByRole("combobox")
    await user.selectOptions(selects[0], "tenant-1")
    await user.type(screen.getByPlaceholderText(/document title/i), "Signed Lease")

    const file = new File(["dummy"], "lease.pdf", { type: "application/pdf" })
    const fileInput = document.getElementById("document-upload-input") as HTMLInputElement
    await user.upload(fileInput, file)
    expect(screen.getByText(/lease\.pdf/i)).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /^upload$/i }))

    await waitFor(() => {
      expect(createSupabaseClient).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(storageFromMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(uploadMock).toHaveBeenCalledWith(
        expect.stringContaining("tenant-1/mock-uuid"),
        expect.any(File),
        expect.objectContaining({ upsert: false }),
      )
    })

    await waitFor(() => {
      expect(getPublicUrlMock).toHaveBeenCalledWith(expect.stringContaining("tenant-1/mock-uuid"))
      expect(createDocument).toHaveBeenCalledTimes(1)
    })

    const formDataEntries = Array.from((createDocument as jest.Mock).mock.calls[0][0].entries())
    expect(formDataEntries).toEqual(
      expect.arrayContaining([
        ["title", "Signed Lease"],
        ["type", "other"],
        ["tenantId", "tenant-1"],
        ["fileUrl", "https://example.com/mock.pdf"],
        ["storagePath", expect.stringContaining("tenant-1/mock-uuid")],
      ]),
    )

    expect(refreshMock).toHaveBeenCalled()
    expect(await screen.findByText(/document uploaded successfully/i)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it("handles upload failures gracefully", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    uploadMock.mockResolvedValueOnce({ error: { message: "Upload failed" } })
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    render(<DocumentUpload onClose={onClose} tenants={mockTenants as any} />)

    await user.type(screen.getByPlaceholderText(/document title/i), "Lease")
    const file = new File(["dummy"], "lease.pdf", { type: "application/pdf" })
    const fileInput = document.getElementById("document-upload-input") as HTMLInputElement
    await user.upload(fileInput, file)

    await user.click(screen.getByRole("button", { name: /^upload$/i }))

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument()
    })
    expect(createDocument).not.toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it("closes the modal when cancel is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<DocumentUpload onClose={onClose} tenants={mockTenants as any} />)

    await user.click(screen.getByRole("button", { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
