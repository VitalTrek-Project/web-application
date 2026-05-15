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
const { alerts, errors, alertsLoaded, tourists } = storeToRefs(store);
const { fetchAlerts, deleteAlert, fetchTourists } = store;

const navigateToNew = () =>
  router.push({ name: "monitoring-alert-new" });

const navigateToEdit = (id) =>
  router.push({ name: "monitoring-alert-edit", params: { id } });

const confirmDelete = (alert) => {
  confirm.require({
    message: t("alerts.confirm-delete", { name: alert.touristId }),
    header: t("alerts.delete-header"),
    icon: "pi pi-exclamation-triangle",
    accept: () => deleteAlert(alert)
  });
};

onMounted(() => {
  if (!tourists.value.length) fetchTourists();
  if (!alertsLoaded.value) fetchAlerts();
});
</script>

<template>
  <MonitoringPanel>
    <div class="monitoring-card">
      <div class="monitoring-card-header">
        <div>
          <h2>{{ t("alerts.title") }}</h2>
          <p>{{ t("alerts.list-description") }}</p>
        </div>
        <pv-button
            :label="t('alerts.new')"
            class="monitoring-primary-button"
            icon="pi pi-plus"
            @click="navigateToNew"
        />
      </div>

      <pv-data-table
          :loading="!alertsLoaded"
          :rows="8"
          :rows-per-page-options="[8, 16, 24]"
          :value="alerts"
          class="monitoring-table-mock"
          paginator
          table-style="width: 100%; table-layout: fixed"
      >
        <pv-column :header="t('alerts.id')" field="id" sortable />
        <pv-column
            :header="t('alerts.touristId')"
            field="touristId"
            sortable
        />
        <pv-column
            :header="t('alerts.expeditionId')"
            field="expeditionId"
            sortable
        />
        <pv-column :header="t('alerts.type')" field="type" sortable />
        <pv-column
            :header="t('alerts.severity')"
            field="severity"
            sortable
        />
        <pv-column :header="t('alerts.message')" field="message" sortable />
        <pv-column :header="t('alerts.status')" field="status" sortable />
        <pv-column :header="t('alerts.raisedAt')" field="raisedAt" sortable />

        <pv-column :header="t('alerts.actions')" style="width: 96px">
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
