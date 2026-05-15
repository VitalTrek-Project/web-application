/**
 * Lectura de sensor capturada por un dispositivo IoT.
 *
 * En el diagrama, VitalSignReading es una especialización de SensorReading.
 * En esta implementación usamos un único tipo con distintos valores de `type`
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

/** Tipos alineados al diagrama (simplificación académica). */
export const SENSOR_READING_TYPES = Object.freeze({
  HEART_RATE: "heart_rate",
  LOCATION: "location",
  TEMPERATURE: "temperature",
  ALTITUDE: "altitude",
  BLOOD_OXYGEN: "blood_oxygen",
  BODY_TEMPERATURE: "body_temperature",
  STEPS: "steps"
});
