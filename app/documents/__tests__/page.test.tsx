
import { render, screen } from "@testing-library/react";
import DocumentsRoute from "../page";
import { getDocuments } from "@/app/actions/documents";
import { getTenants } from "@/app/actions/tenants";
import { Document, Tenant } from "@/lib/types";

jest.mock("@/app/actions/documents", () => ({
  getDocuments: jest.fn(),
}));

jest.mock("@/app/actions/tenants", () => ({
  getTenants: jest.fn(),
}));

jest.mock("@/components/documents/documents-page", () => ({
  DocumentsPage: ({ initialDocuments, tenants, error }: { initialDocuments: Document[], tenants: Tenant[], error: string | null }) => (
    <div data-testid="documents-page">
      <h2>Documents</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {initialDocuments.map((doc) => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
      <h3>Tenants</h3>
      <ul>
        {tenants.map((tenant) => (
          <li key={tenant.id}>{tenant.name}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe("DocumentsRoute", () => {
  const mockTenants = [
    { id: "1", name: "John Doe", email: "john@example.com", unit_number: "101" },
    { id: "2", name: "Jane Doe", email: "jane@example.com", unit_number: "102" },
  ] as Tenant[];

  const mockDocuments = [
    { id: "1", tenant_id: "1", title: "Lease Agreement", type: "lease", file_url: "" },
    { id: "2", tenant_id: "2", title: "Inspection Report", type: "inspection", file_url: "" },
  ] as Document[];

  beforeEach(() => {
    (getTenants as jest.Mock).mockResolvedValue({ data: mockTenants, error: null });
  });

  it("should render documents page with documents and tenants", async () => {
    (getDocuments as jest.Mock).mockResolvedValue({ data: mockDocuments, error: null });

    const Page = await DocumentsRoute();
    render(Page);

    expect(screen.getByTestId("documents-page")).toBeInTheDocument();
    expect(screen.getByText("Lease Agreement")).toBeInTheDocument();
    expect(screen.getByText("Inspection Report")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should display error message when documents fetch fails", async () => {
    const errorMessage = "Failed to fetch documents";
    (getDocuments as jest.Mock).mockResolvedValue({ data: null, error: errorMessage });

    const Page = await DocumentsRoute();
    render(Page);

    expect(screen.getByTestId("documents-page")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render with no documents if fetch returns empty array", async () => {
    (getDocuments as jest.Mock).mockResolvedValue({ data: [], error: null });

    const Page = await DocumentsRoute();
    render(Page);

    expect(screen.getByTestId("documents-page")).toBeInTheDocument();
    expect(screen.queryByText("Lease Agreement")).not.toBeInTheDocument();
  });
});
