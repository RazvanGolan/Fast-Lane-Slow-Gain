import { useMemo, useState, type ChangeEvent } from "react";
import {
  calculateTimeSavings,
  type DistanceUnit,
} from "../lib/timeMath";

interface FormValues {
  distance: string;
  speedLimit: string;
  extraSpeed: string;
  unit: DistanceUnit;
}

interface TouchedFields {
  distance: boolean;
  speedLimit: boolean;
  extraSpeed: boolean;
}

type NumberField = keyof TouchedFields;

const MIN_POSITIVE_VALUE = Number.EPSILON;

const FIELD_LABELS: Record<NumberField, string> = {
  distance: "Distance",
  speedLimit: "Speed limit",
  extraSpeed: "Extra speed",
};

const FIELD_ERROR_IDS: Record<NumberField, string> = {
  distance: "distance-error",
  speedLimit: "speedLimit-error",
  extraSpeed: "extraSpeed-error",
};

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

function getInlineError(label: string, value: string): string | null {
  if (value.trim() === "") {
    return `${label} is required.`;
  }

  return parsePositiveNumber(value) === null
    ? `${label} must be a positive number.`
    : null;
}

function isDistanceUnit(value: string): value is DistanceUnit {
  return value === "mi" || value === "km";
}

export function SpeedCalculatorForm() {
  const [values, setValues] = useState<FormValues>({
    distance: "",
    speedLimit: "",
    extraSpeed: "",
    unit: "mi",
  });

  const [touched, setTouched] = useState<TouchedFields>({
    distance: false,
    speedLimit: false,
    extraSpeed: false,
  });

  const parsedDistance = parsePositiveNumber(values.distance);
  const parsedSpeedLimit = parsePositiveNumber(values.speedLimit);
  const parsedExtraSpeed = parsePositiveNumber(values.extraSpeed);

  const errors = {
    distance: touched.distance
      ? getInlineError(FIELD_LABELS.distance, values.distance)
      : null,
    speedLimit: touched.speedLimit
      ? getInlineError(FIELD_LABELS.speedLimit, values.speedLimit)
      : null,
    extraSpeed: touched.extraSpeed
      ? getInlineError(FIELD_LABELS.extraSpeed, values.extraSpeed)
      : null,
  };

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

  function handleNumberChange(field: NumberField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((currentValues) => ({ ...currentValues, [field]: value }));
    };
  }

  function handleNumberBlur(field: NumberField) {
    return () => {
      setTouched((currentTouched) =>
        currentTouched[field]
          ? currentTouched
          : { ...currentTouched, [field]: true },
      );
    };
  }

  return (
    <section aria-label="Speed calculator">
      <form>
        <div>
          <label htmlFor="distance">Distance</label>
          <input
            id="distance"
            name="distance"
            type="number"
            min={MIN_POSITIVE_VALUE}
            step="any"
            value={values.distance}
            onChange={handleNumberChange("distance")}
            onBlur={handleNumberBlur("distance")}
            aria-invalid={errors.distance !== null}
            aria-describedby={
              errors.distance !== null ? FIELD_ERROR_IDS.distance : undefined
            }
          />
          {errors.distance !== null ? (
            <p id={FIELD_ERROR_IDS.distance} role="alert">
              {errors.distance}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="speedLimit">Speed limit</label>
          <input
            id="speedLimit"
            name="speedLimit"
            type="number"
            min={MIN_POSITIVE_VALUE}
            step="any"
            value={values.speedLimit}
            onChange={handleNumberChange("speedLimit")}
            onBlur={handleNumberBlur("speedLimit")}
            aria-invalid={errors.speedLimit !== null}
            aria-describedby={
              errors.speedLimit !== null ? FIELD_ERROR_IDS.speedLimit : undefined
            }
          />
          {errors.speedLimit !== null ? (
            <p id={FIELD_ERROR_IDS.speedLimit} role="alert">
              {errors.speedLimit}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="extraSpeed">Extra speed</label>
          <input
            id="extraSpeed"
            name="extraSpeed"
            type="number"
            min={MIN_POSITIVE_VALUE}
            step="any"
            value={values.extraSpeed}
            onChange={handleNumberChange("extraSpeed")}
            onBlur={handleNumberBlur("extraSpeed")}
            aria-invalid={errors.extraSpeed !== null}
            aria-describedby={
              errors.extraSpeed !== null ? FIELD_ERROR_IDS.extraSpeed : undefined
            }
          />
          {errors.extraSpeed !== null ? (
            <p id={FIELD_ERROR_IDS.extraSpeed} role="alert">
              {errors.extraSpeed}
            </p>
          ) : null}
        </div>

        <div>
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

      {result !== null ? <p>Minutes saved: {result.minutesSaved.toFixed(2)}</p> : null}
    </section>
  );
}
