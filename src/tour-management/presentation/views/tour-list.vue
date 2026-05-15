<script setup>
import { computed, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useTourManagementStore from "../../application/tourManagement.store.js";
import TourPanel from "../components/tour-panel.vue";
import { useBcSearch } from "../../../shared/presentation/composables/use-bc-search.js";
import {
  getTourStatusKey,
  summarizeTourStats
} from "../utils/tour-presenter.js";

const { t } = useI18n();
const router = useRouter();
const store = useTourManagementStore();

const { tours, errors, toursLoaded } = toRefs(store);
const { fetchTours } = store;
const { filteredItems: filteredTours } = useBcSearch(tours);

const stats = computed(() => summarizeTourStats(tours.value));

const navigateToNew = () =>
  router.push({ name: "tour-management-tour-new" });

const navigateToEdit = (tour) => {
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

const translateStatus = (status) => {
  const key = getTourStatusKey(status);
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
      <div class="tour-dashboard-header">
        <div>
          <h2 class="tour-section-title">{{ t("tour.title") }}</h2>
          <p class="tour-meta">{{ t("tour.subtitle") }}</p>
        </div>
        <div class="tour-dashboard-actions">
          <pv-button
              :label="t('tour.new')"
              class="tour-primary-button"
              icon="pi pi-plus"
              @click="navigateToNew"
          />
        </div>
      </div>

      <div v-if="toursLoaded && tours.length" class="tour-stats-row">
        <article class="tour-stat-card">
          <strong>{{ stats.total }}</strong>
          <span>{{ t("tour.stats-total") }}</span>
        </article>
        <article class="tour-stat-card tour-stat-card--teal">
          <strong>{{ stats.published }}</strong>
          <span>{{ t("tour.stats-published") }}</span>
        </article>
        <article class="tour-stat-card tour-stat-card--muted">
          <strong>{{ stats.draft }}</strong>
          <span>{{ t("tour.stats-draft") }}</span>
        </article>
      </div>

      <section class="tour-info-card monitoring-info-card--table">
        <div class="tour-table-scroll">
          <pv-data-table
            :loading="!toursLoaded"
            :value="filteredTours"
            class="tour-table-mock"
            :rows="8"
            paginator
            :rows-per-page-options="[8, 16, 24]"
            table-style="width: 100%; table-layout: fixed"
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
              style="width: 18%"
          >
            <template #body="slotProps">
              <span
                  class="status-pill"
                  :class="`status-pill--${getTourStatusKey(slotProps.data.status)}`"
              >
                {{ translateStatus(slotProps.data.status) }}
              </span>
            </template>
          </pv-column>

          <pv-column :header="t('tours.actions')" style="width: 72px">
            <template #body="slotProps">
              <pv-button
                  icon="pi pi-pencil"
                  rounded
                  text
                  class="edit-button"
                  :aria-label="t('tour.form.edit-title')"
                  @click="navigateToEdit(slotProps.data)"
              />
            </template>
          </pv-column>
          </pv-data-table>
        </div>
      </section>

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
  padding: 16px 20px 20px;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: #ff7a30 !important;
  color: #0f1419 !important;
  border-color: #ff7a30 !important;
}
</style>
