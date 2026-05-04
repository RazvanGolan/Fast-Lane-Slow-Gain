import { useMemo, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  calculateTimeSavings,
  type DistanceUnit,
} from "../lib/timeMath";
import { useReducedMotion } from "../../experience/hooks/useReducedMotion";
import { MetricChips } from "../../visualization/components/MetricChips";
import { TimeSavingsChart } from "../../visualization/components/TimeSavingsChart";

interface FormValues {
  distance: string;
  speedLimit: string;
  extraSpeed: string;
  unit: DistanceUnit;
}

type NumberField = "distance" | "speedLimit" | "extraSpeed";

const MIN_POSITIVE_VALUE = 0.1;
const MIN_EXTRA_SPEED = 1;
const MAX_EXTRA_SPEED = 50;

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
  const prefersReducedMotion = useReducedMotion();

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

  const chartPoints = useMemo(() => {
    if (
      result === null ||
      parsedSpeedLimit === null ||
      parsedExtraSpeed === null
    ) {
      return [];
    }

    const speeds = [0, 1, 2, 3]
      .map((multiplier) => parsedSpeedLimit + parsedExtraSpeed * multiplier)
      .filter((speed, index, allSpeeds) => speed > 0 && allSpeeds.indexOf(speed) === index);

    return speeds.map((speed) => ({
      speed,
      minutes: (result.legalMinutes * parsedSpeedLimit) / speed,
    }));
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
            step={1}
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
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Minutes saved: {result.minutesSaved.toFixed(2)}
          </motion.p>
          <MetricChips
            minutesSaved={result.minutesSaved}
            percentImprovement={result.percentImprovement}
            savedPer10Units={result.savedPer10Units}
            unit={values.unit}
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
