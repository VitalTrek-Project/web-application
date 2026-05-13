<script setup>

import { toRefs } from "vue";

import { useI18n } from "vue-i18n";

import useTourManagementStore
  from "../../application/tour-management.store.js";

const { t } = useI18n();

const store = useTourManagementStore();

const {
  assignedTourists,
  errors
} = toRefs(store);

const {
  assignTourist,
  unassignTourist
} = store;

/**
 * Component props.
 */
const props = defineProps({

  /**
   * Current tour identifier.
   */
  tourId: {
    type: Number,
    required: true
  },

  /**
   * Available tourists to assign.
   */
  availableTourists: {
    type: Array,
    required: true
  }
});

/**
 * Determines whether a tourist is already assigned.
 *
 * @param {number|string} touristId
 *
 * @returns {boolean}
 */
const isAssigned = (touristId) => {

  return assignedTourists.value.includes(
      touristId
  );
};

/**
 * Assigns a tourist to current tour.
 *
 * @param {number|string} touristId
 */
const handleAssign = (touristId) => {

  assignTourist(
      props.tourId,
      touristId
  );
};

/**
 * Unassigns a tourist from current tour.
 *
 * @param {number|string} touristId
 */
const handleUnassign = (touristId) => {

  unassignTourist(
      props.tourId,
      touristId
  );
};

</script>

<template>

  <div class="p-4">

    <h2 class="mb-3">

      {{ t('tourists.assignment-title') }}

    </h2>

    <pv-data-table
        :value="availableTourists"
        striped-rows
        table-style="min-width: 40rem"
    >

      <pv-column
          field="id"
          :header="t('tourists.id')"
      />

      <pv-column
          field="name"
          :header="t('tourists.name')"
      />

      <pv-column
          field="email"
          :header="t('tourists.email')"
      />

      <pv-column
          :header="t('tourists.actions')"
      >

        <template #body="slotProps">

          <div class="flex gap-2">

            <pv-button
                v-if="!isAssigned(slotProps.data.id)"
                :label="t('tourists.assign')"
                icon="pi pi-user-plus"
                size="small"
                @click="handleAssign(slotProps.data.id)"
            />

            <pv-button
                v-else
                :label="t('tourists.unassign')"
                icon="pi pi-user-minus"
                severity="danger"
                size="small"
                @click="handleUnassign(slotProps.data.id)"
            />

          </div>

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

  </div>

</template>

<style scoped>

</style>