<script setup>
import { onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useTourManagementStore from "../../application/tourManagement.store.js";
import TourPanel from "../components/tour-panel.vue";

const { t } = useI18n();
const router = useRouter();
const store = useTourManagementStore();

const { tours, errors, toursLoaded } = toRefs(store);
const { fetchTours } = store;

const navigateToNew = () =>
  router.push({ name: "tour-management-tour-new" });

const navigateToEdit = (event) => {
  const tour = event.data;
  if (tour?.id != null) {
    router.push({ name: "tour-management-tour-edit", params: { id: tour.id } });
  }
};

const getGuideLabel = (tour) => {
  if (tour.guide) return tour.guide;
  if (tour.guideName) return tour.guideName;
  if (tour.agencyId) return `${t("tours.guide-prefix")} ${tour.agencyId}`;
  return "—";
};

const getStatusKey = (status) => {
  const value = String(status ?? "").toLowerCase();
  if (value === "published" || value === "available") return "published";
  if (value === "draft") return "draft";
  if (value === "full" || value === "unavailable") return "neutral";
  return "neutral";
};

const translateStatus = (status) => {
  const key = getStatusKey(status);
  if (key === "published") return t("tour.status.published");
  if (key === "draft") return t("tour.status.draft");
  const raw = String(status ?? "").toLowerCase();
  const translated = t(`tour.status.${raw}`);
  return translated === `tour.status.${raw}` ? status : translated;
};

onMounted(() => {
  fetchTours();
});
</script>

<template>
  <TourPanel>
    <div class="tour-card">
      <div class="tour-card-header">
        <h2>{{ t("tour.title") }}</h2>
        <pv-button
            :label="t('tour.new')"
            class="tour-primary-button"
            @click="navigateToNew"
        />
      </div>

      <pv-data-table
          :loading="!toursLoaded"
          :value="tours"
          class="tour-table-mock"
          :rows="8"
          paginator
          :rows-per-page-options="[8, 16, 24]"
          table-style="width: 100%; table-layout: fixed"
          @row-click="navigateToEdit"
      >
        <pv-column
            :header="t('tours.tour-column')"
            header-class="col-tour"
            body-class="col-tour"
            style="width: 46%"
        >
          <template #body="slotProps">
            <span class="tour-name-cell">{{ slotProps.data.title }}</span>
          </template>
        </pv-column>

        <pv-column
            :header="t('tours.guide-column')"
            header-class="col-guide"
            body-class="col-guide"
            style="width: 34%"
        >
          <template #body="slotProps">
            <span class="tour-guide-cell">{{ getGuideLabel(slotProps.data) }}</span>
          </template>
        </pv-column>

        <pv-column
            :header="t('tours.state-column')"
            header-class="col-state"
            body-class="col-state"
            style="width: 20%"
        >
          <template #body="slotProps">
            <span
                class="status-pill"
                :class="`status-pill--${getStatusKey(slotProps.data.status)}`"
            >
              {{ translateStatus(slotProps.data.status) }}
            </span>
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
.tour-error {
  margin-top: 16px;
  color: #fecaca;
  font-size: 0.8rem;
}

:deep(.tour-table-mock .p-datatable-table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.col-tour),
:deep(.col-guide),
:deep(.col-state) {
  text-align: left;
  vertical-align: middle;
}

:deep(.col-state) {
  width: 20%;
}

:deep(.col-state .status-pill) {
  display: inline-flex;
}

:deep(.p-paginator) {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding-top: 20px;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: #ff7a30;
  color: #0f1419;
}
</style>
