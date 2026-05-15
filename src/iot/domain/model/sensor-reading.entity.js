/**
 * Sensor reading captured by an IoT device.
 *
 * In the diagram, VitalSignReading is a specialization of SensorReading.
 * This implementation uses a single type with different `type` values
 * (heart_rate, location, temperature, altitude, etc.).
 */
export class SensorReading {
  constructor(id, deviceId, type, value, recordedAt, unit = null) {
    this.id = id;
    this.deviceId = deviceId;
    this.type = type;
    this.value = value;
    this.recordedAt = recordedAt;
    this.unit = unit;
  }
}

/** Types aligned with the diagram (academic simplification). */
export const SENSOR_READING_TYPES = Object.freeze({
  HEART_RATE: "heart_rate",
  LOCATION: "location",
  TEMPERATURE: "temperature",
  ALTITUDE: "altitude",
  BLOOD_OXYGEN: "blood_oxygen",
  BODY_TEMPERATURE: "body_temperature",
  STEPS: "steps"
});
