import { describe, expect, it } from "vitest";
import { calculateTimeSavings } from "./timeMath";

describe("calculateTimeSavings", () => {
  it("computes minutes saved between legal and faster speeds in miles", () => {
    const result = calculateTimeSavings({
      distance: 30,
      unit: "mi",
      speedLimit: 60,
      extraSpeed: 10,
    });

    expect(result.legalMinutes).toBeCloseTo(30);
    expect(result.fasterMinutes).toBeCloseTo(25.714, 2);
    expect(result.minutesSaved).toBeCloseTo(4.286, 2);
    expect(result.percentImprovement).toBeCloseTo(0.1429, 3);
    expect(result.actualSpeed).toBe(70);
  });

  it("computes minutes saved between legal and faster speeds in kilometers", () => {
    const result = calculateTimeSavings({
      distance: 30,
      unit: "km",
      speedLimit: 60,
      extraSpeed: 10,
    });

    expect(result.legalMinutes).toBeCloseTo(30);
    expect(result.fasterMinutes).toBeCloseTo(25.714, 2);
    expect(result.minutesSaved).toBeCloseTo(4.286, 2);
    expect(result.percentImprovement).toBeCloseTo(0.1429, 3);
    expect(result.actualSpeed).toBe(70);
  });
});