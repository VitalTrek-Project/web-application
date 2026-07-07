<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import useDashboardStore from "../../application/dashboard.store.js";
import { getAlertSeverityKey } from "../../../monitoring/presentation/utils/monitoring-presenter.js";
import { formatBucketLabel, getExpeditionStatusKey } from "../utils/dashboard-presenter.js";

const TOURIST_ID_STORAGE_KEY = "vitaltrek_tourist_id";

const { t } = useI18n();
const router = useRouter();
const store = useDashboardStore();
const { touristDashboard, touristDashboardLoading, errors } = storeToRefs(store);
const { fetchTouristDashboard } = store;

// There is no authenticated session yet (IAM bounded context pending), so the
// tourist identifies themselves with a locally-remembered id, same spirit as
// the mode selector simulating a role without real login.
const touristId = ref(localStorage.getItem(TOURIST_ID_STORAGE_KEY) || "");
const touristIdInput = ref(touristId.value);

function load() {
  if (touristId.value) fetchTouristDashboard(touristId.value);
}

onMounted(load);

function confirmTouristId() {
  const value = String(touristIdInput.value ?? "").trim();
  if (!value) return;
  touristId.value = value;
  localStorage.setItem(TOURIST_ID_STORAGE_KEY, value);
  load();
}

function changeTouristId() {
  touristId.value = "";
}

function retry() {
  load();
}

function openNavigation() {
  router.push({ name: "navigation-expedition" });
}

const currentExpeditionStatusKey = computed(() =>
  getExpeditionStatusKey(touristDashboard.value?.currentExpedition?.status)
);
</script>

<template>
  <section class="dashboard-page tourist-dashboard">
    <header class="tourist-dashboard__header">
      <h1>{{ t("dashboard.tourist.title") }}</h1>
      <button
          v-if="touristId"
          type="button"
          class="tourist-dashboard__change-id"
          @click="changeTouristId"
      >
        {{ t("dashboard.tourist.change-id", { id: touristId }) }}
      </button>
    </header>

    <section v-if="!touristId" class="tourist-dashboard__card tourist-dashboard__id-card">
      <i class="pi pi-user" aria-hidden="true" />
      <p>{{ t("dashboard.tourist.id-prompt") }}</p>
      <form class="tourist-dashboard__id-form" @submit.prevent="confirmTouristId">
        <label for="tourist-id-input" class="visually-hidden">{{ t("dashboard.tourist.id-label") }}</label>
        <pv-input-text
            id="tourist-id-input"
            v-model="touristIdInput"
            type="number"
            :placeholder="t('dashboard.tourist.id-label')"
        />
        <pv-button type="submit" :label="t('dashboard.tourist.id-confirm')" />
      </form>
    </section>

    <template v-else>
      <div v-if="errors.length" class="bc-error tourist-dashboard__error">
        <span>{{ t("errors.occurred") }}</span>
        <pv-button :label="t('dashboard.retry')" icon="pi pi-refresh" text @click="retry" />
      </div>

      <section class="tourist-dashboard__card">
        <pv-skeleton v-if="touristDashboardLoading" width="100%" height="120px" />
        <template v-else-if="touristDashboard?.currentExpedition">
          <h2>{{ t("dashboard.tourist.current-expedition") }}</h2>
          <p class="tourist-dashboard__expedition-name">{{ touristDashboard.currentExpedition.expeditionName }}</p>
          <div class="tourist-dashboard__pills">
            <span
                class="monitoring-status-pill"
                :class="`monitoring-status-pill--${currentExpeditionStatusKey === 'active' ? 'active' : 'neutral'}`"
            >
              {{ touristDashboard.currentExpedition.status }}
            </span>
            <span class="tourist-dashboard__tag">
              {{ t("dashboard.tourist.guide", { id: touristDashboard.currentExpedition.guideId }) }}
            </span>
          </div>
          <pv-button
              :label="t('dashboard.tourist.view-itinerary')"
              icon="pi pi-map"
              outlined
              class="tourist-dashboard__itinerary-button"
              @click="openNavigation"
          />
        </template>
        <div v-else class="tourist-dashboard__empty">
          <i class="pi pi-compass" aria-hidden="true" />
          <p>{{ t("dashboard.tourist.no-active-expedition") }}</p>
        </div>
      </section>

      <section class="tourist-dashboard__card">
        <h2>{{ t("dashboard.tourist.active-alerts") }}</h2>
        <pv-skeleton v-if="touristDashboardLoading" width="100%" height="60px" />
        <p v-else-if="!touristDashboard?.activeAlerts?.length" class="tourist-dashboard__empty-text">
          {{ t("dashboard.tourist.no-active-alerts") }}
        </p>
        <ul v-else class="tourist-dashboard__alert-list">
          <li v-for="alert in touristDashboard.activeAlerts" :key="alert.id" class="tourist-dashboard__alert-item">
            <span
                class="monitoring-severity-pill"
                :class="`monitoring-severity-pill--${getAlertSeverityKey(alert.severity)}`"
            >
              {{ alert.severity }}
            </span>
            <span>{{ alert.message }}</span>
          </li>
        </ul>
      </section>

      <section class="tourist-dashboard__card">
        <h2>{{ t("dashboard.tourist.alert-history") }}</h2>
        <pv-skeleton v-if="touristDashboardLoading" width="100%" height="60px" />
        <p v-else-if="!touristDashboard?.historicalAlerts?.length" class="tourist-dashboard__empty-text">
          {{ t("dashboard.tourist.no-historical-alerts") }}
        </p>
        <ul v-else class="tourist-dashboard__alert-list">
          <li v-for="alert in touristDashboard.historicalAlerts" :key="alert.id" class="tourist-dashboard__alert-item">
            <span
                class="monitoring-severity-pill"
                :class="`monitoring-severity-pill--${getAlertSeverityKey(alert.severity)}`"
            >
              {{ alert.severity }}
            </span>
            <span>{{ alert.message }}</span>
          </li>
        </ul>
      </section>

      <section class="tourist-dashboard__card">
        <h2>{{ t("dashboard.tourist.past-expeditions") }}</h2>
        <pv-skeleton v-if="touristDashboardLoading" width="100%" height="80px" />
        <p v-else-if="!touristDashboard?.pastExpeditions?.length" class="tourist-dashboard__empty-text">
          {{ t("dashboard.tourist.no-past-expeditions") }}
        </p>
        <ul v-else class="tourist-dashboard__history-list">
          <li v-for="expedition in touristDashboard.pastExpeditions" :key="expedition.id" class="tourist-dashboard__history-item">
            <span class="tourist-dashboard__history-name">{{ expedition.expeditionName }}</span>
            <span class="tourist-dashboard__history-date">{{ formatBucketLabel(expedition.lastActivityAt, "month") }}</span>
          </li>
        </ul>
      </section>
    </template>
  </section>
</template>

<style scoped>
/* Mobile-first: base rules target ~375px, then widen via min-width queries. */
.tourist-dashboard {
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tourist-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.tourist-dashboard__header h1 {
  margin: 0;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.25rem;
}

.tourist-dashboard__change-id {
  background: none;
  border: none;
  color: #ff9a5c;
  font-size: 0.72rem;
  text-decoration: underline;
  padding: 0;
  cursor: pointer;
}

.tourist-dashboard__error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.tourist-dashboard__card {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 16px;
}

.tourist-dashboard__card h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 0.98rem;
}

.tourist-dashboard__id-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 28px 20px;
}

.tourist-dashboard__id-card i {
  font-size: 1.8rem;
  color: #ff9a5c;
}

.tourist-dashboard__id-card p {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.84rem;
}

.tourist-dashboard__id-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tourist-dashboard__id-form :deep(.p-inputtext) {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

.tourist-dashboard__expedition-name {
  margin: 0 0 10px;
  color: #f1f5f9;
  font-size: 1.05rem;
  font-weight: 700;
}

.tourist-dashboard__pills {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.tourist-dashboard__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(148, 163, 184, 0.12);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.tourist-dashboard__itinerary-button {
  width: 100%;
}

.tourist-dashboard__empty,
.tourist-dashboard__empty-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  text-align: center;
  padding: 18px 0;
}

.tourist-dashboard__empty i {
  font-size: 1.6rem;
}

.tourist-dashboard__empty p,
.tourist-dashboard__empty-text {
  margin: 0;
  font-size: 0.82rem;
}

.tourist-dashboard__alert-list,
.tourist-dashboard__history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tourist-dashboard__alert-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  font-size: 0.82rem;
  color: #e2e8f0;
}

.tourist-dashboard__alert-item:last-child {
  border-bottom: none;
}

.tourist-dashboard__history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.tourist-dashboard__history-item:last-child {
  border-bottom: none;
}

.tourist-dashboard__history-name {
  color: #f1f5f9;
  font-size: 0.84rem;
  font-weight: 600;
}

.tourist-dashboard__history-date {
  color: #94a3b8;
  font-size: 0.72rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 640px) {
  .tourist-dashboard {
    padding: 28px 24px 48px;
    max-width: 560px;
    margin: 0 auto;
  }

  .tourist-dashboard__id-form {
    flex-direction: row;
  }

  .tourist-dashboard__itinerary-button {
    width: auto;
  }
}
</style>
