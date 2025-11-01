
import { render, screen } from "@testing-library/react";
import TenantsPage from "../page";
import { getTenants } from "@/app/actions/tenants";
import { Tenant } from "@/lib/types";

jest.mock("@/app/actions/tenants", () => ({
  getTenants: jest.fn(),
}));

jest.mock("@/components/tenants/tenants-list", () => ({
  TenantsList: ({ initialTenants, error }: { initialTenants: Tenant[], error: string | null }) => (
    <div data-testid="tenants-list">
      <h2>Tenants List</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {initialTenants.map((tenant) => (
          <li key={tenant.id}>{tenant.name}</li>
        ))}
      </ul>
    </div>
  ),
}));

describe("TenantsPage", () => {
  it("should render tenants list when data is fetched successfully", async () => {
    const mockTenants = [
      { id: "1", name: "John Doe", email: "john@example.com", unit_number: "101" },
      { id: "2", name: "Jane Doe", email: "jane@example.com", unit_number: "102" },
    ] as Tenant[];
    (getTenants as jest.Mock).mockResolvedValue({ data: mockTenants, error: null });

    const Page = await TenantsPage();
    render(Page);

    expect(screen.getByTestId("tenants-list")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should display error message when fetch fails", async () => {
    const errorMessage = "Failed to fetch tenants";
    (getTenants as jest.Mock).mockResolvedValue({ data: null, error: errorMessage });

    const Page = await TenantsPage();
    render(Page);

    expect(screen.getByTestId("tenants-list")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render an empty list when there are no tenants", async () => {
    (getTenants as jest.Mock).mockResolvedValue({ data: [], error: null });

    const Page = await TenantsPage();
    render(Page);

    expect(screen.getByTestId("tenants-list")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
