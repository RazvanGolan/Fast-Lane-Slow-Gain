import { useMemo } from "react";
import { safetyFacts } from "./safetyFactsData";

function SafetyFacts() {
  const randomFacts = useMemo(
    () => [...safetyFacts].sort(() => Math.random() - 0.5).slice(0, 3),
    []
  );

  return (
    <section className="card facts" aria-label="Safety facts">
      <h2>Why speeding is not worth it</h2>
      <ul className="facts-list">
        {randomFacts.map((fact) => (
          <li key={fact.sourceUrl}>
            <p>{fact.text}</p>
            <a href={fact.sourceUrl} target="_blank" rel="noreferrer">
              {fact.sourceLabel}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { SafetyFacts };
export default SafetyFacts;
