import { describe, expect, it } from "vitest";
import { calculateTimeSavings, normalizeDistance } from "./timeMath";

describe("normalizeDistance", () => {
  it("returns miles unchanged", () => {
    expect(normalizeDistance(10, "mi")).toBeCloseTo(10);
  });

  it("converts kilometers to miles", () => {
    expect(normalizeDistance(10, "km")).toBeCloseTo(6.21371, 4);
  });
});

describe("calculateTimeSavings", () => {
  it("computes minutes saved between legal and faster speeds", () => {
    const result = calculateTimeSavings({
      distance: 30,
      unit: "mi",
      speedLimit: 60,
      extraSpeed: 10,
    });

    expect(result.legalMinutes).toBeCloseTo(30);
    expect(result.fasterMinutes).toBeCloseTo(25.714, 2);
    expect(result.minutesSaved).toBeCloseTo(4.286, 2);
    expect(result.percentImprovement).toBeGreaterThan(0);
  });
});
