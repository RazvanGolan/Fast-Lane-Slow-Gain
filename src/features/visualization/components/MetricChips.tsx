interface MetricChipsProps {
  minutesSaved: number;
  percentImprovement: number;
}

export function MetricChips({
  minutesSaved,
  percentImprovement,
}: MetricChipsProps) {
  return (
    <section className="metrics-panel" aria-label="Savings metrics">
      <h3>Quick impact</h3>
      <div className="metric-grid">
        <article className="metric-card">
          <h4>Minutes saved</h4>
          <p>{minutesSaved.toFixed(2)} min</p>
        </article>
        <article className="metric-card">
          <h4>Time reduction</h4>
          <p>{(percentImprovement * 100).toFixed(1)}%</p>
        </article>
      </div>
    </section>
  );
}
