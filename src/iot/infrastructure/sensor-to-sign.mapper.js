import { Sign } from "../../monitoring/domain/model/sign.entity.js";
import { SENSOR_READING_TYPES } from "../domain/model/sensor-reading.entity.js";

/**
 * Types the diagram treats as VitalSignReading (vital signs → Monitoring).
 * Other types (location, altitude) remain generic SensorReading.
 */
const VITAL_SIGN_TYPES = new Set([
  SENSOR_READING_TYPES.HEART_RATE,
  SENSOR_READING_TYPES.BLOOD_OXYGEN,
  SENSOR_READING_TYPES.BODY_TEMPERATURE,
  SENSOR_READING_TYPES.TEMPERATURE,
  SENSOR_READING_TYPES.STEPS
]);

const TYPE_ALIASES = {
  [SENSOR_READING_TYPES.TEMPERATURE]: SENSOR_READING_TYPES.BODY_TEMPERATURE
};

function normalizeType(type) {
  const key = String(type).toLowerCase();
  return TYPE_ALIASES[key] ?? key;
}

/**
 * Maps IoT readings to Sign entities (VitalSignReading in the Monitoring domain).
 *
 * @param {import('../domain/model/sensor-reading.entity.js').SensorReading[]} readings
 * @param {{ touristId?: number|string, expeditionId?: number|string }} context
 * @returns {Sign[]}
 */
export function mapSensorReadingsToSigns(readings, context = {}) {
  const grouped = {};

  for (const reading of readings) {
    const type = normalizeType(reading.type);
    if (!VITAL_SIGN_TYPES.has(type)) {
      continue;
    }

    const key = `${reading.deviceId}-${context.expeditionId ?? "exp"}`;
    if (!grouped[key]) {
      grouped[key] = {
        touristId: context.touristId ?? null,
        expeditionId: context.expeditionId ?? null,
        heartRate: null,
        bloodOxygen: null,
        bodyTemperature: null,
        steps: null,
        recordedAt: reading.recordedAt
      };
    }

    const bucket = grouped[key];

    if (type === SENSOR_READING_TYPES.HEART_RATE) bucket.heartRate = reading.value;
    if (type === SENSOR_READING_TYPES.BLOOD_OXYGEN) bucket.bloodOxygen = reading.value;
    if (type === SENSOR_READING_TYPES.BODY_TEMPERATURE) {
      bucket.bodyTemperature = reading.value;
    }
    if (type === SENSOR_READING_TYPES.STEPS) bucket.steps = reading.value;

    if (reading.recordedAt > bucket.recordedAt) {
      bucket.recordedAt = reading.recordedAt;
    }
  }

  return Object.values(grouped).map(
    (payload) =>
      new Sign({
        ...payload,
        id: null
      })
  );
}

/**
 * Readings that are not mapped to Sign (e.g. location, altitude).
 * @param {import('../domain/model/sensor-reading.entity.js').SensorReading[]} readings
 */
export function filterNonVitalReadings(readings) {
  return readings.filter((reading) => {
    const type = normalizeType(reading.type);
    return !VITAL_SIGN_TYPES.has(type);
  });
}

export function mapSingleReadingToSign(reading, context = {}) {
  return mapSensorReadingsToSigns([reading], context)[0] ?? null;
}
