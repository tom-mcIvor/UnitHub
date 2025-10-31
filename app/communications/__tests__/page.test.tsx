
import { render, screen } from "@testing-library/react";
import CommunicationsRoute from "../page";
import { getCommunicationLogs } from "@/app/actions/communications";
import { getTenants } from "@/app/actions/tenants";
import { CommunicationLog, Tenant } from "@/lib/types";

jest.mock("@/app/actions/communications", () => ({
  getCommunicationLogs: jest.fn(),
}));

jest.mock("@/app/actions/tenants", () => ({
  getTenants: jest.fn(),
}));

jest.mock("@/components/communications/communications-page", () => ({
  CommunicationsPage: ({ initialCommunications, tenants, error }: { initialCommunications: CommunicationLog[], tenants: Tenant[], error: string | null }) => (
    <div data-testid="communications-page">
      <h2>Communications</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {initialCommunications.map((comm) => (
          <li key={comm.id}>{comm.subject}</li>
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

describe("CommunicationsRoute", () => {
  const mockTenants = [
    { id: "1", name: "John Doe", email: "john@example.com", unit_number: "101" },
    { id: "2", name: "Jane Doe", email: "jane@example.com", unit_number: "102" },
  ] as Tenant[];

  const mockCommunications = [
    { id: "1", tenant_id: "1", subject: "Rent Reminder", content: "", type: "email" },
    { id: "2", tenant_id: "2", subject: "Maintenance Update", content: "", type: "sms" },
  ] as CommunicationLog[];

  beforeEach(() => {
    (getTenants as jest.Mock).mockResolvedValue({ data: mockTenants, error: null });
  });

  it("should render communications page with logs and tenants", async () => {
    (getCommunicationLogs as jest.Mock).mockResolvedValue({ data: mockCommunications, error: null });

    const Page = await CommunicationsRoute();
    render(Page);

    expect(screen.getByTestId("communications-page")).toBeInTheDocument();
    expect(screen.getByText("Rent Reminder")).toBeInTheDocument();
    expect(screen.getByText("Maintenance Update")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should display error message when communication logs fetch fails", async () => {
    const errorMessage = "Failed to fetch communication logs";
    (getCommunicationLogs as jest.Mock).mockResolvedValue({ data: null, error: errorMessage });

    const Page = await CommunicationsRoute();
    render(Page);

    expect(screen.getByTestId("communications-page")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render with no logs if fetch returns empty array", async () => {
    (getCommunicationLogs as jest.Mock).mockResolvedValue({ data: [], error: null });

    const Page = await CommunicationsRoute();
    render(Page);

    expect(screen.getByTestId("communications-page")).toBeInTheDocument();
    expect(screen.queryByText("Rent Reminder")).not.toBeInTheDocument();
  });
});
