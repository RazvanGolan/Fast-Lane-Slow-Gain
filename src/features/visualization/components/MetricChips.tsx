interface MetricChipsProps {
  savedTimeLabel: string;
  percentImprovement: number;
  legalSpeed: number;
  fasterSpeed: number;
  speedUnitLabel: string;
}

export function MetricChips({
  savedTimeLabel,
  percentImprovement,
  legalSpeed,
  fasterSpeed,
  speedUnitLabel,
}: MetricChipsProps) {
  return (
    <section className="insights-panel" aria-label="Trip insights">
      <h3>Trip insights</h3>
      <div className="insight-grid">
        <article className="insight-card">
          <h4>Time saved</h4>
          <p>{savedTimeLabel}</p>
        </article>
        <article className="insight-card">
          <h4>Time reduction</h4>
          <p>{(percentImprovement * 100).toFixed(1)}%</p>
        </article>
        <article className="insight-card">
          <h4>Legal pace</h4>
          <p>
            {legalSpeed.toFixed(0)} {speedUnitLabel}
          </p>
        </article>
        <article className="insight-card">
          <h4>Your pace</h4>
          <p>
            {fasterSpeed.toFixed(0)} {speedUnitLabel}
          </p>
        </article>
      </div>
    </section>
  );
}
