import { SpeedCalculatorForm } from "./features/calculator/components/SpeedCalculatorForm";
import SafetyFacts from "./features/content/SafetyFacts";
import "./styles/app.css";

export default function App() {
  return (
    <main className="page">
      <header className="card hero">
        <h1>Fast Lane, Slow Gain</h1>
        <p>See how little time speeding usually saves on everyday trips.</p>
      </header>

      <section className="card" aria-label="Calculator panel">
        <SpeedCalculatorForm />
      </section>

      <SafetyFacts />
    </main>
  );
}
