<script setup>

import { onMounted, toRefs } from "vue";

import { useRouter } from "vue-router";

import { useI18n } from "vue-i18n";

import { useConfirm } from "primevue/useconfirm";

import useTourManagementStore
  from "../../application/tour-management.store.js";

const { t } = useI18n();

const router = useRouter();

const confirm = useConfirm();

const store = useTourManagementStore();

const {
  tours,
  errors,
  toursLoaded
} = toRefs(store);

const {
  fetchTours,
  deleteTour
} = store;

/**
 * Navigates to the tour creation route.
 */
const navigateToNew = () =>
    router.push({
      name: 'tour-management-tour-new'
    });

/**
 * Navigates to the tour edit route.
 *
 * @param {number|string} id
 */
const navigateToEdit = (id) =>
    router.push({
      name: 'tour-management-tour-edit',
      params: { id }
    });

/**
 * Requests user confirmation before deleting a tour.
 *
 * @param {import('../../domain/model/tour.entity.js').Tour} tour
 */
const confirmDelete = (tour) => {

  confirm.require({

    message: t(
        'tours.confirm-delete',
        { title: tour.title }
    ),

    header: t('tours.delete-header'),

    icon: 'pi pi-exclamation-triangle',

    accept: () => deleteTour(tour.id)
  });
};

onMounted(() => {

  if (!store.toursLoaded) {

    fetchTours();

    toursLoaded.value = store.toursLoaded;
  }
});

</script>

<template>

  <div class="p-4">

    <h1>{{ t('tours.title') }}</h1>

    <pv-button
        :label="t('tours.new')"
        class="mb-3"
        icon="pi pi-plus"
        @click="navigateToNew"
    />

    <pv-data-table
        :loading="!toursLoaded"
        :rows="5"
        :rows-per-page-options="[5,10,20]"
        :value="tours"
        paginator
        striped-rows
        table-style="min-width: 50rem"
    >

      <pv-column
          field="id"
          :header="t('tours.id')"
          sortable
      />

      <pv-column
          field="title"
          :header="t('tours.title-column')"
          sortable
      />

      <pv-column
          field="difficulty"
          :header="t('tours.difficulty')"
          sortable
      />

      <pv-column
          field="status"
          :header="t('tours.status')"
          sortable
      />

      <pv-column
          field="capacity"
          :header="t('tours.capacity')"
          sortable
      />

      <pv-column
          :header="t('tours.actions')"
      >

        <template #body="slotProps">

          <pv-button
              icon="pi pi-pencil"
              rounded
              text
              @click="navigateToEdit(slotProps.data.id)"
          />

          <pv-button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              @click="confirmDelete(slotProps.data)"
          />

        </template>

      </pv-column>

    </pv-data-table>

    <div
        v-if="errors.length"
        class="text-red-500 mt-3"
    >

      {{ t('errors.occurred') }}:
      {{ errors.map(e => e.message).join(', ') }}

    </div>

    <pv-confirm-dialog />

  </div>

</template>

<style scoped>

</style>