<script setup>
import { computed, onMounted, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";

import useTourManagementStore
  from "../../application/tourManagement.store.js";
import TourPanel from "../components/tour-panel.vue";

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
  tours.value.map((tour) => ({
    label: tour.title,
    value: tour.id
  }))
);

const getTourAssignedToTourist = (touristId) => {
  return tours.value.find((tour) => {
    const assignedTourists = Array.isArray(tour.assignedTourists)
      ? tour.assignedTourists
      : [];
    return assignedTourists.some(
      (id) => String(id) === String(touristId)
    );
  });
};

const getTouristAssignmentText = (touristId) => {
  const assignedTour = getTourAssignedToTourist(touristId);
  return assignedTour
    ? assignedTour.title
    : t("tourists.not-assigned");
};

const handleAssignOrChange = async (touristId) => {
  const newTourId = selectedTourByTourist.value[touristId];
  if (!newTourId) return;

  const currentTour = getTourAssignedToTourist(touristId);

  if (!currentTour) {
    await assignTourist(newTourId, touristId);
    return;
  }

  if (String(currentTour.id) === String(newTourId)) {
    return;
  }

  await changeTouristTour(currentTour.id, newTourId, touristId);
};

const handleUnassign = async (touristId) => {
  const currentTour = getTourAssignedToTourist(touristId);
  if (!currentTour) return;

  await unassignTourist(currentTour.id, touristId);
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
  <TourPanel>
    <div class="tour-card tourists-assignment">
      <header class="tourists-card-header">
        <h2>{{ t("tourists.assignment-title") }}</h2>
        <p>{{ t("tourists.assignment-description") }}</p>
      </header>

      <pv-data-table
          :value="tourists"
          :loading="!touristsLoaded || !toursLoaded"
          class="tour-table-assignment"
          paginator
          :rows="5"
          :rows-per-page-options="[5, 10, 20]"
          table-style="min-width: 100%"
      >
        <pv-column field="id" :header="t('tourists.id')" />

        <pv-column :header="t('tourists.name')">
          <template #body="slotProps">
            <span class="tourist-name">
              {{ slotProps.data.fullName || slotProps.data.name }}
            </span>
          </template>
        </pv-column>

        <pv-column field="email" :header="t('tourists.email')">
          <template #body="slotProps">
            <span class="tourist-email">{{ slotProps.data.email }}</span>
          </template>
        </pv-column>

        <pv-column :header="t('tourists.current-tour')">
          <template #body="slotProps">
            <span
                class="current-tour"
                :class="{
                  'current-tour--assigned': getTourAssignedToTourist(
                    slotProps.data.id
                  )
                }"
            >
              {{ getTouristAssignmentText(slotProps.data.id) }}
            </span>
          </template>
        </pv-column>

        <pv-column :header="t('tourists.select-tour')">
          <template #body="slotProps">
            <pv-select
                v-model="selectedTourByTourist[slotProps.data.id]"
                :options="tourOptions"
                option-label="label"
                option-value="value"
                :placeholder="t('tourists.select-tour-placeholder')"
                class="tour-select-field"
            />
          </template>
        </pv-column>

        <pv-column :header="t('tourists.actions')">
          <template #body="slotProps">
            <div class="assignment-actions">
              <pv-button
                  :label="
                    getTourAssignedToTourist(slotProps.data.id)
                      ? t('tourists.change')
                      : t('tourists.assign')
                  "
                  icon="pi pi-user-plus"
                  size="small"
                  class="assign-action-btn"
                  @click="handleAssignOrChange(slotProps.data.id)"
              />

              <pv-button
                  v-if="getTourAssignedToTourist(slotProps.data.id)"
                  :label="t('tourists.unassign')"
                  icon="pi pi-user-minus"
                  severity="danger"
                  size="small"
                  outlined
                  class="unassign-action-btn"
                  @click="handleUnassign(slotProps.data.id)"
              />
            </div>
          </template>
        </pv-column>
      </pv-data-table>

      <div v-if="errors.length" class="tour-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </TourPanel>
</template>

<style scoped>
.tourists-card-header {
  margin-bottom: 24px;
}

.tourists-card-header h2 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.tourists-card-header p {
  color: #94a3b8;
  font-size: 0.8rem;
  line-height: 1.55;
  margin: 0;
  max-width: 520px;
}

.tourist-name {
  font-weight: 600;
  color: #f1f5f9;
}

.tourist-email {
  color: #cbd5e1;
  font-size: 0.82rem;
}

.current-tour {
  color: #94a3b8;
  font-size: 0.82rem;
}

.current-tour--assigned {
  color: #e2e8f0;
  font-weight: 500;
}

.tour-select-field {
  width: 100%;
  min-width: 200px;
  max-width: 240px;
}

.assignment-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.assign-action-btn {
  background: #ff7a30 !important;
  border: none !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 0.76rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  box-shadow: 0 0 18px rgba(255, 122, 48, 0.45);
}

.assign-action-btn:hover {
  background: #ff8f4f !important;
  filter: brightness(1.05);
}

.unassign-action-btn {
  font-size: 0.74rem;
  font-weight: 600;
}

.tour-error {
  margin-top: 16px;
  color: #fecaca;
  font-size: 0.8rem;
}

:deep(.tour-table-assignment .p-datatable-thead > tr > th) {
  background: transparent;
  color: #94a3b8;
  border: none;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 12px 14px 14px;
}

:deep(.tour-table-assignment .p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  padding: 14px;
  font-size: 0.82rem;
  color: #f1f5f9;
}

:deep(.tour-table-assignment .p-datatable-tbody > tr:nth-child(odd) > td) {
  background: transparent;
}

:deep(.tour-table-assignment .p-datatable-tbody > tr:nth-child(even) > td) {
  background: rgba(255, 255, 255, 0.025);
}

:deep(.tour-table-assignment .p-datatable-tbody > tr:hover > td) {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.tour-table-assignment .p-datatable-table),
:deep(.tour-table-assignment .p-datatable) {
  background: transparent;
}

:deep(.tour-table-assignment .p-select),
:deep(.tour-table-assignment .p-select-label),
:deep(.tour-table-assignment .p-select-dropdown) {
  background: #1a2433;
  border-color: rgba(148, 163, 184, 0.22);
  color: #f1f5f9;
  font-size: 0.8rem;
}

:deep(.tour-table-assignment .p-paginator) {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding-top: 20px;
}

:deep(.tour-table-assignment .p-paginator .p-paginator-page),
:deep(.tour-table-assignment .p-paginator .p-paginator-first),
:deep(.tour-table-assignment .p-paginator .p-paginator-prev),
:deep(.tour-table-assignment .p-paginator .p-paginator-next),
:deep(.tour-table-assignment .p-paginator .p-paginator-last) {
  color: #94a3b8;
  min-width: 2rem;
  height: 2rem;
  border-radius: 999px;
}

:deep(.tour-table-assignment .p-paginator .p-paginator-page.p-highlight) {
  background: #14b8a6;
  color: #ffffff;
  border-color: #14b8a6;
}

:deep(.tour-table-assignment .p-paginator .p-select) {
  background: #1a2433;
  border-color: rgba(148, 163, 184, 0.2);
}

@media (max-width: 900px) {
  .tour-select-field {
    max-width: 100%;
  }
}
</style>
