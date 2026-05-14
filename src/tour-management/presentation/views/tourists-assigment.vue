<script setup>
import { computed, onMounted, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";

import useTourManagementStore
  from "../../application/tourManagement.store.js";

const { t } = useI18n();

const store = useTourManagementStore();

const {
  tours,
  tourists,
  errors,
  toursLoaded,
  touristsLoaded
} = toRefs(store);

const {
  fetchTours,
  fetchTourists,
  assignTourist,
  unassignTourist,
  changeTouristTour
} = store;

const selectedTourByTourist = ref({});

const tourOptions = computed(() =>
    tours.value.map(tour => ({
      label: tour.title,
      value: tour.id
    }))
);

const getTourAssignedToTourist = (touristId) => {

  return tours.value.find(tour => {

    const assignedTourists =
        Array.isArray(tour.assignedTourists)
            ? tour.assignedTourists
            : [];

    return assignedTourists.some(
        id => String(id) === String(touristId)
    );
  });
};

const getTouristAssignmentText = (touristId) => {

  const assignedTour =
      getTourAssignedToTourist(touristId);

  return assignedTour
      ? assignedTour.title
      : t('tourists.not-assigned');
};

const handleAssignOrChange = async (touristId) => {

  const newTourId =
      selectedTourByTourist.value[touristId];

  if (!newTourId) return;

  const currentTour =
      getTourAssignedToTourist(touristId);

  if (!currentTour) {

    await assignTourist(newTourId, touristId);
    return;
  }

  if (String(currentTour.id) === String(newTourId)) {
    return;
  }

  await changeTouristTour(
      currentTour.id,
      newTourId,
      touristId
  );
};

const handleUnassign = async (touristId) => {

  const currentTour =
      getTourAssignedToTourist(touristId);

  if (!currentTour) return;

  await unassignTourist(
      currentTour.id,
      touristId
  );

  selectedTourByTourist.value[touristId] = null;
};

onMounted(async () => {

  if (!toursLoaded.value) {
    await fetchTours();
  }

  if (!touristsLoaded.value) {
    await fetchTourists();
  }
});
</script>

<template>
  <section class="tourists-page">
    <div class="tour-tabs">
      <router-link to="/tours" class="tour-tab">
        {{ t('tour.tabs.list') }}
      </router-link>

      <router-link to="/tours/new" class="tour-tab">
        {{ t('tour.tabs.form') }}
      </router-link>

      <router-link to="/tourists-assignment" class="tour-tab active">
        {{ t('tour.tabs.assign-tourists') }}
      </router-link>
    </div>

    <div class="tourists-card">
      <div class="tourists-card-header">
        <div>
          <h2>{{ t('tourists.assignment-title') }}</h2>
          <p>{{ t('tourists.assignment-description') }}</p>
        </div>
      </div>

      <pv-data-table
          :value="tourists"
          :loading="!touristsLoaded || !toursLoaded"
          paginator
          :rows="5"
          :rows-per-page-options="[5, 10, 20]"
          table-style="min-width: 100%"
      >
        <pv-column
            field="id"
            :header="t('tourists.id')"
        />

        <pv-column
            :header="t('tourists.name')"
        >
          <template #body="slotProps">
            {{ slotProps.data.fullName || slotProps.data.name }}
          </template>
        </pv-column>

        <pv-column
            field="email"
            :header="t('tourists.email')"
        />

        <pv-column
            :header="t('tourists.current-tour')"
        >
          <template #body="slotProps">
            {{ getTouristAssignmentText(slotProps.data.id) }}
          </template>
        </pv-column>

        <pv-column
            :header="t('tourists.select-tour')"
        >
          <template #body="slotProps">
            <pv-select
                v-model="selectedTourByTourist[slotProps.data.id]"
                :options="tourOptions"
                option-label="label"
                option-value="value"
                :placeholder="t('tourists.select-tour-placeholder')"
                class="tour-select"
            />
          </template>
        </pv-column>

        <pv-column
            :header="t('tourists.actions')"
        >
          <template #body="slotProps">
            <div class="assignment-actions">
              <pv-button
                  :label="getTourAssignedToTourist(slotProps.data.id) ? t('tourists.change') : t('tourists.assign')"
                  icon="pi pi-user-plus"
                  size="small"
                  class="assign-button"
                  @click="handleAssignOrChange(slotProps.data.id)"
              />

              <pv-button
                  v-if="getTourAssignedToTourist(slotProps.data.id)"
                  :label="t('tourists.unassign')"
                  icon="pi pi-user-minus"
                  severity="danger"
                  size="small"
                  outlined
                  @click="handleUnassign(slotProps.data.id)"
              />
            </div>
          </template>
        </pv-column>
      </pv-data-table>

      <div
          v-if="errors.length"
          class="error-message"
      >
        {{ t('errors.occurred') }}:
        {{ errors.map(e => e.message).join(', ') }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.tourists-page {
  width: min(1080px, 100%);
  margin: 0 auto;
  text-align: left;
}

.tour-tabs {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 12px;
  padding-left: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.tour-tab {
  position: relative;
  color: #aab6c5;
  text-decoration: none;
  font-size: 0.78rem;
  padding: 0 0 12px;
  white-space: nowrap;
}

.tour-tab.active {
  color: #f26a3d;
  font-weight: 700;
}

.tour-tab.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #f26a3d;
  border-radius: 999px;
}

.tourists-card {
  background: #33465f;
  border: 1px solid rgba(185, 198, 216, 0.16);
  border-radius: 10px;
  padding: 24px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.16);
}

.tourists-card-header {
  margin-bottom: 24px;
}

.tourists-card-header h2 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.2rem;
  margin: 0 0 6px;
}

.tourists-card-header p {
  color: #d0d9e6;
  font-size: 0.78rem;
  line-height: 1.5;
  margin: 0;
}

.tour-select {
  width: 210px;
}

.assignment-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.assign-button {
  background: #f26a3d;
  border-color: #f26a3d;
}

.error-message {
  margin-top: 16px;
  color: #fecaca;
  font-size: 0.8rem;
}

:deep(.p-datatable),
:deep(.p-datatable-table) {
  background: #33465f;
  color: #ffffff;
}

:deep(.p-datatable-thead > tr > th) {
  background: #3b506b;
  color: #e7eef8;
  border-color: rgba(220, 229, 241, 0.12);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 13px 12px;
}

:deep(.p-datatable-tbody > tr > td) {
  background: #33465f;
  color: #ffffff;
  border-color: rgba(220, 229, 241, 0.1);
  padding: 13px 12px;
}

:deep(.p-datatable-tbody > tr:hover > td) {
  background: #3a4f69;
}

:deep(.p-select),
:deep(.p-inputtext) {
  background: #3b506b;
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-select-label),
:deep(.p-select-dropdown) {
  color: #ffffff;
}

:deep(.p-paginator) {
  background: #33465f;
  border-color: rgba(220, 229, 241, 0.1);
  color: #ffffff;
}

@media (max-width: 800px) {
  .tour-tabs {
    overflow-x: auto;
    gap: 18px;
    padding-left: 4px;
  }

  .tourists-card {
    padding: 16px;
  }

  .tour-select {
    width: 100%;
  }
}
</style>