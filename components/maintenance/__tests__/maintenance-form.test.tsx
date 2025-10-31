
jest.mock('@/app/actions/maintenance', () => ({
  createMaintenanceRequest: jest.fn(),
  updateMaintenanceRequest: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MaintenanceForm } from "../maintenance-form";
import { createMaintenanceRequest, updateMaintenanceRequest } from "@/app/actions/maintenance";
import { Tenant } from "@/lib/types";





const mockTenants: Tenant[] = [
  { id: "1", name: "John Doe", email: "jhon@doe.com", unit_number: "101" },
  { id: "2", name: "Jane Doe", email: "jane@doe.com", unit_number: "102" },
];

describe("MaintenanceForm", () => {
  const onClose = jest.fn();

  afterEach(() => {
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
    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Create Request" }));

    expect(await screen.findByText("Tenant is required")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
  });

  it("submits the form with valid data for creating a request", async () => {
    const createMaintenanceRequestSpy = jest.spyOn(require('@/app/actions/maintenance'), 'createMaintenanceRequest');
    createMaintenanceRequestSpy.mockResolvedValue({ success: true });

    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText("Tenant *"), "1");
    await user.selectOptions(screen.getByLabelText("Category *"), "Plumbing");
    await user.type(screen.getByLabelText("Title *"), "Leaky faucet");
    await act(async () => {
      fireEvent.submit(screen.getByTestId('maintenance-form'))
    });

            await waitFor(() => expect(createMaintenanceRequest).toHaveBeenCalledTimes(1));

            expect(await screen.findByText("Maintenance request created successfully!")).toBeInTheDocument();
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(<MaintenanceForm onClose={onClose} tenants={mockTenants} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
