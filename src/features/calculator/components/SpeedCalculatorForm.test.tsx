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

  it("shows exact saved time in minutes and seconds when gain reaches at least one minute", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.clear(screen.getByLabelText(/distance/i));
    await user.type(screen.getByLabelText(/distance/i), "20");
    await user.type(screen.getByLabelText(/speed limit/i), "60");

    expect(screen.getByText("Time saved: 2 min 51.42 sec")).toBeInTheDocument();
  });

  it("shows simplified proof elements for valid values", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/speed limit/i), "60");

    expect(
      screen.getByRole("heading", { name: /trip insights/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/time saved:/i, { selector: ".primary-result" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/time reduction/i, { selector: "h4" })).toBeInTheDocument();
    expect(
      screen.queryByText(/you are pushing harder for about/i),
    ).not.toBeInTheDocument();
  });

  it("shows exact saved time in seconds when gain is below one minute", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.clear(screen.getByLabelText(/distance/i));
    await user.type(screen.getByLabelText(/distance/i), "5");
    await user.type(screen.getByLabelText(/speed limit/i), "60");

    expect(screen.getByText("Time saved: 42.85 sec")).toBeInTheDocument();
  });

  it("updates the speed unit label when switching between mi and km", async () => {
    const user = userEvent.setup();
    render(<SpeedCalculatorForm />);

    await user.type(screen.getByLabelText(/speed limit/i), "60");

    const insightsPanel = screen.getByRole("region", { name: /trip insights/i });
    expect(insightsPanel).toHaveTextContent(/km\/h/i);

    await user.selectOptions(screen.getByLabelText(/unit/i), "mi");

    expect(insightsPanel).toHaveTextContent(/mph/i);
    expect(insightsPanel).not.toHaveTextContent(/km\/h/i);
  });
});
