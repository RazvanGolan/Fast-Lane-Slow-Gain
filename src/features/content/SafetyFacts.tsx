import { safetyFacts } from "./safetyFactsData";

function SafetyFacts() {
  return (
    <section className="card facts" aria-label="Safety facts">
      <h2>Why speeding is not worth it</h2>
      <ul className="facts-list">
        {safetyFacts.map((fact) => (
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
