import { useMemo, useState, type ChangeEvent } from "react";
import {
  calculateTimeSavings,
  type DistanceUnit,
} from "../lib/timeMath";
import { MetricChips } from "../../visualization/components/MetricChips";
import {
  TimeSavingsChart,
  type TimeSavingsPoint,
} from "../../visualization/components/TimeSavingsChart";

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

  const chartPoints = useMemo<TimeSavingsPoint[]>(() => {
    if (
      result === null ||
      parsedSpeedLimit === null ||
      parsedExtraSpeed === null
    ) {
      return [];
    }

    return [
      {
        label: "Legal speed",
        speed: parsedSpeedLimit,
        minutes: result.legalMinutes,
      },
      {
        label: "Your speed",
        speed: parsedSpeedLimit + parsedExtraSpeed,
        minutes: result.fasterMinutes,
      },
    ];
  }, [parsedExtraSpeed, parsedSpeedLimit, result]);

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
            <option value="km">km/km/h</option>
          </select>
        </div>
      </form>

      {result !== null ? (
        <>
          <p className="primary-result">Minutes saved: {result.minutesSaved.toFixed(2)}</p>
          <MetricChips
            minutesSaved={result.minutesSaved}
            percentImprovement={result.percentImprovement}
          />
          <TimeSavingsChart
            points={chartPoints}
            speedUnitLabel={values.unit === "mi" ? "mph" : "km/h"}
          />
        </>
      ) : null}
    </section>
  );
}
