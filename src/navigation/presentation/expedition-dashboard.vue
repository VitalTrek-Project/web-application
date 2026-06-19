<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import useMonitoringStore from "../../monitoring/application/monitoring.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import { getAlertSeverityKey, getAlertStatusKey } from "../../monitoring/presentation/utils/monitoring-presenter.js";
import {
  formatNavigationDate,
  getExpeditionStatusKey,
  summarizeCheckpointProgress
} from "./utils/navigation-presenter.js";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const store = useNavigationStore();
const monitoringStore = useMonitoringStore();
const { currentExpedition, progress, errors, loading } = storeToRefs(store);
const { alerts, tourists } = storeToRefs(monitoringStore);
const { ensureExpeditionLoaded, startExpedition, finishExpedition } = store;

const STATUS_CYCLE = ["on_route", "on_route", "stopped", "completed"];
const SAMPLE_TOURISTS = [
  { id: 1, fullName: "Ana Quispe" },
  { id: 2, fullName: "Carlos Mendoza" },
  { id: 3, fullName: "María Torres" },
  { id: 4, fullName: "Jorge Luna" },
  { id: 5, fullName: "Sofía Díaz" }
];

const touristInitials = (name) =>
  String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Sample critical alert shown when the mock API has no open critical alert,
// so the monitoring response flow is always demonstrable.
const SAMPLE_CRITICAL_ALERT = {
  id: null,
  touristId: 3,
  type: "low_oxygen",
  severity: "critical",
  status: "open",
  message: "Saturación de oxígeno por debajo del 88% en el checkpoint 3.",
  sample: true
};

const criticalAlert = computed(() => {
  const list = alerts.value ?? [];
  const real =
    list.find(
      (a) =>
        getAlertSeverityKey(a.severity) === "critical" &&
        getAlertStatusKey(a.status) === "active"
    ) ?? list.find((a) => getAlertSeverityKey(a.severity) === "critical");
  return real ?? SAMPLE_CRITICAL_ALERT;
});

const viewAlertDetail = () => {
  if (criticalAlert.value?.id != null) {
    router.push({
      name: "monitoring-alert-edit",
      params: { id: criticalAlert.value.id }
    });
  } else {
    router.push({ name: "monitoring-alert" });
  }
};

const contactTourist = () => {
  toast.add({
    severity: "info",
    summary: t("expedition.alert-banner.contacting-summary"),
    detail: t("expedition.alert-banner.contacting-detail", {
      tourist: criticalAlert.value?.touristId ?? "—"
    }),
    life: 4000
  });
};

const touristStatuses = computed(() => {
  const base = (tourists.value?.length ? tourists.value : SAMPLE_TOURISTS).slice(
    0,
    6
  );
  const alertId = criticalAlert.value?.touristId;
  return base.map((tourist, index) => {
    const name = tourist.fullName || `Turista #${tourist.id}`;
    const status =
      alertId != null && String(tourist.id) === String(alertId)
        ? "alert"
        : STATUS_CYCLE[index % STATUS_CYCLE.length];
    return { id: tourist.id, name, initials: touristInitials(name), status };
  });
});

const expedition = computed(() => currentExpedition.value);

const checkpointStats = computed(() =>
  summarizeCheckpointProgress(
    expedition.value?.checkpoints,
    progress.value?.completedCheckpoints
  )
);

const progressPercentage = computed(() => checkpointStats.value.percentage);

const statusKey = computed(() =>
  getExpeditionStatusKey(expedition.value?.status)
);

const statusLabel = computed(() => {
  const key = statusKey.value;
  if (key === "active") return t("expedition.status-active");
  if (key === "finished") return t("expedition.status-finished");
  if (key === "planned") return t("expedition.status-planned");
  return expedition.value?.status ?? "—";
});

onMounted(() => {
  ensureExpeditionLoaded(3).catch(() => {});
  if (!alerts.value.length) monitoringStore.fetchAlerts();
  if (!tourists.value.length) monitoringStore.fetchTourists();
});

const handleStart = () => {
  if (!expedition.value) return;
  startExpedition(expedition.value.tourId).catch(() => {});
};

const handleFinish = () => {
  if (!expedition.value) return;
  finishExpedition(expedition.value.id).catch(() => {});
};
</script>

<template>
  <NavigationPanel>
    <div class="navigation-card">
      <div v-if="loading" class="navigation-empty">{{ t("weather.loading") }}</div>

      <div v-else-if="!expedition" class="navigation-empty">
        {{ t("expedition.no-data") }}
      </div>

      <template v-else>
        <div class="navigation-dashboard-header">
          <div>
            <h2 class="navigation-section-title">{{ t("expedition.title") }}</h2>
            <p class="navigation-meta">{{ t("expedition.subtitle") }}</p>
          </div>
          <div class="navigation-dashboard-actions">
            <pv-button
                icon="pi pi-play"
                :label="t('expedition.start')"
                class="navigation-primary-button"
                :disabled="expedition.status === 'in_progress'"
                @click="handleStart"
            />
            <pv-button
                icon="pi pi-check"
                :label="t('expedition.finish')"
                class="navigation-outline-button"
                outlined
                :disabled="expedition.status === 'finished'"
                @click="handleFinish"
            />
          </div>
        </div>

        <div
            v-if="criticalAlert"
            class="expedition-alert-banner"
            role="alert"
        >
          <div class="expedition-alert-icon">
            <i class="pi pi-exclamation-triangle" aria-hidden="true" />
          </div>
          <div class="expedition-alert-body">
            <div class="expedition-alert-headline">
              <span class="expedition-alert-pill">
                {{ t("expedition.alert-banner.critical") }}
              </span>
              <span class="expedition-alert-tourist">
                {{ t("expedition.alert-banner.tourist", { id: criticalAlert.touristId }) }}
              </span>
            </div>
            <p class="expedition-alert-message">{{ criticalAlert.message }}</p>
          </div>
          <div class="expedition-alert-actions">
            <pv-button
                type="button"
                :label="t('expedition.alert-banner.view-detail')"
                icon="pi pi-search"
                class="navigation-primary-button"
                @click="viewAlertDetail"
            />
            <pv-button
                type="button"
                :label="t('expedition.alert-banner.contact')"
                icon="pi pi-phone"
                severity="danger"
                @click="contactTourist"
            />
          </div>
        </div>

        <div class="navigation-stats-row">
          <article class="navigation-stat-card">
            <strong>{{ checkpointStats.total }}</strong>
            <span>{{ t("expedition.stats-checkpoints") }}</span>
          </article>
          <article class="navigation-stat-card navigation-stat-card--accent">
            <strong>{{ checkpointStats.completed }}</strong>
            <span>{{ t("expedition.stats-completed") }}</span>
          </article>
          <article class="navigation-stat-card navigation-stat-card--muted">
            <strong>{{ progressPercentage }}%</strong>
            <span>{{ t("expedition.stats-progress") }}</span>
          </article>
        </div>

        <section class="navigation-info-card">
          <dl class="navigation-detail-grid">
            <div>
              <dt>{{ t("expedition.status") }}</dt>
              <dd>
                <span
                    class="navigation-status-pill"
                    :class="`navigation-status-pill--${statusKey}`"
                >
                  {{ statusLabel }}
                </span>
              </dd>
            </div>
            <div>
              <dt>{{ t("expedition.expedition-id") }}</dt>
              <dd>{{ expedition.id }}</dd>
            </div>
            <div>
              <dt>{{ t("expedition.tour-id") }}</dt>
              <dd>{{ expedition.tourId }}</dd>
            </div>
            <div v-if="expedition.guideId">
              <dt>{{ t("expedition.guide-id") }}</dt>
              <dd>{{ expedition.guideId }}</dd>
            </div>
          </dl>
          <p v-if="expedition.startedAt" class="navigation-meta">
            {{ t("expedition.started-at") }}:
            {{ formatNavigationDate(expedition.startedAt) }}
          </p>

          <p class="navigation-meta" style="margin: 12px 0 4px">
            {{ t("expedition.progress") }}:
            {{ checkpointStats.completed }} / {{ checkpointStats.total }}
          </p>
          <div class="navigation-progress-bar">
            <div
                class="navigation-progress-fill"
                :style="{ width: progressPercentage + '%' }"
            />
          </div>
        </section>

        <section class="navigation-info-card expedition-tourists">
          <div class="expedition-tourists-header">
            <h3>{{ t("expedition.tourists-title") }}</h3>
            <p>{{ t("expedition.tourists-subtitle") }}</p>
          </div>

          <p v-if="!touristStatuses.length" class="navigation-empty">
            {{ t("expedition.tourists-empty") }}
          </p>

          <ul v-else class="expedition-tourist-list">
            <li
                v-for="tourist in touristStatuses"
                :key="tourist.id"
                class="expedition-tourist-row"
                :class="{ 'is-alert': tourist.status === 'alert' }"
            >
              <span class="expedition-tourist-avatar">{{ tourist.initials }}</span>
              <span class="expedition-tourist-name">{{ tourist.name }}</span>
              <span
                  class="expedition-tourist-status"
                  :class="`expedition-tourist-status--${tourist.status}`"
              >
                <i
                    class="pi"
                    :class="{
                      'pi-circle-fill': tourist.status === 'on_route',
                      'pi-pause': tourist.status === 'stopped',
                      'pi-check': tourist.status === 'completed',
                      'pi-exclamation-triangle': tourist.status === 'alert'
                    }"
                    aria-hidden="true"
                />
                {{ t(`expedition.tourist-status.${tourist.status}`) }}
              </span>
            </li>
          </ul>
        </section>
      </template>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </NavigationPanel>
</template>

<style scoped>
.expedition-alert-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.22), rgba(127, 29, 29, 0.32));
  border: 1px solid rgba(248, 113, 113, 0.55);
  border-left: 5px solid #ef4444;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.25);
}

.expedition-alert-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #ef4444;
  color: #ffffff;
  font-size: 1.4rem;
  animation: expedition-alert-flash 1.6s ease-in-out infinite;
}

@keyframes expedition-alert-flash {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

.expedition-alert-body {
  flex: 1;
  min-width: 0;
}

.expedition-alert-headline {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.expedition-alert-pill {
  background: #ef4444;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 999px;
}

.expedition-alert-tourist {
  color: #fecaca;
  font-size: 0.78rem;
  font-weight: 700;
}

.expedition-alert-message {
  color: #ffffff;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.expedition-alert-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.expedition-tourists {
  margin-top: 16px;
}

.expedition-tourists-header {
  margin-bottom: 14px;
}

.expedition-tourists-header h3 {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.05rem;
  margin: 0 0 4px;
}

.expedition-tourists-header p {
  color: #aebacb;
  font-size: 0.76rem;
  margin: 0;
}

.expedition-tourist-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expedition-tourist-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(59, 80, 107, 0.4);
  border: 1px solid rgba(220, 229, 241, 0.12);
  border-radius: 10px;
  padding: 10px 14px;
}

.expedition-tourist-row.is-alert {
  background: rgba(220, 38, 38, 0.14);
  border-color: rgba(248, 113, 113, 0.5);
}

.expedition-tourist-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #3b506b;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.76rem;
  flex-shrink: 0;
}

.expedition-tourist-name {
  flex: 1;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
}

.expedition-tourist-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
}

.expedition-tourist-status .pi {
  font-size: 0.6rem;
}

.expedition-tourist-status--on_route {
  background: rgba(45, 212, 191, 0.16);
  color: #5eead4;
}

.expedition-tourist-status--stopped {
  background: rgba(245, 158, 11, 0.16);
  color: #fbbf24;
}

.expedition-tourist-status--completed {
  background: rgba(148, 163, 184, 0.18);
  color: #cbd5e1;
}

.expedition-tourist-status--alert {
  background: #ef4444;
  color: #ffffff;
}

@media (max-width: 750px) {
  .expedition-alert-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .expedition-alert-actions {
    width: 100%;
  }

  .expedition-alert-actions :deep(.p-button) {
    flex: 1;
  }
}
</style>
