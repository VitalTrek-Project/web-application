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
const { signs, errors, signsLoaded } = toRefs(store);
const { fetchSigns, deleteSign } = store;

/** Navigates to the sign creation route. */
const navigateToNew = () => router.push({ name: 'monitoring-sign-new' });

/**
 * Navigates to the sign edit route.
 * @param {number|string} id - Sign identifier.
 */
const navigateToEdit = (id) => router.push({ name: 'monitoring-sign-edit', params: { id } });

/**
 * Asks for user confirmation before invoking the delete sign use case.
 * @param {import('../../../monitoring/domain/model/sign.entity.js').Sign} sign - Sign selected for deletion.
 */
const confirmDelete = (sign) => {
  confirm.require({
    message: t('signs.confirm-delete', { name: sign.touristId }),
    header: t('signs.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteSign(sign)
  });
}

onMounted(() => {
  if (!store.signsLoaded) {
    fetchSigns();
    signsLoaded.value = store.signsLoaded;
  }
});

</script>

<template>
  <div class="p-4">
    <h1>{{ t('signs.title')}}</h1>
    <pv-button :label="t('signs.new')" class="mb-3" icon="pi pi-plus" @click="navigateToNew"/>
    <pv-data-table
        :loading="!signsLoaded"
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :value="signs"
        paginator
        striped-rows
        table-style="min-width: 50rem">
      <pv-column :header="t('signs.expedition-id')" field="expeditionId" sortable/>
      <pv-column :header="t('signs.tourist-id')" field="touristId" sortable/>
      <pv-column :header="t('signs.heart-rate')" field="heartRate" sortable/>
      <pv-column :header="t('signs.blood-oxygen')" field="bloodOxygen" sortable/>
      <pv-column :header="t('signs.body-temperature')" field="bodyTemperature" sortable/>
      <pv-column :header="t('signs.steps')" field="steps" sortable/>
      <pv-column :header="t('signs.recorded-at')" field="recordedAt" sortable/>

      <pv-column :header="t('signs.actions')">
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