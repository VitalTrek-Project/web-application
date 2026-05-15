import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const devicesEndpointPath = import.meta.env.VITE_IOT_DEVICES_ENDPOINT_PATH;
const sensorReadingsEndpointPath = import.meta.env.VITE_SENSOR_READINGS_ENDPOINT_PATH;

/**
 * Adaptador HTTP del bounded context IoT.
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
    return this.#readingsEndpoint.getAll().then((response) => {
      const records = Array.isArray(response.data) ? response.data : [];
      return {
        ...response,
        data: records.filter(
          (item) => String(item.deviceId) === String(deviceId)
        )
      };
    });
  }

  createReading(resource) {
    return this.#readingsEndpoint.create(resource);
  }

  /**
   * MockAPI no expone acciones; se modela como PUT al dispositivo (merge con recurso actual).
   * @param {number|string} deviceId
   * @param {Object} command
   */
  async sendCommand(deviceId, command) {
    const current = await this.#devicesEndpoint.getById(deviceId);
    const resource = current.data ?? {};

    return this.#devicesEndpoint.update(deviceId, {
      ...resource,
      lastCommand: command,
      lastSeen: new Date().toISOString()
    });
  }
}
