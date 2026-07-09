import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const devicesEndpointPath = import.meta.env.VITE_IOT_DEVICES_ENDPOINT_PATH;
const sensorReadingsEndpointPath = import.meta.env.VITE_SENSOR_READINGS_ENDPOINT_PATH;

/**
 * HTTP adapter for the IoT bounded context.
 *
 * @class IoTApi
 * @extends BaseApi
 */
export class IoTApi extends BaseApi {
  /** @type {BaseEndpoint} */
  #devicesEndpoint;

  /** @type {BaseEndpoint} */
  #readingsEndpoint;

  constructor() {
    super();
    this.#devicesEndpoint = new BaseEndpoint(this, devicesEndpointPath);
    this.#readingsEndpoint = new BaseEndpoint(this, sensorReadingsEndpointPath);
  }

  getDevices() {
    return this.#devicesEndpoint.getAll();
  }

  getDeviceById(id) {
    return this.#devicesEndpoint.getById(id);
  }

  registerDevice(resource) {
    return this.#devicesEndpoint.create(resource);
  }

  removeDevice(id) {
    return this.#devicesEndpoint.delete(id);
  }

  getReadings(deviceId) {
    return this.http.get(`${devicesEndpointPath}/${deviceId}/sensor-readings`);
  }

  createReading(resource) {
    return this.#readingsEndpoint.create(resource);
  }

  /**
   * Dispatches a command to a device via PUT /devices/{deviceId}.
   * Backend reads only { lastCommand, lastSeen } from the body.
   * @param {number|string} deviceId
   * @param {string|{type?: string}|Object} command
   */
  sendCommand(deviceId, command) {
    const lastCommand =
      typeof command === "string"
        ? command
        : (command?.type ?? command?.lastCommand ?? JSON.stringify(command));
    return this.#devicesEndpoint.update(deviceId, {
      lastCommand,
      lastSeen: new Date().toISOString()
    });
  }
}
