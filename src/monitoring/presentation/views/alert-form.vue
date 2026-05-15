<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { Alert } from "../../domain/model/alert.entity.js";
import MonitoringPanel from "../components/monitoring-panel.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMonitoringStore();
const { errors, tourists } = storeToRefs(store);
const { addAlert, updateAlert, fetchTourists, fetchAlerts, getAlertById } = store;

const form = ref({
  touristId: null,
  expeditionId: null,
  type: "",
  severity: "",
  status: "",
  message: "",
  raisedAt: ""
});

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (!tourists.value.length) {
    await fetchTourists();
  }
  if (!store.alertsLoaded) {
    await fetchAlerts();
  }
  if (isEdit.value) {
    const alert = getAlertById(route.params.id);
    if (alert) {
      form.value.touristId = alert.touristId;
      form.value.expeditionId = alert.expeditionId;
      form.value.type = alert.type;
      form.value.severity = alert.severity;
      form.value.status = alert.status;
      form.value.message = alert.message;
      form.value.raisedAt = alert.raisedAt;
    } else {
      navigateBack();
    }
  }
});

const navigateBack = () => router.push({ name: "monitoring-alert" });

const saveAlert = () => {
  const alert = new Alert({
    id: isEdit.value ? route.params.id : null,
    touristId: form.value.touristId,
    expeditionId: form.value.expeditionId,
    type: form.value.type,
    severity: form.value.severity,
    status: form.value.status,
    message: form.value.message,
    raisedAt: form.value.raisedAt
  });
  if (isEdit.value) {
    updateAlert(alert);
  } else {
    addAlert(alert);
  }
  navigateBack();
};
</script>

<template>
  <MonitoringPanel>
    <div class="monitoring-card">
      <div class="monitoring-dashboard-header">
        <div>
          <h2 class="monitoring-section-title">
            {{ isEdit ? t("alert.edit-title") : t("alert.new-title") }}
          </h2>
          <p class="monitoring-meta">{{ t("alerts.subtitle") }}</p>
        </div>
      </div>

      <section class="monitoring-info-card">
      <form class="bc-form monitoring-form-fields" @submit.prevent="saveAlert">
        <div class="bc-form-field">
          <label for="tourist">{{ t("alerts.touristId") }}</label>
          <pv-select
              id="tourist"
              v-model="form.touristId"
              :options="tourists"
              option-label="fullName"
              option-value="id"
              :placeholder="t('sign.tourist')"
              class="w-full"
          />
        </div>
        <div class="bc-form-field">
          <label for="expeditionId">{{ t("alerts.expeditionId") }}</label>
          <pv-input-text id="expeditionId" v-model="form.expeditionId" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="type">{{ t("alerts.type") }}</label>
          <pv-input-text id="type" v-model="form.type" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="severity">{{ t("alerts.severity") }}</label>
          <pv-input-text id="severity" v-model="form.severity" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="status">{{ t("alerts.status") }}</label>
          <pv-input-text id="status" v-model="form.status" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="message">{{ t("alerts.message") }}</label>
          <pv-textarea id="message" v-model="form.message" rows="3" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="raisedAt">{{ t("alerts.raisedAt") }}</label>
          <pv-input-text id="raisedAt" v-model="form.raisedAt" class="w-full" />
        </div>

        <div class="bc-form-actions">
          <pv-button
              type="button"
              :label="t('alert.cancel')"
              severity="secondary"
              outlined
              @click="navigateBack"
          />
          <pv-button
              type="submit"
              :label="t('alert.save')"
              class="monitoring-primary-button"
              icon="pi pi-save"
          />
        </div>
      </form>
      </section>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </MonitoringPanel>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-select) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-textarea:enabled:focus),
:deep(.p-select:not(.p-disabled).p-focus) {
  border-color: #ff7a30;
  box-shadow: 0 0 0 1px rgba(255, 122, 48, 0.25);
}

:deep(.p-select-label),
:deep(.p-select-dropdown) {
  color: #ffffff;
}
</style>
