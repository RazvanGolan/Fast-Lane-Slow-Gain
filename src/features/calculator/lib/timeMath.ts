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

const KM_TO_MI = 0.621371;

export function normalizeDistance(distance: number, unit: DistanceUnit): number {
  return unit === "km" ? distance * KM_TO_MI : distance;
}

export function calculateTimeSavings(input: CalculationInput): CalculationResult {
  const miles = normalizeDistance(input.distance, input.unit);
  const actualSpeed = input.speedLimit + input.extraSpeed;
  const legalMinutes = (miles / input.speedLimit) * 60;
  const fasterMinutes = (miles / actualSpeed) * 60;
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
