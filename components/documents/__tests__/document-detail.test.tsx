import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DocumentDetail } from "../document-detail"
import type { DocumentWithTenant } from "@/app/actions/documents"

const mockDocumentForm = jest.fn(() => <div data-testid="document-form-modal">Document Form</div>)

jest.mock("../document-form", () => ({
  DocumentForm: (props: any) => mockDocumentForm(props),
}))

const tenants = [
  { id: "tenant-1", name: "John Doe", unitNumber: "101" },
] as any

const baseDocument: DocumentWithTenant = {
  id: "doc-1",
  tenantId: "tenant-1",
  tenantName: "John Doe",
  unitNumber: "101",
  title: "Lease Agreement",
  type: "lease",
  fileUrl: "https://example.com/lease.pdf",
  storagePath: "tenant-1/lease.pdf",
  uploadedAt: "2024-01-01T12:30:00.000Z",
  extractedData: {
    rent_amount: "$1,200",
    deposit_amount: "$1,200",
  },
}

describe("DocumentDetail", () => {
  beforeEach(() => {
    mockDocumentForm.mockClear()
  })

  it("renders document information and download link", () => {
    render(<DocumentDetail document={baseDocument} tenants={tenants} />)

    expect(screen.getByRole("heading", { name: "Lease Agreement" })).toBeInTheDocument()
    expect(screen.getByText(/uploaded jan/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /download/i })).toHaveAttribute(
      "href",
      `/api/documents/${baseDocument.id}/download`,
    )
    expect(screen.getByText("John Doe")).toBeInTheDocument()
  })

  it("shows extracted data entries when available", () => {
    render(<DocumentDetail document={baseDocument} tenants={tenants} />)

    expect(screen.getByText(/rent amount/i)).toBeInTheDocument()
    const monetaryValues = screen.getAllByText("$1,200")
    expect(monetaryValues).toHaveLength(2)
  })

  it("omits download button when no file is available", () => {
    render(
      <DocumentDetail
        document={{
          ...baseDocument,
          storagePath: undefined,
          fileUrl: "",
        }}
        tenants={tenants}
      />,
    )

    expect(screen.queryByRole("link", { name: /download/i })).not.toBeInTheDocument()
  })

  it("opens edit modal when edit button is clicked", async () => {
    const user = userEvent.setup()
    render(<DocumentDetail document={baseDocument} tenants={tenants} />)

    await user.click(screen.getByRole("button", { name: /edit/i }))

    expect(screen.getByTestId("document-form-modal")).toBeInTheDocument()
    expect(mockDocumentForm).toHaveBeenCalledWith(
      expect.objectContaining({
        editingDocument: baseDocument,
        tenants,
      }),
    )
  })
})
