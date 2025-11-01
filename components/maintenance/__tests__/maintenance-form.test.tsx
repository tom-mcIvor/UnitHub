


import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MaintenanceForm } from "../maintenance-form";
import { toast } from "sonner";

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock('@/app/actions/maintenance', () => ({
  createMaintenanceRequest: jest.fn().mockResolvedValue({ success: true }),
  updateMaintenanceRequest: jest.fn(),
}));
import { Tenant } from "@/lib/types";

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockTenants: Tenant[] = [
  { id: "1", name: "John Doe", email: "jhon@doe.com", unit_number: "101" },
  { id: "2", name: "Jane Doe", email: "jane@doe.com", unit_number: "102" },
];

describe("MaintenanceForm", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form in create mode", () => {
    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);

    expect(screen.getByText("New Maintenance Request")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Request" })).toBeInTheDocument();
  });

  it("renders the form in edit mode", () => {
    const editingRequest = { id: "1", title: "Leaky Faucet" } as any;
    render(
      <MaintenanceForm
        onClose={onClose}
        tenants={mockTenants}
        editingRequest={editingRequest}
      />
    );

    expect(screen.getByText("Edit Maintenance Request")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Request" })).toBeInTheDocument();
  });

  it("displays validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);

    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(await screen.findByText("Tenant is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
  });

  it("submits the form with valid data for creating a request", async () => {
    const user = userEvent.setup();
    const createMaintenanceRequest = jest.fn().mockResolvedValue({ success: true });

    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);

    await user.selectOptions(screen.getByLabelText("Tenant *"), "1");
    await user.selectOptions(screen.getByLabelText("Category *"), "Plumbing");
    await user.selectOptions(screen.getByLabelText("Priority *"), "medium");
    await user.type(screen.getByLabelText("Title *"), "Leaky faucet");
    await user.type(screen.getByLabelText("Description *"), "The kitchen sink is leaking.");

    const submitButton = screen.getByRole("button", { name: "Create Request" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Maintenance request created successfully!");
    });
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
