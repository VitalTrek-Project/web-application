<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { Sign } from "../../domain/model/sign.entity.js";
import MonitoringPanel from "../components/monitoring-panel.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useMonitoringStore();
const { errors, tourists } = storeToRefs(store);
const { addSign, updateSign, fetchTourists, fetchSigns, getSignById } = store;

const form = ref({
  touristId: null,
  expeditionId: null,
  heartRate: null,
  bloodOxygen: null,
  bodyTemperature: null,
  steps: null,
  recordedAt: ""
});

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (!tourists.value.length) {
    await fetchTourists();
  }
  if (!store.signsLoaded) {
    await fetchSigns();
  }
  if (isEdit.value) {
    const sign = getSignById(route.params.id);
    if (sign) {
      form.value.touristId = sign.touristId;
      form.value.expeditionId = sign.expeditionId;
      form.value.heartRate = sign.heartRate;
      form.value.bloodOxygen = sign.bloodOxygen;
      form.value.bodyTemperature = sign.bodyTemperature;
      form.value.steps = sign.steps;
      form.value.recordedAt = sign.recordedAt;
    } else {
      navigateBack();
    }
  }
});

const navigateBack = () => router.push({ name: "monitoring-signs" });

const saveSign = () => {
  const sign = new Sign({
    id: isEdit.value ? route.params.id : null,
    touristId: form.value.touristId,
    expeditionId: form.value.expeditionId,
    heartRate: form.value.heartRate,
    bloodOxygen: form.value.bloodOxygen,
    bodyTemperature: form.value.bodyTemperature,
    steps: form.value.steps,
    recordedAt: form.value.recordedAt
  });
  isEdit.value ? updateSign(sign) : addSign(sign);
  navigateBack();
};
</script>

<template>
  <MonitoringPanel>
    <div class="monitoring-card">
      <div class="monitoring-dashboard-header">
        <div>
          <h2 class="monitoring-section-title">
            {{ isEdit ? t("sign.edit-title") : t("sign.new-title") }}
          </h2>
          <p class="monitoring-meta">{{ t("signs.subtitle") }}</p>
        </div>
      </div>

      <section class="monitoring-info-card">
      <form class="bc-form monitoring-form-fields" @submit.prevent="saveSign">
        <div class="bc-form-field">
          <label for="tourist">{{ t("sign.tourist") }}</label>
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
          <label for="expeditionId">{{ t("sign.expeditionId") }}</label>
          <pv-input-text
              id="expeditionId"
              v-model="form.expeditionId"
              required
              class="w-full"
          />
        </div>
        <div class="bc-form-field">
          <label for="heartRate">{{ t("sign.heartRate") }}</label>
          <pv-input-text
              id="heartRate"
              v-model="form.heartRate"
              required
              class="w-full"
          />
        </div>
        <div class="bc-form-field">
          <label for="bloodOxygen">{{ t("sign.bloodOxygen") }}</label>
          <pv-textarea
              id="bloodOxygen"
              v-model="form.bloodOxygen"
              rows="3"
              class="w-full"
          />
        </div>
        <div class="bc-form-field">
          <label for="bodyTemperature">{{ t("sign.bodyTemperature") }}</label>
          <pv-textarea
              id="bodyTemperature"
              v-model="form.bodyTemperature"
              rows="3"
              class="w-full"
          />
        </div>
        <div class="bc-form-field">
          <label for="steps">{{ t("sign.steps") }}</label>
          <pv-textarea id="steps" v-model="form.steps" rows="3" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="recordedAt">{{ t("sign.recordedAt") }}</label>
          <pv-input-text id="recordedAt" v-model="form.recordedAt" class="w-full" />
        </div>

        <div class="bc-form-actions">
          <pv-button
              type="button"
              :label="t('sign.cancel')"
              severity="secondary"
              outlined
              @click="navigateBack"
          />
          <pv-button
              type="submit"
              :label="t('sign.save')"
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
