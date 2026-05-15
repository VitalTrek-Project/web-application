import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { IoTApi } from "../infrastructure/iot-api.js";
import { DeviceAssembler } from "../infrastructure/device.assembler.js";
import { SensorAssembler } from "../infrastructure/sensor.assembler.js";
import { mapSensorReadingsToSigns } from "../infrastructure/sensor-to-sign.mapper.js";
import { MonitoringApi } from "../../monitoring/infrastructure/monitoring-api.js";
import { SignAssembler } from "../../monitoring/infrastructure/sign.assembler.js";

const iotApi = new IoTApi();
const monitoringApi = new MonitoringApi();

export const useIoTStore = defineStore("iot", () => {
  const devices = ref([]);
  const readings = ref([]);
  const selectedDeviceId = ref(null);
  const errors = ref([]);
  const devicesLoaded = ref(false);
  const readingsLoaded = ref(false);
  const loading = ref(false);

  const selectedDevice = computed(() =>
    devices.value.find((d) => String(d.id) === String(selectedDeviceId.value)) ??
    null
  );

  function clearErrors() {
    errors.value = [];
  }

  function pushError(error) {
    errors.value.push({
      message:
        error?.data?.message ??
        error?.statusText ??
        error?.message ??
        String(error)
    });
  }

  function selectDevice(deviceId) {
    selectedDeviceId.value = deviceId;
  }

  async function fetchDevices() {
    clearErrors();
    loading.value = true;
    try {
      const response = await iotApi.getDevices();
      devices.value = DeviceAssembler.toEntitiesFromResponse(response);
      devicesLoaded.value = true;

      if (devices.value.length && selectedDeviceId.value == null) {
        selectedDeviceId.value = devices.value[0].id;
      }

      return devices.value;
    } catch (error) {
      pushError(error);
      devices.value = [];
      devicesLoaded.value = false;
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchReadings(deviceId = selectedDeviceId.value) {
    if (deviceId == null) {
      readings.value = [];
      readingsLoaded.value = false;
      return [];
    }

    clearErrors();
    loading.value = true;
    selectedDeviceId.value = deviceId;

    try {
      const response = await iotApi.getReadings(deviceId);
      readings.value = SensorAssembler.toEntitiesFromResponse(response);
      readingsLoaded.value = true;
      return readings.value;
    } catch (error) {
      pushError(error);
      readings.value = [];
      readingsLoaded.value = false;
      return [];
    } finally {
      loading.value = false;
    }
  }

  /** Carga dispositivos y lecturas del dispositivo seleccionado (MockAPI). */
  async function ensureIoTDataLoaded() {
    await fetchDevices();
    if (selectedDeviceId.value != null) {
      await fetchReadings(selectedDeviceId.value);
    }
    return { devices: devices.value, readings: readings.value };
  }

  async function sendCommand(deviceId, command) {
    clearErrors();
    try {
      await iotApi.sendCommand(deviceId, command);
      await fetchDevices();
      if (String(selectedDeviceId.value) === String(deviceId)) {
        await fetchReadings(deviceId);
      }
      return true;
    } catch (error) {
      pushError(error);
      throw error;
    }
  }

  async function registerDevice(device) {
    clearErrors();
    loading.value = true;
    try {
      const response = await iotApi.registerDevice(device);
      const entity = DeviceAssembler.toEntityFromResource(response.data);
      await fetchDevices();
      selectedDeviceId.value = entity.id;
      await fetchReadings(entity.id);
      return entity;
    } catch (error) {
      pushError(error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function removeDevice(deviceId) {
    if (deviceId == null || deviceId === "") {
      pushError({ message: "ID de dispositivo inválido." });
      return false;
    }

    clearErrors();
    loading.value = true;
    try {
      await iotApi.removeDevice(deviceId);
      await fetchDevices();

      if (String(selectedDeviceId.value) === String(deviceId)) {
        selectedDeviceId.value = devices.value[0]?.id ?? null;
        if (selectedDeviceId.value != null) {
          await fetchReadings(selectedDeviceId.value);
        } else {
          readings.value = [];
          readingsLoaded.value = false;
        }
      }
      return true;
    } catch (error) {
      pushError(error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Publica signos vitales en Monitoring a partir de lecturas IoT.
   * Integración IoT → vital-sign-readings (MockAPI).
   */
  async function publishVitalSignsToMonitoring(context = {}) {
    const device = selectedDevice.value;
    const signs = mapSensorReadingsToSigns(readings.value, {
      touristId: context.touristId ?? device?.touristId,
      expeditionId: context.expeditionId ?? device?.expeditionId
    });

    if (!signs.length) {
      pushError({ message: "No hay lecturas de signos vitales para enviar." });
      return [];
    }

    const results = [];
    for (const sign of signs) {
      try {
        const response = await monitoringApi.createSign({
          touristId: sign.touristId,
          expeditionId: sign.expeditionId,
          heartRate: sign.heartRate,
          bloodOxygen: sign.bloodOxygen,
          bodyTemperature: sign.bodyTemperature,
          steps: sign.steps,
          recordedAt: sign.recordedAt
        });
        results.push(SignAssembler.toEntityFromResource(response.data));
      } catch (error) {
        pushError(error);
      }
    }
    return results;
  }

  return {
    devices,
    readings,
    selectedDeviceId,
    selectedDevice,
    errors,
    devicesLoaded,
    readingsLoaded,
    loading,
    clearErrors,
    selectDevice,
    fetchDevices,
    fetchReadings,
    ensureIoTDataLoaded,
    sendCommand,
    registerDevice,
    removeDevice,
    publishVitalSignsToMonitoring
  };
});

export default useIoTStore;
