<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useMonitoringStore from "../../application/monitoring.store.js";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import MonitoringPanel from "../components/monitoring-panel.vue";
import { useBcSearch } from "../../../shared/presentation/composables/use-bc-search.js";
import {
  formatMonitoringDate,
  summarizeSignStats
} from "../utils/monitoring-presenter.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useMonitoringStore();
const { signs, errors, signsLoaded, tourists } = storeToRefs(store);
const { fetchSigns, deleteSign, fetchTourists } = store;
const { filteredItems: filteredSigns } = useBcSearch(signs);

const stats = computed(() => summarizeSignStats(signs.value));

const latestRecordedAt = computed(() => {
  const list = signs.value ?? [];
  if (!list.length) return "—";
  const sorted = [...list].sort(
    (a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt))
  );
  return formatMonitoringDate(sorted[0]?.recordedAt);
});

const navigateToNew = () =>
  router.push({ name: "monitoring-sign-new" });

const navigateToEdit = (id) =>
  router.push({ name: "monitoring-sign-edit", params: { id } });

const confirmDelete = (sign) => {
  confirm.require({
    message: t("signs.confirm-delete"),
    header: t("signs.delete-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("sign.cancel"),
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: t("sign.delete"),
      severity: "danger"
    },
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
      <div class="monitoring-dashboard-header">
        <div>
          <h2 class="monitoring-section-title">{{ t("signs.title") }}</h2>
          <p class="monitoring-meta">{{ t("signs.subtitle") }}</p>
        </div>
        <div class="monitoring-dashboard-actions">
          <pv-button
              :label="t('signs.new')"
              class="monitoring-primary-button"
              icon="pi pi-plus"
              @click="navigateToNew"
          />
        </div>
      </div>

      <div v-if="signsLoaded && signs.length" class="monitoring-stats-row">
        <article class="monitoring-stat-card">
          <strong>{{ stats.total }}</strong>
          <span>{{ t("signs.stats-total") }}</span>
        </article>
        <article class="monitoring-stat-card monitoring-stat-card--teal">
          <strong>{{ stats.avgHeartRate || "—" }}</strong>
          <span>{{ t("signs.stats-avg-hr") }}</span>
        </article>
        <article class="monitoring-stat-card monitoring-stat-card--muted">
          <strong style="font-size: 0.95rem">{{ latestRecordedAt }}</strong>
          <span>{{ t("signs.stats-latest") }}</span>
        </article>
      </div>

      <section class="monitoring-info-card monitoring-info-card--table">
        <div class="monitoring-table-scroll">
          <pv-data-table
              :loading="!signsLoaded"
              :rows="8"
              :rows-per-page-options="[8, 16, 24]"
              :value="filteredSigns"
              class="monitoring-table-mock"
              paginator
              table-style="width: 100%; min-width: 920px; table-layout: fixed"
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
              style="width: 16%"
          >
            <template #body="slotProps">
              <span class="monitoring-table-cell">
                {{ formatMonitoringDate(slotProps.data.recordedAt) }}
              </span>
            </template>
          </pv-column>

          <pv-column :header="t('signs.actions')" style="width: 88px">
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
                    type="button"
                    icon="pi pi-trash"
                    rounded
                    text
                    class="delete-button"
                    @click.stop="confirmDelete(slotProps.data)"
                />
              </div>
            </template>
          </pv-column>
          </pv-data-table>
        </div>
      </section>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </MonitoringPanel>
</template>
