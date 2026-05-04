import { SpeedCalculatorForm } from "./features/calculator/components/SpeedCalculatorForm";
import SafetyFacts from "./features/content/SafetyFacts";
import "./styles/app.css";

export default function App() {
  return (
    <main className="page">
      <header className="card hero">
        <div className="hero-brand">
          <div className="hero-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img">
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
              <path
                d="M16 36a16 16 0 0 1 32 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                d="M32 32l11-8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <circle cx="32" cy="32" r="3.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="hero-kicker">Speed reality check</p>
            <h1>Fast Lane, Slow Gain</h1>
          </div>
        </div>
        <p className="hero-subtitle">
          Compare legal speed and faster driving to see your actual time difference.
        </p>
      </header>

      <section className="card" aria-label="Calculator panel">
        <SpeedCalculatorForm />
      </section>

      <SafetyFacts />
    </main>
  );
}
