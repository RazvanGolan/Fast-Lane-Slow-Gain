export interface TimeSavingsPoint {
  label: string;
  speed: number;
  minutes: number;
}

interface TimeSavingsChartProps {
  points: TimeSavingsPoint[];
  speedUnitLabel: string;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 180;
const CHART_PADDING = 24;

export function TimeSavingsChart({ points, speedUnitLabel }: TimeSavingsChartProps) {
  if (points.length === 0) {
    return null;
  }

  const minSpeed = Math.min(...points.map((point) => point.speed));
  const maxSpeed = Math.max(...points.map((point) => point.speed));
  const minMinutes = Math.min(...points.map((point) => point.minutes));
  const maxMinutes = Math.max(...points.map((point) => point.minutes));

  const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
  const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;

  const plottedPoints = points
    .map((point) => {
      const xRatio = maxSpeed === minSpeed ? 0 : (point.speed - minSpeed) / (maxSpeed - minSpeed);
      const yRatio =
        maxMinutes === minMinutes ? 0 : (point.minutes - minMinutes) / (maxMinutes - minMinutes);
      const x = CHART_PADDING + xRatio * innerWidth;
      const y = CHART_HEIGHT - CHART_PADDING - yRatio * innerHeight;
      return { ...point, x, y };
    });

  const polylinePoints = plottedPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="chart-panel" aria-label="Time comparison chart">
      <h3>Time comparison</h3>
      <svg
        className="chart-svg"
        role="img"
        aria-label={`Travel minutes by speed in ${speedUnitLabel}`}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <line
          x1={CHART_PADDING}
          y1={CHART_HEIGHT - CHART_PADDING}
          x2={CHART_WIDTH - CHART_PADDING}
          y2={CHART_HEIGHT - CHART_PADDING}
          stroke="currentColor"
        />
        <line
          x1={CHART_PADDING}
          y1={CHART_PADDING}
          x2={CHART_PADDING}
          y2={CHART_HEIGHT - CHART_PADDING}
          stroke="currentColor"
        />
        <polyline fill="none" stroke="currentColor" strokeWidth={2} points={polylinePoints} />
        {plottedPoints.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r={3} fill="currentColor" />
            <text x={point.x + 5} y={point.y - 6} fontSize={10} fill="currentColor">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="chart-legend">
        {points.map((point) => (
          <p key={point.label}>
            <strong>{point.label}</strong>: {point.speed.toFixed(0)} {speedUnitLabel} ·{" "}
            {point.minutes.toFixed(2)} min
          </p>
        ))}
      </div>
    </section>
  );
}
