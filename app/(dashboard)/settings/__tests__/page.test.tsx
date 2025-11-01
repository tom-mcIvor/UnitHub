
import { render, screen } from "@testing-library/react";
import SettingsRoute from "../page";

jest.mock("@/components/settings/settings-page", () => ({
  SettingsPage: () => <div data-testid="settings-page">Settings Page</div>,
}));

describe("SettingsRoute", () => {
  it("should render the settings page", () => {
    render(<SettingsRoute />);

    expect(screen.getByTestId("settings-page")).toBeInTheDocument();
    expect(screen.getByText("Settings Page")).toBeInTheDocument();
  });
});
