import { render, screen, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DocumentsPage } from "../documents-page"
import type { DocumentWithTenant } from "@/app/actions/documents"
import type { Tenant } from "@/lib/types"
import { deleteDocument } from "@/app/actions/documents"

const mockRefresh = jest.fn()
const mockDocumentUpload = jest.fn(() => <div data-testid="document-upload-modal">Upload Modal</div>)
const mockLeaseExtractor = jest.fn(() => <div data-testid="lease-extractor-modal">Lease Modal</div>)
const mockDocumentForm = jest.fn(() => <div data-testid="document-form-modal">Form Modal</div>)

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}))

jest.mock("@/app/actions/documents", () => ({
  ...(jest.requireActual("@/app/actions/documents") as object),
  deleteDocument: jest.fn(),
}))

jest.mock("../document-upload", () => ({
  DocumentUpload: (props: any) => mockDocumentUpload(props),
}))

jest.mock("../lease-extractor", () => ({
  LeaseExtractor: (props: any) => mockLeaseExtractor(props),
}))

jest.mock("../document-form", () => ({
  DocumentForm: (props: any) => mockDocumentForm(props),
}))

const tenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    unitNumber: "101",
    leaseStartDate: "",
    leaseEndDate: "",
    rentAmount: 0,
    depositAmount: 0,
    petPolicy: null,
    notes: null,
    status: "active",
  },
]

const baseDocuments: DocumentWithTenant[] = [
  {
    id: "doc-1",
    tenantId: "tenant-1",
    tenantName: "John Doe",
    unitNumber: "101",
    title: "Lease Agreement",
    type: "lease",
    fileUrl: "https://example.com/lease.pdf",
    storagePath: "tenant-1/lease.pdf",
    uploadedAt: "2024-01-01T00:00:00.000Z",
    extractedData: {
      rentAmount: 1200,
    },
  },
  {
    id: "doc-2",
    tenantId: null,
    tenantName: null,
    unitNumber: null,
    title: "Inspection Photos",
    type: "photo",
    fileUrl: "https://example.com/photo.jpg",
    storagePath: null,
    uploadedAt: "2024-02-01T00:00:00.000Z",
    extractedData: undefined,
  },
  {
    id: "doc-3",
    tenantId: null,
    tenantName: null,
    unitNumber: null,
    title: "Move-in Checklist",
    type: "inspection",
    fileUrl: "https://example.com/checklist.pdf",
    storagePath: null,
    uploadedAt: "2024-03-01T00:00:00.000Z",
    extractedData: undefined,
  },
]

describe("DocumentsPage", () => {
  beforeEach(() => {
    mockRefresh.mockClear()
    mockDocumentUpload.mockClear()
    mockLeaseExtractor.mockClear()
    mockDocumentForm.mockClear()
    ;(deleteDocument as jest.Mock).mockReset()
  })

  it("renders documents overview and stats", () => {
    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    expect(screen.getByRole("heading", { name: /documents/i })).toBeInTheDocument()
    expect(screen.getByText("Store and manage tenant documents")).toBeInTheDocument()

    expect(screen.getByText("Total Documents")).toBeInTheDocument()
    expect(screen.getByText(baseDocuments.length.toString())).toBeInTheDocument()
    expect(screen.getByText("Leases")).toBeInTheDocument()
    expect(screen.getByText("Inspections")).toBeInTheDocument()
    expect(screen.getByText("Photos")).toBeInTheDocument()

    expect(screen.getByText("Lease Agreement")).toBeInTheDocument()
    expect(screen.getByText("Inspection Photos")).toBeInTheDocument()
  })

  it("filters documents by type and search term", async () => {
    const user = userEvent.setup()
    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    await user.click(screen.getByRole("button", { name: "Inspection" }))
    expect(screen.getByText("Move-in Checklist")).toBeInTheDocument()
    expect(screen.queryByText("Lease Agreement")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "All" }))
    await user.clear(screen.getByPlaceholderText(/search by title or tenant/i))
    await user.type(screen.getByPlaceholderText(/search by title or tenant/i), "lease")
    expect(screen.getByText("Lease Agreement")).toBeInTheDocument()
    expect(screen.queryByText("Move-in Checklist")).not.toBeInTheDocument()
  })

  it("opens the upload and lease extractor modals when triggered", async () => {
    const user = userEvent.setup()
    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    expect(screen.queryByTestId("document-upload-modal")).not.toBeInTheDocument()
    expect(screen.queryByTestId("lease-extractor-modal")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /upload document/i }))
    expect(screen.getByTestId("document-upload-modal")).toBeInTheDocument()
    expect(mockDocumentUpload).toHaveBeenCalledWith(expect.objectContaining({ tenants }))

    await user.click(screen.getByRole("button", { name: /extract lease/i }))
    expect(screen.getByTestId("lease-extractor-modal")).toBeInTheDocument()
    expect(mockLeaseExtractor).toHaveBeenCalled()
  })

  it("opens the edit modal for a selected document", async () => {
    const user = userEvent.setup()
    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    const leaseCard = screen.getByText("Lease Agreement").closest("div")
    expect(leaseCard).not.toBeNull()

    const editButton = within(leaseCard as HTMLElement).getByRole("button", {
      name: /edit document lease agreement/i,
    })
    await user.click(editButton)

    expect(screen.getByTestId("document-form-modal")).toBeInTheDocument()
    expect(mockDocumentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        editingDocument: expect.objectContaining({ id: "doc-1" }),
        tenants,
      }),
    )
  })

  it("confirms and deletes a document successfully", async () => {
    const user = userEvent.setup()
    ;(deleteDocument as jest.Mock).mockResolvedValue({ success: true, error: null })

    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    const leaseCard = screen.getByText("Lease Agreement").closest("div")
    expect(leaseCard).not.toBeNull()

    await user.click(
      within(leaseCard as HTMLElement).getByRole("button", { name: /delete document lease agreement/i }),
    )

    expect(screen.getByRole("heading", { name: /delete document/i })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /^delete$/i }))

    await waitFor(() => {
      expect(deleteDocument).toHaveBeenCalledWith("doc-1")
    })
    expect(mockRefresh).toHaveBeenCalled()
  })

  it("shows an error card when an error is provided", () => {
    render(<DocumentsPage initialDocuments={[]} tenants={tenants} error="Failed to load" />)

    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it("shows empty state when filters remove all documents", async () => {
    const user = userEvent.setup()
    render(<DocumentsPage initialDocuments={baseDocuments} tenants={tenants} error={null} />)

    await user.type(screen.getByPlaceholderText(/search by title or tenant/i), "no match")
    expect(screen.getByText(/no documents found/i)).toBeInTheDocument()
  })
})
