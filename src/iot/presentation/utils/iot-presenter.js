import { SENSOR_READING_TYPES } from "../../domain/model/sensor-reading.entity.js";

const VITAL_TYPES = new Set([
  SENSOR_READING_TYPES.HEART_RATE,
  SENSOR_READING_TYPES.BLOOD_OXYGEN,
  SENSOR_READING_TYPES.TEMPERATURE,
  SENSOR_READING_TYPES.BODY_TEMPERATURE,
  SENSOR_READING_TYPES.STEPS
]);

const TYPE_I18N_KEY = {
  heart_rate: "heart-rate",
  blood_oxygen: "blood-oxygen",
  body_temperature: "temperature",
  temperature: "temperature",
  steps: "steps",
  location: "location",
  altitude: "altitude"
};

export function getDeviceStatusKey(status) {
  const value = String(status ?? "").toLowerCase();
  if (value === "online") return "online";
  if (value === "offline") return "offline";
  return "neutral";
}

export function getReadingTypeMeta(type) {
  const key = String(type ?? "").toLowerCase();
  const map = {
    heart_rate: { icon: "pi-heart-fill", tone: "vital" },
    blood_oxygen: { icon: "pi-cloud", tone: "vital" },
    temperature: { icon: "pi-sun", tone: "vital" },
    body_temperature: { icon: "pi-sun", tone: "vital" },
    steps: { icon: "pi-directions", tone: "vital" },
    location: { icon: "pi-map-marker", tone: "geo" },
    altitude: { icon: "pi-arrow-up", tone: "geo" }
  };
  return map[key] ?? { icon: "pi-chart-line", tone: "neutral" };
}

export function summarizeDeviceStats(devices) {
  const list = devices ?? [];
  const online = list.filter((d) => getDeviceStatusKey(d.status) === "online").length;
  return {
    total: list.length,
    online,
    offline: list.length - online
  };
}

export function summarizeVitalReadings(readings) {
  const latest = {};
  for (const reading of readings ?? []) {
    const type = String(reading.type).toLowerCase();
    if (!VITAL_TYPES.has(type)) {
      continue;
    }
    const normalized =
      type === SENSOR_READING_TYPES.TEMPERATURE
        ? SENSOR_READING_TYPES.BODY_TEMPERATURE
        : type;
    if (
      !latest[normalized] ||
      String(reading.recordedAt) > String(latest[normalized].recordedAt)
    ) {
      latest[normalized] = reading;
    }
  }
  return latest;
}

export function getReadingTypeI18nKey(type) {
  return TYPE_I18N_KEY[String(type ?? "").toLowerCase()] ?? "generic";
}

export function formatRelativeTime(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
