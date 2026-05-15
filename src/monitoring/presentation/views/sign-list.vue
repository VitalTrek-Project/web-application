<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import MonitoringPanel from "../components/monitoring-panel.vue";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useMonitoringStore();
const { signs, errors, signsLoaded, tourists } = storeToRefs(store);
const { fetchSigns, deleteSign, fetchTourists } = store;

const navigateToNew = () =>
  router.push({ name: "monitoring-sign-new" });

const navigateToEdit = (id) =>
  router.push({ name: "monitoring-sign-edit", params: { id } });

const confirmDelete = (sign) => {
  confirm.require({
    message: t("signs.confirm-delete"),
    header: t("signs.delete-header"),
    icon: "pi pi-exclamation-triangle",
    accept: () => deleteSign(sign)
  });
};

onMounted(() => {
  if (!tourists.value.length) fetchTourists();
  if (!signsLoaded.value) fetchSigns();
});
</script>

<template>
  <MonitoringPanel>
    <div class="monitoring-card">
      <div class="monitoring-card-header">
        <div>
          <h2>{{ t("signs.title") }}</h2>
          <p>{{ t("signs.list-description") }}</p>
        </div>
        <pv-button
            :label="t('signs.new')"
            class="monitoring-primary-button"
            icon="pi pi-plus"
            @click="navigateToNew"
        />
      </div>

      <pv-data-table
          :loading="!signsLoaded"
          :rows="8"
          :rows-per-page-options="[8, 16, 24]"
          :value="signs"
          class="monitoring-table-mock"
          paginator
          table-style="width: 100%; table-layout: fixed"
      >
        <pv-column
            :header="t('signs.expedition-id')"
            field="expeditionId"
            sortable
        />
        <pv-column
            :header="t('signs.tourist-id')"
            field="touristId"
            sortable
        />
        <pv-column
            :header="t('signs.heart-rate')"
            field="heartRate"
            sortable
        />
        <pv-column
            :header="t('signs.blood-oxygen')"
            field="bloodOxygen"
            sortable
        />
        <pv-column
            :header="t('signs.body-temperature')"
            field="bodyTemperature"
            sortable
        />
        <pv-column :header="t('signs.steps')" field="steps" sortable />
        <pv-column
            :header="t('signs.recorded-at')"
            field="recordedAt"
            sortable
        />

        <pv-column :header="t('signs.actions')" style="width: 96px">
          <template #body="slotProps">
            <div class="table-actions">
              <pv-button
                  icon="pi pi-pencil"
                  rounded
                  text
                  class="edit-button"
                  @click="navigateToEdit(slotProps.data.id)"
              />
              <pv-button
                  icon="pi pi-trash"
                  rounded
                  text
                  class="delete-button"
                  @click="confirmDelete(slotProps.data)"
              />
            </div>
          </template>
        </pv-column>
      </pv-data-table>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </MonitoringPanel>
</template>
