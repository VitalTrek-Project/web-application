<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useIoTStore from "../../application/iot.store.js";
import IotPanel from "../components/iot-panel.vue";
import {
  formatRelativeTime,
  getDeviceStatusKey
} from "../utils/iot-presenter.js";

const { t } = useI18n();
const store = useIoTStore();
const { devices, selectedDevice, errors, loading } = storeToRefs(store);
const { ensureIoTDataLoaded, sendCommand } = store;

const commandType = ref("ping");

const commands = computed(() => [
  { value: "ping", label: t("iot.control.commands.ping"), icon: "pi-wifi" },
  { value: "sync", label: t("iot.control.commands.sync"), icon: "pi-sync" },
  { value: "sos_test", label: t("iot.control.commands.sos"), icon: "pi-exclamation-triangle" }
]);

onMounted(() => {
  ensureIoTDataLoaded();
});

const runCommand = () => {
  if (!selectedDevice.value) return;
  sendCommand(selectedDevice.value.id, {
    type: commandType.value,
    issuedAt: new Date().toISOString()
  }).catch(() => {});
};
</script>

<template>
  <IotPanel>
    <div class="iot-card">
      <div class="iot-dashboard-header">
        <div>
          <h2 class="iot-section-title">{{ t("iot.control.title") }}</h2>
          <p class="iot-meta">{{ t("iot.control.description") }}</p>
        </div>
      </div>

      <div v-if="loading && !devices.length" class="iot-empty">
        {{ t("weather.loading") }}
      </div>

      <div v-else-if="!devices.length" class="iot-empty">
        {{ t("iot.devices.empty") }}
      </div>

      <div v-else class="iot-control-layout">
        <section class="iot-info-card">
          <h3>{{ t("iot.control.device-info") }}</h3>
          <template v-if="selectedDevice">
            <p class="iot-meta">
              <strong>{{ selectedDevice.name }}</strong>
            </p>
            <p class="iot-meta">{{ selectedDevice.type }}</p>
            <p class="iot-meta">
              {{ t("iot.devices.status") }}:
              <span
                  class="iot-status-pill"
                  :class="`iot-status-pill--${getDeviceStatusKey(selectedDevice.status)}`"
              >
                {{ selectedDevice.status }}
              </span>
            </p>
            <p class="iot-meta">
              {{ t("iot.devices.last-seen") }}:
              {{ formatRelativeTime(selectedDevice.lastSeen) }}
            </p>
          </template>
          <p v-else class="iot-empty">{{ t("iot.readings.select-device") }}</p>

          <span class="iot-field-label" style="margin-top: 16px">
            {{ t("iot.control.device") }}
          </span>
          <pv-select
              v-model="store.selectedDeviceId"
              :options="devices"
              option-label="name"
              option-value="id"
              class="w-full"
          />
        </section>

        <section class="iot-info-card">
          <h3>{{ t("iot.control.command") }}</h3>
          <p class="iot-meta">{{ t("iot.control.command-hint") }}</p>

          <div class="iot-command-grid">
            <button
                v-for="cmd in commands"
                :key="cmd.value"
                type="button"
                class="iot-command-chip"
                :class="{ 'iot-command-chip--active': commandType === cmd.value }"
                @click="commandType = cmd.value"
            >
              <i :class="['pi', cmd.icon]" aria-hidden="true" />
              {{ cmd.label }}
            </button>
          </div>

          <pv-button
              :label="t('iot.control.send')"
              class="iot-primary-button"
              icon="pi pi-send"
              :loading="loading"
              :disabled="!selectedDevice"
              @click="runCommand"
          />
        </section>
      </div>

      <div v-if="errors.length" class="monitoring-error">
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </IotPanel>
</template>
