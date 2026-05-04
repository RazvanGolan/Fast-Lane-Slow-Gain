export type DistanceUnit = "mi" | "km";

export interface CalculationInput {
  distance: number;
  unit: DistanceUnit;
  speedLimit: number;
  extraSpeed: number;
}

export interface CalculationResult {
  legalMinutes: number;
  fasterMinutes: number;
  minutesSaved: number;
  percentImprovement: number;
  savedPer10Units: number;
  actualSpeed: number;
}

export function calculateTimeSavings(input: CalculationInput): CalculationResult {
  const actualSpeed = input.speedLimit + input.extraSpeed;
  const legalMinutes = (input.distance / input.speedLimit) * 60;
  const fasterMinutes = (input.distance / actualSpeed) * 60;
  const minutesSaved = legalMinutes - fasterMinutes;
  const percentImprovement = minutesSaved / legalMinutes;
  const savedPer10Units = minutesSaved / (input.distance / 10);

  return {
    legalMinutes,
    fasterMinutes,
    minutesSaved,
    percentImprovement,
    savedPer10Units,
    actualSpeed,
  };
}
