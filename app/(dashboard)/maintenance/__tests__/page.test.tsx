
import { render, screen } from "@testing-library/react";
import MaintenanceRoute from "../page";
import { getMaintenanceRequests } from "@/app/actions/maintenance";
import { getTenants } from "@/app/actions/tenants";
import { MaintenanceRequest, Tenant } from "@/lib/types";

jest.mock("@/app/actions/maintenance", () => ({
  getMaintenanceRequests: jest.fn(),
}));

jest.mock("@/app/actions/tenants", () => ({
  getTenants: jest.fn(),
}));

jest.mock("@/components/maintenance/maintenance-page", () => ({
  MaintenancePage: ({ initialRequests, tenants, error }: { initialRequests: MaintenanceRequest[], tenants: Tenant[], error: string | null }) => (
    <div data-testid="maintenance-page">
      <h2>Maintenance</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {initialRequests.map((request) => (
          <li key={request.id}>{request.title}</li>
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

describe("MaintenanceRoute", () => {
  const mockTenants = [
    { id: "1", name: "John Doe", email: "john@example.com", unit_number: "101" },
    { id: "2", name: "Jane Doe", email: "jane@example.com", unit_number: "102" },
  ] as Tenant[];

  const mockRequests = [
    { id: "1", tenant_id: "1", title: "Leaky faucet", description: "", category: "plumbing", priority: "high", status: "open" },
    { id: "2", tenant_id: "2", title: "Broken window", description: "", category: "windows", priority: "medium", status: "in_progress" },
  ] as MaintenanceRequest[];

  beforeEach(() => {
    (getTenants as jest.Mock).mockResolvedValue({ data: mockTenants, error: null });
  });

  it("should render maintenance page with requests and tenants", async () => {
    (getMaintenanceRequests as jest.Mock).mockResolvedValue({ data: mockRequests, error: null });

    const Page = await MaintenanceRoute();
    render(Page);

    expect(screen.getByTestId("maintenance-page")).toBeInTheDocument();
    expect(screen.getByText("Leaky faucet")).toBeInTheDocument();
    expect(screen.getByText("Broken window")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should display error message when maintenance requests fetch fails", async () => {
    const errorMessage = "Failed to fetch maintenance requests";
    (getMaintenanceRequests as jest.Mock).mockResolvedValue({ data: null, error: errorMessage });

    const Page = await MaintenanceRoute();
    render(Page);

    expect(screen.getByTestId("maintenance-page")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render with no requests if fetch returns empty array", async () => {
    (getMaintenanceRequests as jest.Mock).mockResolvedValue({ data: [], error: null });

    const Page = await MaintenanceRoute();
    render(Page);

    expect(screen.getByTestId("maintenance-page")).toBeInTheDocument();
    expect(screen.queryByText("Leaky faucet")).not.toBeInTheDocument();
  });
});
