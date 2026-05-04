import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SafetyFacts from "./SafetyFacts";

describe("SafetyFacts", () => {
  it("renders source links for each fact", () => {
    render(<SafetyFacts />);
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(3);
  });
});
