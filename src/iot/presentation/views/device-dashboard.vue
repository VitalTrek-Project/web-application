<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import useIoTStore from "../../application/iot.store.js";
import IotPanel from "../components/iot-panel.vue";
import {
  formatRelativeTime,
  getDeviceStatusKey,
  summarizeDeviceStats
} from "../utils/iot-presenter.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useIoTStore();
const { devices, selectedDeviceId, selectedDevice, errors, loading } =
  storeToRefs(store);
const {
  ensureIoTDataLoaded,
  selectDevice,
  fetchReadings,
  registerDevice,
  removeDevice
} = store;

const showAddForm = ref(false);
const saving = ref(false);

const deviceTypeOptions = computed(() => [
  { label: t("iot.devices.types.wearable"), value: "wearable" },
  { label: t("iot.devices.types.gps_tracker"), value: "gps_tracker" },
  { label: t("iot.devices.types.environmental"), value: "environmental" }
]);

const deviceStatusOptions = computed(() => [
  { label: t("iot.devices.statuses.online"), value: "online" },
  { label: t("iot.devices.statuses.offline"), value: "offline" }
]);

const newDeviceForm = ref({
  name: "",
  type: "wearable",
  status: "online",
  expeditionId: null
});

const stats = computed(() => summarizeDeviceStats(devices.value));

const resetForm = () => {
  newDeviceForm.value = {
    name: "",
    type: "wearable",
    status: "online",
    expeditionId: null
  };
};

onMounted(() => {
  ensureIoTDataLoaded();
});

const onSelectDevice = (device) => {
  selectDevice(device.id);
  fetchReadings(device.id);
};

const goToReadings = () => {
  if (selectedDeviceId.value != null) {
    router.push({ name: "iot-readings" });
  }
};

const isSelected = (device) =>
  String(device.id) === String(selectedDeviceId.value);

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  if (!showAddForm.value) {
    resetForm();
  }
};

const submitNewDevice = async () => {
  const name = String(newDeviceForm.value.name ?? "").trim();
  if (!name) return;

  saving.value = true;
  try {
    const payload = {
      name,
      type: newDeviceForm.value.type,
      status: newDeviceForm.value.status,
      lastSeen: new Date().toISOString()
    };
    const expeditionId = newDeviceForm.value.expeditionId;
    if (expeditionId != null && expeditionId !== "") {
      payload.expeditionId = Number(expeditionId);
    }
    await registerDevice(payload);
    showAddForm.value = false;
    resetForm();
  } catch {
    /* errors in store */
  } finally {
    saving.value = false;
  }
};

const confirmRemoveDevice = (device) => {
  const deviceId = device?.id;
  if (deviceId == null || deviceId === "") return;

  confirm.require({
    message: t("iot.devices.confirm-delete"),
    header: t("iot.devices.delete-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("iot.devices.cancel"),
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: t("iot.devices.delete"),
      severity: "danger"
    },
    accept: async () => {
      await removeDevice(deviceId);
    }
  });
};
</script>

<template>
  <IotPanel>
    <div class="iot-card">
      <div class="iot-dashboard-header">
        <div>
          <h2 class="iot-section-title">{{ t("iot.devices.title") }}</h2>
          <p class="iot-meta">{{ t("iot.devices.subtitle") }}</p>
        </div>
        <div class="iot-dashboard-actions">
          <pv-button
              :label="t('iot.devices.add')"
              class="iot-primary-button"
              icon="pi pi-plus"
              @click="toggleAddForm"
          />
          <pv-button
              v-if="selectedDevice"
              :label="t('iot.devices.view-readings')"
              class="iot-outline-button"
              icon="pi pi-chart-line"
              outlined
              @click="goToReadings"
          />
          <pv-button
              :label="t('iot.devices.refresh')"
              class="iot-outline-button"
              icon="pi pi-refresh"
              :loading="loading"
              outlined
              @click="ensureIoTDataLoaded"
          />
        </div>
      </div>

      <section v-if="showAddForm" class="iot-info-card iot-add-form">
        <h3>{{ t("iot.devices.add-title") }}</h3>
        <p class="iot-meta">{{ t("iot.devices.add-description") }}</p>
        <form class="bc-form" @submit.prevent="submitNewDevice">
          <div class="bc-form-field">
            <label for="device-name">{{ t("iot.devices.name") }}</label>
            <pv-input-text
                id="device-name"
                v-model="newDeviceForm.name"
                :placeholder="t('iot.devices.name-placeholder')"
                required
            />
          </div>
          <div class="bc-form-field">
            <label for="device-type">{{ t("iot.devices.type") }}</label>
            <pv-select
                id="device-type"
                v-model="newDeviceForm.type"
                :options="deviceTypeOptions"
                option-label="label"
                option-value="value"
            />
          </div>
          <div class="bc-form-field">
            <label for="device-status">{{ t("iot.devices.status") }}</label>
            <pv-select
                id="device-status"
                v-model="newDeviceForm.status"
                :options="deviceStatusOptions"
                option-label="label"
                option-value="value"
            />
          </div>
          <div class="bc-form-field">
            <label for="device-expedition">{{ t("iot.devices.expedition") }}</label>
            <pv-input-number
                id="device-expedition"
                v-model="newDeviceForm.expeditionId"
                :placeholder="t('iot.devices.expedition-placeholder')"
                :use-grouping="false"
            />
          </div>
          <div class="bc-form-actions">
            <pv-button
                type="button"
                :label="t('iot.devices.cancel')"
                class="iot-outline-button"
                outlined
                @click="toggleAddForm"
            />
            <pv-button
                type="submit"
                :label="t('iot.devices.save')"
                class="iot-primary-button"
                icon="pi pi-check"
                :loading="saving"
            />
          </div>
        </form>
      </section>

      <div v-if="loading && !devices.length" class="iot-empty">
        {{ t("weather.loading") }}
      </div>

      <template v-else-if="devices.length">
        <div class="iot-stats-row">
          <article class="iot-stat-card">
            <strong>{{ stats.total }}</strong>
            <span>{{ t("iot.devices.stats-total") }}</span>
          </article>
          <article class="iot-stat-card iot-stat-card--online">
            <strong>{{ stats.online }}</strong>
            <span>{{ t("iot.devices.stats-online") }}</span>
          </article>
          <article class="iot-stat-card iot-stat-card--offline">
            <strong>{{ stats.offline }}</strong>
            <span>{{ t("iot.devices.stats-offline") }}</span>
          </article>
        </div>

        <div class="iot-device-grid">
          <article
              v-for="device in devices"
              :key="device.id"
              class="iot-device-card"
              :class="{ 'iot-device-card--selected': isSelected(device) }"
              @click="onSelectDevice(device)"
          >
            <div class="iot-device-card__head">
              <div>
                <h3 class="iot-device-card__name">{{ device.name }}</h3>
                <p class="iot-device-card__type">{{ device.type }}</p>
              </div>
              <div class="iot-device-card__actions">
                <span
                    class="iot-status-pill"
                    :class="`iot-status-pill--${getDeviceStatusKey(device.status)}`"
                >
                  {{ device.status }}
                </span>
                <pv-button
                    type="button"
                    icon="pi pi-trash"
                    class="delete-button"
                    severity="danger"
                    text
                    rounded
                    :aria-label="t('iot.devices.delete')"
                    @click.stop="confirmRemoveDevice(device)"
                />
              </div>
            </div>
            <p class="iot-meta">
              {{ t("iot.devices.last-seen") }}:
              {{ formatRelativeTime(device.lastSeen) }}
            </p>
            <p v-if="device.expeditionId" class="iot-meta">
              {{ t("iot.devices.expedition") }}: {{ device.expeditionId }}
            </p>
          </article>
        </div>

        <section v-if="selectedDevice" class="iot-info-card">
          <h3>{{ t("iot.devices.selected-title") }}</h3>
          <p class="iot-meta">
            <strong>{{ selectedDevice.name }}</strong> · {{ selectedDevice.type }}
          </p>
          <p class="iot-meta">
            {{ t("iot.devices.status") }}:
            <span
                class="iot-status-pill"
                :class="`iot-status-pill--${getDeviceStatusKey(selectedDevice.status)}`"
            >
              {{ selectedDevice.status }}
            </span>
          </p>
          <div class="iot-dashboard-actions" style="margin-top: 14px">
            <pv-button
                :label="t('iot.devices.view-readings')"
                class="iot-primary-button"
                icon="pi pi-arrow-right"
                @click="goToReadings"
            />
            <pv-button
                type="button"
                :label="t('iot.devices.delete')"
                class="delete-button"
                icon="pi pi-trash"
                severity="danger"
                outlined
                :loading="loading"
                @click.stop="confirmRemoveDevice(selectedDevice)"
            />
          </div>
        </section>
      </template>

      <div v-else class="iot-empty">
        <p>{{ t("iot.devices.empty") }}</p>
        <pv-button
            :label="t('iot.devices.add')"
            class="iot-primary-button"
            icon="pi pi-plus"
            style="margin-top: 12px"
            @click="toggleAddForm"
        />
      </div>

      <div v-if="errors.length" class="monitoring-error">
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </IotPanel>
</template>
