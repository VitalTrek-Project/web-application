<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import {onMounted, toRefs} from "vue";
import {useConfirm} from "primevue";

const {t} = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useMonitoringStore();
const { alerts, errors, alertsLoaded } = toRefs(store);
const { tourists, fetchAlerts, deleteAlert, fetchTourists } = store;

/** Navigates to the alert creation route. */
const navigateToNew = () => router.push({ name: 'monitoring-alert-new' });

/**
 * Navigates to the alert edit route.
 * @param {number|string} id - Alert identifier.
 */
const navigateToEdit = (id) => router.push({ name: 'monitoring-alert-edit', params: { id } });

/**
 * Asks for user confirmation before invoking the delete alert use case.
 * @param {import('../../../monitoring/domain/model/alert.entity.js').Alert} alert - Alert selected for deletion.
 */
const confirmDelete = (alert) => {
  confirm.require({
    message: t('alerts.confirm-delete', { name: alert.touristId }),
    header: t('alerts.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteAlert(alert)
  });
}

onMounted(() => {
  if (!tourists.length) fetchTourists();
  if (!store.alertsLoaded) {
    fetchAlerts();
    alertsLoaded.value = store.alertsLoaded;
  }
});

</script>

<template>
  <div class="p-4">
    <h1>{{ t('alerts.title')}}</h1>
    <pv-button :label="t('alerts.new')" class="mb-3" icon="pi pi-plus" @click="navigateToNew"/>
    <pv-data-table
        :loading="!alertsLoaded"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :value="alerts"
        paginator
        striped-rows
        table-style="min-width: 50rem">
      <pv-column :header="t('alerts.id')" field="id" sortable/>
      <pv-column :header="t('alerts.touristId')" field="touristId" sortable/>
      <pv-column :header="t('alerts.expeditionId')" field="expeditionId" sortable/>
      <pv-column :header="t('alerts.type')" field="type" sortable/>
      <pv-column :header="t('alerts.severity')" field="severity" sortable/>
      <pv-column :header="t('alerts.message')" field="message" sortable/>
      <pv-column :header="t('alerts.status')" field="status" sortable/>
      <pv-column :header="t('alerts.raisedAt')" field="raisedAt" sortable/>

      <pv-column :header="t('alerts.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-pencil" rounded text @click="navigateToEdit(slotProps.data.id)"/>
          <pv-button icon="pi pi-trash" rounded text @click="confirmDelete(slotProps.data)"/>
        </template>
      </pv-column>
    </pv-data-table>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{t('errors.occurred')}}: {{ errors.map(e => e.message).join(', ') }}
    </div>
    <pv-confirm-dialog/>
  </div>
</template>

<style scoped>

</style>]