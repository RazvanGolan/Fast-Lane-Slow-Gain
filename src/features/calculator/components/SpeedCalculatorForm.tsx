import { useMemo, useState, type ChangeEvent } from "react";
import {
  calculateTimeSavings,
  type DistanceUnit,
} from "../lib/timeMath";
import { MetricChips } from "../../visualization/components/MetricChips";

interface FormValues {
  distance: string;
  speedLimit: string;
  extraSpeed: string;
  unit: DistanceUnit;
}

type NumberField = "distance" | "speedLimit" | "extraSpeed";

const MIN_POSITIVE_VALUE = 0.1;
const MIN_EXTRA_SPEED = 5;
const MAX_EXTRA_SPEED = 100;
const EXTRA_SPEED_STEP = 5;

function formatTruncated(value: number): string {
  const truncated = Math.trunc(value * 100) / 100;
  return truncated.toFixed(2).replace(/\.?0+$/, "");
}

function formatSavedTime(minutesSaved: number): string {
  const totalSeconds = minutesSaved * 60;
  if (totalSeconds < 60) {
    return `${formatTruncated(totalSeconds)} sec`;
  }

  const wholeMinutes = Math.trunc(totalSeconds / 60);
  const secondsLeft = totalSeconds - wholeMinutes * 60;
  if (secondsLeft <= 0) {
    return `${wholeMinutes} min`;
  }

  return `${wholeMinutes} min ${formatTruncated(secondsLeft)} sec`;
}

function parsePositiveNumber(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function isDistanceUnit(value: string): value is DistanceUnit {
  return value === "mi" || value === "km";
}

export function SpeedCalculatorForm() {
  const [values, setValues] = useState<FormValues>({
    distance: "10",
    speedLimit: "",
    extraSpeed: "10",
    unit: "km",
  });

  const parsedDistance = parsePositiveNumber(values.distance);
  const parsedSpeedLimit = parsePositiveNumber(values.speedLimit);
  const parsedExtraSpeed = parsePositiveNumber(values.extraSpeed);

  const result = useMemo(() => {
    if (
      parsedDistance === null ||
      parsedSpeedLimit === null ||
      parsedExtraSpeed === null
    ) {
      return null;
    }

    return calculateTimeSavings({
      distance: parsedDistance,
      speedLimit: parsedSpeedLimit,
      extraSpeed: parsedExtraSpeed,
      unit: values.unit,
    });
  }, [parsedDistance, parsedSpeedLimit, parsedExtraSpeed, values.unit]);

  const savedTimeLabel = result === null ? "" : formatSavedTime(result.minutesSaved);

  function handleNumberChange(field: NumberField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((currentValues) => ({ ...currentValues, [field]: value }));
    };
  }

  return (
    <section aria-label="Speed calculator">
      <form className="calculator-form">
        <div className="field-group">
          <label htmlFor="distance">Distance</label>
          <input
            id="distance"
            name="distance"
            type="number"
            min={MIN_POSITIVE_VALUE}
            step="any"
            value={values.distance}
            onChange={handleNumberChange("distance")}
          />
        </div>

        <div className="field-group">
          <label htmlFor="speedLimit">Speed limit</label>
          <input
            id="speedLimit"
            name="speedLimit"
            type="number"
            min={MIN_POSITIVE_VALUE}
            step="any"
            value={values.speedLimit}
            onChange={handleNumberChange("speedLimit")}
          />
        </div>

        <div className="field-group">
          <label htmlFor="extraSpeed">Extra speed</label>
          <input
            id="extraSpeed"
            name="extraSpeed"
            type="range"
            min={MIN_EXTRA_SPEED}
            max={MAX_EXTRA_SPEED}
            step={EXTRA_SPEED_STEP}
            value={values.extraSpeed}
            onChange={handleNumberChange("extraSpeed")}
          />
          <p className="slider-value">+{values.extraSpeed}</p>
        </div>

        <div className="field-group">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            name="unit"
            value={values.unit}
            onChange={(event) => {
              const nextUnit = event.target.value;
              if (!isDistanceUnit(nextUnit)) {
                return;
              }

              setValues((currentValues) => ({
                ...currentValues,
                unit: nextUnit,
              }));
            }}
          >
            <option value="mi">mi/mph</option>
            <option value="km">km/h</option>
          </select>
        </div>
      </form>

      {result !== null ? (
        <>
          <p className="primary-result">Time saved: {savedTimeLabel}</p>
          <MetricChips
            savedTimeLabel={savedTimeLabel}
            percentImprovement={result.percentImprovement}
            legalSpeed={parsedSpeedLimit ?? 0}
            fasterSpeed={result.actualSpeed}
            speedUnitLabel={values.unit === "mi" ? "mph" : "km/h"}
          />
        </>
      ) : null}
    </section>
  );
}
