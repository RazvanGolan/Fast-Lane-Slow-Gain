export interface TimeSavingsPoint {
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

  const polylinePoints = points
    .map((point) => {
      const xRatio = maxSpeed === minSpeed ? 0 : (point.speed - minSpeed) / (maxSpeed - minSpeed);
      const yRatio =
        maxMinutes === minMinutes ? 0 : (point.minutes - minMinutes) / (maxMinutes - minMinutes);
      const x = CHART_PADDING + xRatio * innerWidth;
      const y = CHART_HEIGHT - CHART_PADDING - yRatio * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="chart-panel" aria-label="Time by speed chart">
      <h3>Time by speed</h3>
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
      </svg>
      <ul className="chart-list">
        {points.map((point) => (
          <li key={point.speed}>
            {point.speed.toFixed(0)} {speedUnitLabel}: {point.minutes.toFixed(2)} min
          </li>
        ))}
      </ul>
    </section>
  );
}
