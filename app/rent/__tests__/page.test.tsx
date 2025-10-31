
import { render, screen } from "@testing-library/react";
import RentPage from "../page";
import { getRentPayments } from "@/app/actions/rent";
import { getTenants } from "@/app/actions/tenants";
import { RentPayment, Tenant } from "@/lib/types";

jest.mock("@/app/actions/rent", () => ({
  getRentPayments: jest.fn(),
}));

jest.mock("@/app/actions/tenants", () => ({
  getTenants: jest.fn(),
}));

jest.mock("@/components/rent/rent-tracking-page", () => ({
  RentTrackingPage: ({ initialPayments, tenants, error }: { initialPayments: RentPayment[], tenants: Tenant[], error: string | null }) => (
    <div data-testid="rent-tracking-page">
      <h2>Rent Tracking</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {initialPayments.map((payment) => (
          <li key={payment.id}>Amount: {payment.amount}</li>
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

describe("RentPage", () => {
  const mockTenants = [
    { id: "1", name: "John Doe", email: "john@example.com", unit_number: "101" },
    { id: "2", name: "Jane Doe", email: "jane@example.com", unit_number: "102" },
  ] as Tenant[];

  const mockPayments = [
    { id: "1", tenant_id: "1", amount: 1200, date: new Date(), status: "paid" },
    { id: "2", tenant_id: "2", amount: 1500, date: new Date(), status: "pending" },
  ] as RentPayment[];

  beforeEach(() => {
    (getTenants as jest.Mock).mockResolvedValue({ data: mockTenants, error: null });
  });

  it("should render rent tracking page with payments and tenants", async () => {
    (getRentPayments as jest.Mock).mockResolvedValue({ data: mockPayments, error: null });

    const Page = await RentPage();
    render(Page);

    expect(screen.getByTestId("rent-tracking-page")).toBeInTheDocument();
    expect(screen.getByText("Amount: 1200")).toBeInTheDocument();
    expect(screen.getByText("Amount: 1500")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should display error message when rent payments fetch fails", async () => {
    const errorMessage = "Failed to fetch rent payments";
    (getRentPayments as jest.Mock).mockResolvedValue({ data: null, error: errorMessage });

    const Page = await RentPage();
    render(Page);

    expect(screen.getByTestId("rent-tracking-page")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("should render with no payments if fetch returns empty array", async () => {
    (getRentPayments as jest.Mock).mockResolvedValue({ data: [], error: null });

    const Page = await RentPage();
    render(Page);

    expect(screen.getByTestId("rent-tracking-page")).toBeInTheDocument();
    expect(screen.queryByText(/Amount:/)).not.toBeInTheDocument();
  });

  it("should render with no tenants if fetch returns empty array", async () => {
    (getTenants as jest.Mock).mockResolvedValue({ data: [], error: null });
    (getRentPayments as jest.Mock).mockResolvedValue({ data: mockPayments, error: null });

    const Page = await RentPage();
    render(Page);

    expect(screen.getByTestId("rent-tracking-page")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
});
