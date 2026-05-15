<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useIoTStore from "../../application/iot.store.js";
import IotPanel from "../components/iot-panel.vue";
import {
  getReadingTypeI18nKey,
  getReadingTypeMeta,
  summarizeVitalReadings
} from "../utils/iot-presenter.js";

const { t } = useI18n();
const store = useIoTStore();
const { readings, devices, selectedDevice, selectedDeviceId, errors, loading } =
  storeToRefs(store);
const { ensureIoTDataLoaded, fetchReadings, publishVitalSignsToMonitoring } =
  store;

const vitalSummary = computed(() => summarizeVitalReadings(readings.value));

const vitalCards = computed(() =>
  Object.entries(vitalSummary.value).map(([type, reading]) => ({
    type,
    reading,
    meta: getReadingTypeMeta(type),
    labelKey: getReadingTypeI18nKey(type)
  }))
);

onMounted(() => {
  ensureIoTDataLoaded();
});

const onDeviceChange = (deviceId) => {
  fetchReadings(deviceId);
};

const syncToMonitoring = () => {
  publishVitalSignsToMonitoring().catch(() => {});
};
</script>

<template>
  <IotPanel>
    <div class="iot-card">
      <div class="iot-dashboard-header">
        <div>
          <h2 class="iot-section-title">{{ t("iot.readings.title") }}</h2>
          <p v-if="selectedDevice" class="iot-meta">
            {{ selectedDevice.name }} · {{ selectedDevice.type }}
          </p>
          <p v-else class="iot-meta">{{ t("iot.readings.select-device") }}</p>
        </div>
        <div class="iot-dashboard-actions">
          <pv-button
              :label="t('iot.readings.sync-monitoring')"
              class="iot-primary-button"
              icon="pi pi-upload"
              :disabled="!readings.length"
              @click="syncToMonitoring"
          />
        </div>
      </div>

      <section v-if="devices.length" class="iot-info-card iot-device-picker">
        <span class="iot-field-label">{{ t("iot.control.device") }}</span>
        <pv-select
            v-model="selectedDeviceId"
            :options="devices"
            option-label="name"
            option-value="id"
            class="w-full"
            @update:model-value="onDeviceChange"
        />
      </section>

      <div v-if="loading && !readings.length" class="iot-empty">
        {{ t("weather.loading") }}
      </div>

      <template v-else-if="selectedDevice">
        <div v-if="vitalCards.length" class="iot-vitals-grid">
          <article
              v-for="item in vitalCards"
              :key="item.type"
              class="iot-vital-card"
          >
            <p class="iot-vital-card__label">
              <i :class="['pi', item.meta.icon]" aria-hidden="true" />
              {{ t(`iot.readings.types.${item.labelKey}`) }}
            </p>
            <p class="iot-vital-card__value">{{ item.reading.value }}</p>
            <p v-if="item.reading.unit" class="iot-vital-card__unit">
              {{ item.reading.unit }}
            </p>
          </article>
        </div>

        <section class="iot-info-card">
          <h3>{{ t("iot.readings.history-title") }}</h3>
          <p v-if="!readings.length" class="iot-empty">{{ t("iot.readings.empty") }}</p>
          <pv-data-table
              v-else
              :value="readings"
              :loading="loading"
              class="iot-table-mock"
              table-style="width: 100%"
          >
            <pv-column :header="t('iot.readings.id')" field="id" style="width: 72px" />
            <pv-column :header="t('iot.readings.type')">
              <template #body="{ data }">
                <span
                    class="iot-reading-badge"
                    :class="{
                      'iot-reading-badge--geo':
                        getReadingTypeMeta(data.type).tone === 'geo'
                    }"
                >
                  <i :class="['pi', getReadingTypeMeta(data.type).icon]" />
                  {{ data.type }}
                </span>
              </template>
            </pv-column>
            <pv-column :header="t('iot.readings.value')" field="value" />
            <pv-column :header="t('iot.readings.unit')" field="unit" />
            <pv-column :header="t('iot.readings.recorded-at')" field="recordedAt" />
          </pv-data-table>
        </section>
      </template>

      <p v-else-if="!devices.length && !loading" class="iot-empty">
        {{ t("iot.devices.empty") }}
      </p>

      <div v-if="errors.length" class="monitoring-error">
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </IotPanel>
</template>

<style scoped>
.iot-device-picker {
  margin-bottom: 18px;
}
</style>
