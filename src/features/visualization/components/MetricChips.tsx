import type { DistanceUnit } from "../../calculator/lib/timeMath";

interface MetricChipsProps {
  minutesSaved: number;
  percentImprovement: number;
  savedPer10Units: number;
  unit: DistanceUnit;
}

export function MetricChips({
  minutesSaved,
  percentImprovement,
  savedPer10Units,
  unit,
}: MetricChipsProps) {
  const distanceLabel = unit === "mi" ? "mi" : "km";

  return (
    <section className="metrics-panel" aria-label="Savings metrics">
      <h3>Key metrics</h3>
      <ul className="metric-list">
        <li>Trip savings: {minutesSaved.toFixed(2)} min</li>
        <li>Time cut: {(percentImprovement * 100).toFixed(1)}%</li>
        <li>
          Saved per 10 {distanceLabel}: {savedPer10Units.toFixed(2)} min
        </li>
      </ul>
    </section>
  );
}
