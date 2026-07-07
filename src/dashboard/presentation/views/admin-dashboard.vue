<script setup>
import { computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useDashboardStore from "../../application/dashboard.store.js";
import useMonitoringStore from "../../../monitoring/application/monitoring.store.js";
import KpiCard from "../../../shared/presentation/components/kpi-card.vue";
import ChartCard from "../../../shared/presentation/components/chart-card.vue";
import LineChart from "../../../shared/presentation/components/line-chart.vue";
import DonutChart from "../../../shared/presentation/components/donut-chart.vue";
import DateRangeFilter from "../../../shared/presentation/components/date-range-filter.vue";
import { formatAlertType } from "../../../monitoring/presentation/utils/monitoring-presenter.js";
import {
  capitalize,
  formatBucketLabel,
  formatRelativeAge,
  getAlertSeverityKey,
  severityColor
} from "../utils/dashboard-presenter.js";

const { t } = useI18n();
const store = useDashboardStore();
const monitoringStore = useMonitoringStore();

const {
  dateRange,
  errors,
  summary,
  summaryLoading,
  alertsDistribution,
  alertsDistributionLoading,
  expeditionsTimeSeries,
  timeSeriesLoading,
  attentionAlerts,
  attentionLoading,
  activeExpeditions,
  activeExpeditionsLoading
} = storeToRefs(store);

const {
  fetchAdminSummary,
  fetchAlertsDistribution,
  fetchExpeditionsTimeSeries,
  fetchAlertsRequiringAttention,
  fetchActiveExpeditions
} = store;

function loadAll() {
  fetchAdminSummary();
  fetchAlertsDistribution();
  fetchExpeditionsTimeSeries("week");
  fetchAlertsRequiringAttention();
  fetchActiveExpeditions();
}

onMounted(loadAll);

watch(
  () => dateRange.value,
  () => {
    fetchAdminSummary();
    fetchAlertsDistribution();
    fetchExpeditionsTimeSeries("week");
  },
  { deep: true }
);

function retry() {
  loadAll();
}

// Placeholder acknowledging-user id: there is no authenticated session yet
// (see IAM TODOs across the codebase), so acknowledgement isn't attributable
// to a real user until that bounded context exists.
const ACKNOWLEDGED_BY_PLACEHOLDER = 0;

function acknowledge(alert) {
  monitoringStore.acknowledgeAlert(alert.id, ACKNOWLEDGED_BY_PLACEHOLDER).then(() => {
    fetchAlertsRequiringAttention(true);
    fetchAdminSummary(true);
  });
}

const timeSeriesLabels = computed(() =>
  expeditionsTimeSeries.value.map((point) => formatBucketLabel(point.bucketStart, "week"))
);
const timeSeriesData = computed(() => expeditionsTimeSeries.value.map((point) => point.count));

const severityLabels = computed(() => Object.keys(alertsDistribution.value?.bySeverity ?? {}));
const severityData = computed(() => Object.values(alertsDistribution.value?.bySeverity ?? {}));
const severityColors = computed(() =>
  severityLabels.value.map((label) => severityColor(getAlertSeverityKey(label)))
);

const typeLabels = computed(() =>
  Object.keys(alertsDistribution.value?.byType ?? {}).map(formatAlertType)
);
const typeData = computed(() => Object.values(alertsDistribution.value?.byType ?? {}));
</script>

<template>
  <section class="dashboard-page admin-dashboard">
    <header class="admin-dashboard__header">
      <div>
        <h1 class="dashboard-section-title">{{ t("dashboard.admin.title") }}</h1>
        <p class="dashboard-meta">{{ t("dashboard.admin.subtitle") }}</p>
      </div>
      <DateRangeFilter v-model="dateRange" />
    </header>

    <div v-if="errors.length" class="bc-error admin-dashboard__error">
      <span>{{ t("errors.occurred") }}</span>
      <pv-button :label="t('dashboard.retry')" icon="pi pi-refresh" text @click="retry" />
    </div>

    <div class="admin-dashboard__kpis">
      <KpiCard
          :label="t('dashboard.admin.kpi.expeditions-active')"
          :value="summary?.expeditionsActive?.value ?? 0"
          :delta-percentage="summary?.expeditionsActive?.deltaPercentage ?? null"
          :loading="summaryLoading"
      />
      <KpiCard
          variant="teal"
          :label="t('dashboard.admin.kpi.expeditions-completed')"
          :value="summary?.expeditionsCompleted?.value ?? 0"
          :delta-percentage="summary?.expeditionsCompleted?.deltaPercentage ?? null"
          :loading="summaryLoading"
      />
      <KpiCard
          variant="muted"
          invert-delta
          :label="t('dashboard.admin.kpi.alerts-open')"
          :value="summary?.alertsOpen?.value ?? 0"
          :delta-percentage="summary?.alertsOpen?.deltaPercentage ?? null"
          :loading="summaryLoading"
      />
      <KpiCard
          :label="t('dashboard.admin.kpi.tourists-active')"
          :value="summary?.touristsActive?.value ?? 0"
          :delta-percentage="summary?.touristsActive?.deltaPercentage ?? null"
          :loading="summaryLoading"
      />
      <KpiCard
          variant="teal"
          :label="t('dashboard.admin.kpi.staff-assigned')"
          :value="summary?.staffAssigned?.value ?? 0"
          :delta-percentage="summary?.staffAssigned?.deltaPercentage ?? null"
          :loading="summaryLoading"
      />
    </div>

    <div class="admin-dashboard__charts">
      <ChartCard
          :title="t('dashboard.admin.charts.expeditions-timeseries')"
          :loading="timeSeriesLoading"
          :empty="!timeSeriesLoading && !expeditionsTimeSeries.length"
          :empty-message="t('dashboard.empty-expeditions')"
      >
        <LineChart
            :labels="timeSeriesLabels"
            :data="timeSeriesData"
            :series-label="t('dashboard.admin.charts.expeditions-timeseries')"
        />
      </ChartCard>
      <ChartCard
          :title="t('dashboard.admin.charts.alerts-by-severity')"
          :loading="alertsDistributionLoading"
          :empty="!alertsDistributionLoading && !severityLabels.length"
          :empty-message="t('dashboard.empty-alerts')"
      >
        <DonutChart
            :labels="severityLabels"
            :data="severityData"
            :colors="severityColors"
            :aria-label="t('dashboard.admin.charts.alerts-by-severity')"
        />
      </ChartCard>
      <ChartCard
          :title="t('dashboard.admin.charts.alerts-by-type')"
          :loading="alertsDistributionLoading"
          :empty="!alertsDistributionLoading && !typeLabels.length"
          :empty-message="t('dashboard.empty-alerts')"
      >
        <DonutChart
            :labels="typeLabels"
            :data="typeData"
            :aria-label="t('dashboard.admin.charts.alerts-by-type')"
        />
      </ChartCard>
    </div>

    <section class="monitoring-info-card admin-dashboard__attention">
      <div class="admin-dashboard__attention-header">
        <h2>{{ t("dashboard.admin.attention.title") }}</h2>
        <p>{{ t("dashboard.admin.attention.subtitle") }}</p>
      </div>
      <div v-if="attentionLoading" class="admin-dashboard__attention-skeleton">
        <pv-skeleton v-for="n in 3" :key="n" height="52px" class="admin-dashboard__skeleton-row" />
      </div>
      <p v-else-if="!attentionAlerts.length" class="admin-dashboard__empty-text">
        {{ t("dashboard.admin.attention.empty") }}
      </p>
      <ul v-else class="admin-dashboard__attention-list">
        <li v-for="alert in attentionAlerts" :key="alert.id" class="admin-dashboard__attention-item">
          <span
              class="monitoring-severity-pill"
              :class="`monitoring-severity-pill--${getAlertSeverityKey(alert.severity)}`"
          >
            {{ alert.severity }}
          </span>
          <div class="admin-dashboard__attention-body">
            <strong>{{ alert.message }}</strong>
            <span>{{ t("dashboard.admin.attention.tourist", { id: alert.touristId }) }} · {{ formatRelativeAge(alert.raisedAt) }}</span>
          </div>
          <pv-button
              :label="t('dashboard.admin.attention.acknowledge')"
              size="small"
              outlined
              @click="acknowledge(alert)"
          />
        </li>
      </ul>
    </section>

    <section class="monitoring-info-card admin-dashboard__expeditions">
      <h2>{{ t("dashboard.admin.expeditions.title") }}</h2>
      <div class="monitoring-table-scroll">
        <pv-data-table
            :loading="activeExpeditionsLoading"
            :value="activeExpeditions"
            class="monitoring-table-mock"
        >
          <pv-column :header="t('dashboard.admin.expeditions.name')" field="expeditionName" />
          <pv-column :header="t('dashboard.admin.expeditions.status')" field="status">
            <template #body="slotProps">
              <span class="monitoring-status-pill monitoring-status-pill--active">
                {{ capitalize(slotProps.data.status) }}
              </span>
            </template>
          </pv-column>
          <pv-column :header="t('dashboard.admin.expeditions.tourists')" field="touristCount" />
          <template #empty>
            <p class="admin-dashboard__empty-text">{{ t("dashboard.admin.expeditions.empty") }}</p>
          </template>
        </pv-data-table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.admin-dashboard {
  padding: 28px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.admin-dashboard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.admin-dashboard__header .dashboard-section-title {
  margin: 0 0 6px;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.45rem;
}

.admin-dashboard__header .dashboard-meta {
  margin: 0;
  color: #94a3b8;
  font-size: 0.84rem;
  line-height: 1.5;
}

.admin-dashboard__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.admin-dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.admin-dashboard__charts {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.admin-dashboard__attention-header h2,
.admin-dashboard__expeditions h2 {
  margin: 0 0 4px;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.1rem;
}

.admin-dashboard__attention-header p {
  margin: 0 0 14px;
  color: #94a3b8;
  font-size: 0.8rem;
}

.admin-dashboard__attention-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-dashboard__attention-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 4px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.admin-dashboard__attention-item:last-child {
  border-bottom: none;
}

.admin-dashboard__attention-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-dashboard__attention-body strong {
  color: #ffffff;
  font-size: 0.86rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-dashboard__attention-body span {
  color: #94a3b8;
  font-size: 0.72rem;
}

.admin-dashboard__attention-skeleton {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-dashboard__empty-text {
  color: #64748b;
  font-size: 0.82rem;
  text-align: center;
  padding: 24px 0;
  margin: 0;
}

.admin-dashboard__expeditions h2 {
  margin-bottom: 14px;
}

@media (max-width: 1100px) {
  .admin-dashboard__kpis {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .admin-dashboard__charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .admin-dashboard {
    padding: 20px 16px 36px;
  }

  .admin-dashboard__kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-dashboard__attention-item {
    flex-wrap: wrap;
  }
}
</style>
