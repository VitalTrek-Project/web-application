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
  formatAlertType,
  formatMonitoringDate,
  getAlertSeverityKey,
  getAlertStatusKey,
  summarizeAlertStats
} from "../utils/monitoring-presenter.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useMonitoringStore();
const { alerts, errors, alertsLoaded, tourists } = storeToRefs(store);
const { fetchAlerts, deleteAlert, fetchTourists } = store;
const { filteredItems: filteredAlerts } = useBcSearch(alerts);

const stats = computed(() => summarizeAlertStats(alerts.value));

const navigateToNew = () =>
  router.push({ name: "monitoring-alert-new" });

const navigateToEdit = (id) =>
  router.push({ name: "monitoring-alert-edit", params: { id } });

const confirmDelete = (alert) => {
  confirm.require({
    message: t("alerts.confirm-delete", { name: alert.touristId }),
    header: t("alerts.delete-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("alert.cancel"),
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: t("alert.delete"),
      severity: "danger"
    },
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
      <div class="monitoring-dashboard-header">
        <div>
          <h2 class="monitoring-section-title">{{ t("alerts.title") }}</h2>
          <p class="monitoring-meta">{{ t("alerts.subtitle") }}</p>
        </div>
        <div class="monitoring-dashboard-actions">
          <pv-button
              :label="t('alerts.new')"
              class="monitoring-primary-button"
              icon="pi pi-plus"
              @click="navigateToNew"
          />
        </div>
      </div>

      <div v-if="alertsLoaded && alerts.length" class="monitoring-stats-row">
        <article class="monitoring-stat-card">
          <strong>{{ stats.total }}</strong>
          <span>{{ t("alerts.stats-total") }}</span>
        </article>
        <article class="monitoring-stat-card monitoring-stat-card--teal">
          <strong>{{ stats.open }}</strong>
          <span>{{ t("alerts.stats-open") }}</span>
        </article>
        <article class="monitoring-stat-card monitoring-stat-card--muted">
          <strong>{{ stats.critical }}</strong>
          <span>{{ t("alerts.stats-critical") }}</span>
        </article>
      </div>

      <section class="monitoring-info-card monitoring-info-card--table">
        <div class="monitoring-table-scroll">
          <pv-data-table
              :loading="!alertsLoaded"
              :rows="8"
              :rows-per-page-options="[8, 16, 24]"
              :value="filteredAlerts"
              class="monitoring-table-mock"
              paginator
              table-style="width: 100%; min-width: 1080px; table-layout: fixed"
          >
            <pv-column
                :header="t('alerts.id')"
                field="id"
                sortable
                header-class="col-id"
                body-class="col-id"
                style="width: 4%"
            />
            <pv-column
                :header="t('alerts.touristId')"
                field="touristId"
                sortable
                header-class="col-tourist"
                body-class="col-tourist"
                style="width: 7%"
            />
            <pv-column
                :header="t('alerts.expeditionId')"
                field="expeditionId"
                sortable
                header-class="col-expedition"
                body-class="col-expedition"
                style="width: 7%"
            />
            <pv-column
                :header="t('alerts.type')"
                field="type"
                sortable
                header-class="col-type"
                body-class="col-type"
                style="width: 11%"
            >
              <template #body="slotProps">
                <span
                    class="monitoring-table-cell monitoring-table-cell--type"
                    :title="slotProps.data.type"
                >
                  {{ formatAlertType(slotProps.data.type) }}
                </span>
              </template>
            </pv-column>
            <pv-column
                :header="t('alerts.severity')"
                field="severity"
                sortable
                header-class="col-severity"
                body-class="col-severity"
                style="width: 9%"
            >
              <template #body="slotProps">
                <div class="monitoring-table-cell monitoring-table-cell--pill">
                  <span
                      class="monitoring-severity-pill"
                      :class="`monitoring-severity-pill--${getAlertSeverityKey(slotProps.data.severity)}`"
                  >
                    {{ slotProps.data.severity }}
                  </span>
                </div>
              </template>
            </pv-column>
            <pv-column
                :header="t('alerts.message')"
                field="message"
                sortable
                header-class="col-message"
                body-class="col-message"
                style="width: 32%"
            >
              <template #body="slotProps">
                <span
                    class="monitoring-table-cell monitoring-table-cell--message"
                    :title="slotProps.data.message"
                >
                  {{ slotProps.data.message }}
                </span>
              </template>
            </pv-column>
            <pv-column
                :header="t('alerts.status')"
                field="status"
                sortable
                header-class="col-status"
                body-class="col-status"
                style="width: 10%"
            >
              <template #body="slotProps">
                <div class="monitoring-table-cell monitoring-table-cell--pill">
                  <span
                      class="monitoring-status-pill"
                      :class="`monitoring-status-pill--${getAlertStatusKey(slotProps.data.status)}`"
                  >
                    {{ slotProps.data.status }}
                  </span>
                </div>
              </template>
            </pv-column>
            <pv-column
                :header="t('alerts.raisedAt')"
                field="raisedAt"
                sortable
                header-class="col-raised"
                body-class="col-raised"
                style="width: 12%"
            >
              <template #body="slotProps">
                <span class="monitoring-table-cell">
                  {{ formatMonitoringDate(slotProps.data.raisedAt) }}
                </span>
              </template>
            </pv-column>

            <pv-column
                :header="t('alerts.actions')"
                header-class="col-actions"
                body-class="col-actions"
                style="width: 8%"
            >
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
