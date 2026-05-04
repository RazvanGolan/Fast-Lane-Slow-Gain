import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SpeedCalculatorForm } from "./SpeedCalculatorForm";

describe("SpeedCalculatorForm", () => {
  it("defaults to 10 km and uses the planned slider range for extra speed", () => {
    render(<SpeedCalculatorForm />);

    expect(screen.getByLabelText(/distance/i)).toHaveValue(10);
    expect(screen.getByLabelText(/unit/i)).toHaveValue("km");
    expect(screen.getByRole("slider", { name: /extra speed/i })).toHaveAttribute("min", "5");
    expect(screen.getByRole("slider", { name: /extra speed/i })).toHaveAttribute("max", "100");
    expect(screen.getByRole("slider", { name: /extra speed/i })).toHaveAttribute("step", "5");
  });

  it("does not render inline validation messages for empty or invalid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    const distanceInput = screen.getByLabelText(/distance/i);
    const speedLimitInput = screen.getByLabelText(/speed limit/i);

    await user.click(distanceInput);
    await user.tab();

    await user.click(speedLimitInput);
    await user.type(speedLimitInput, "0");
    await user.tab();

    expect(screen.queryByText(/minutes saved:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/must be a positive number/i)).not.toBeInTheDocument();
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });

  it("shows a deterministic formatted minutes saved value for valid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/speed limit/i), "60");

    expect(screen.getByText("Minutes saved: 0.89")).toBeInTheDocument();
  });

  it("shows simplified proof elements for valid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/speed limit/i), "60");

    expect(
      screen.getByRole("heading", { name: /time comparison/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/minutes saved/i)).toBeInTheDocument();
    expect(screen.getByText(/time reduction/i)).toBeInTheDocument();
  });

  it("recalculates when switching between mi and km units", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/speed limit/i), "60");
    const initialMinutesSavedText = screen.getByText(/minutes saved/i).textContent;

    await user.selectOptions(screen.getByLabelText(/unit/i), "mi");
    const updatedMinutesSavedText = screen.getByText(/minutes saved/i).textContent;

    expect(updatedMinutesSavedText).not.toEqual(initialMinutesSavedText);
  });
});
