import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SpeedCalculatorForm } from "./SpeedCalculatorForm";

describe("SpeedCalculatorForm", () => {
  it("shows field errors for empty and non-positive values and hides result", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    const distanceInput = screen.getByLabelText(/distance/i);
    const speedLimitInput = screen.getByLabelText(/speed limit/i);
    const extraSpeedInput = screen.getByLabelText(/extra speed/i);

    await user.click(distanceInput);
    await user.tab();

    await user.click(speedLimitInput);
    await user.type(speedLimitInput, "0");
    await user.tab();

    await user.type(extraSpeedInput, "-5");
    await user.tab();

    expect(screen.queryByText(/minutes saved:/i)).not.toBeInTheDocument();

    expect(screen.getByText("Distance is required.")).toHaveAttribute(
      "id",
      "distance-error",
    );
    expect(distanceInput).toHaveAttribute("aria-invalid", "true");
    expect(distanceInput).toHaveAttribute("aria-describedby", "distance-error");

    expect(screen.getByText("Speed limit must be a positive number.")).toHaveAttribute(
      "id",
      "speedLimit-error",
    );
    expect(speedLimitInput).toHaveAttribute("aria-invalid", "true");
    expect(speedLimitInput).toHaveAttribute("aria-describedby", "speedLimit-error");

    expect(screen.getByText("Extra speed must be a positive number.")).toHaveAttribute(
      "id",
      "extraSpeed-error",
    );
    expect(extraSpeedInput).toHaveAttribute("aria-invalid", "true");
    expect(extraSpeedInput).toHaveAttribute("aria-describedby", "extraSpeed-error");

    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });

  it("shows a deterministic formatted minutes saved value for valid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/distance/i), "30");
    await user.type(screen.getByLabelText(/speed limit/i), "60");
    await user.type(screen.getByLabelText(/extra speed/i), "10");

    expect(screen.getByText("Minutes saved: 4.29")).toBeInTheDocument();
  });

  it("shows chart and metric chips for valid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/distance/i), "30");
    await user.type(screen.getByLabelText(/speed limit/i), "60");
    await user.type(screen.getByLabelText(/extra speed/i), "10");

    expect(
      screen.getByRole("heading", { name: /time by speed/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/saved per 10/i)).toBeInTheDocument();
  });

  it("recalculates when switching between mi and km units", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/distance/i), "30");
    await user.type(screen.getByLabelText(/speed limit/i), "60");
    await user.type(screen.getByLabelText(/extra speed/i), "10");

    expect(screen.getByText("Minutes saved: 4.29")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/unit/i), "km");
    expect(screen.getByText("Minutes saved: 2.66")).toBeInTheDocument();
  });
});
