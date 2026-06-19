<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import { useIncidentReport } from "../../shared/presentation/composables/use-incident-report.js";
import {
  getExpeditionStatusKey,
  summarizeCheckpointProgress
} from "./utils/navigation-presenter.js";

const { t } = useI18n();
const toast = useToast();
const store = useNavigationStore();
const { currentExpedition, progress, errors, loading } = storeToRefs(store);
const { ensureExpeditionLoaded } = store;
const { reportIncident } = useIncidentReport();

const downloading = ref(false);

const handleReportIncident = () => {
  reportIncident({
    expeditionId: currentExpedition.value?.id,
    tourId: currentExpedition.value?.tourId
  });
};

const handleDownloadOffline = () => {
  if (downloading.value) return;
  downloading.value = true;
  toast.add({
    severity: "info",
    summary: t("navigation.map.download-start-summary"),
    detail: t("navigation.map.download-start-detail"),
    life: 2000
  });
  store.downloadOfflineRoute(currentExpedition.value?.tourId).then(() => {
    downloading.value = false;
    toast.add({
      severity: "success",
      summary: t("navigation.map.download-done-summary"),
      detail: t("navigation.map.download-done-detail"),
      life: 4000
    });
  });
};

const checkpoints = computed(() => currentExpedition.value?.checkpoints ?? []);

const checkpointStats = computed(() =>
  summarizeCheckpointProgress(
    checkpoints.value,
    progress.value?.completedCheckpoints
  )
);

const completedCount = computed(() => progress.value?.completedCheckpoints ?? 0);

const nextCheckpoint = computed(
  () => checkpoints.value.find((cp) => cp.order > completedCount.value) ?? null
);

const isCompleted = (checkpoint) => {
  return checkpoint.order <= completedCount.value;
};

const isNext = (checkpoint) =>
  nextCheckpoint.value != null && checkpoint.order === nextCheckpoint.value.order;

onMounted(() => {
  ensureExpeditionLoaded(3).catch(() => {});
});
</script>

<template>
  <NavigationPanel>
    <div class="navigation-card">
      <div class="navigation-dashboard-header">
        <div>
          <h2 class="navigation-section-title">{{ t("navigation.map.title") }}</h2>
          <p class="navigation-meta">{{ t("navigation.map.subtitle") }}</p>
        </div>
        <div class="navigation-dashboard-actions">
          <pv-button
              type="button"
              :label="t('incident.report')"
              icon="pi pi-exclamation-triangle"
              severity="danger"
              class="navigation-incident-button"
              @click="handleReportIncident"
          />
        </div>
      </div>

      <div v-if="loading" class="navigation-empty">{{ t("weather.loading") }}</div>

      <template v-else>
        <div class="navigation-stats-row">
          <article class="navigation-stat-card">
            <strong>{{ checkpointStats.total }}</strong>
            <span>{{ t("navigation.map.stats-total") }}</span>
          </article>
          <article class="navigation-stat-card navigation-stat-card--accent">
            <strong>{{ checkpointStats.completed }}</strong>
            <span>{{ t("navigation.map.stats-done") }}</span>
          </article>
          <article class="navigation-stat-card navigation-stat-card--muted">
            <strong>{{ checkpointStats.pending }}</strong>
            <span>{{ t("navigation.map.stats-pending") }}</span>
          </article>
        </div>

        <div class="navigation-map-grid">
          <div class="navigation-map-visual">
            <!-- Topographic contour lines (decorative) -->
            <svg
                class="navigation-map-topo"
                viewBox="0 0 400 280"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
              <path d="M-20 60 C 80 20, 160 90, 260 50 S 420 60, 440 40" />
              <path d="M-20 110 C 90 70, 180 140, 270 100 S 420 110, 440 90" />
              <path d="M-20 160 C 70 130, 170 190, 280 150 S 420 165, 440 145" />
              <path d="M-20 210 C 100 180, 190 240, 290 200 S 420 215, 440 195" />
              <path d="M-20 255 C 80 230, 180 285, 300 250 S 420 260, 440 245" />
              <path d="M60 -10 C 90 80, 40 160, 110 240 S 90 300, 120 320" />
              <path d="M320 -10 C 350 80, 300 160, 370 240 S 350 300, 380 320" />
            </svg>

            <i class="pi pi-map navigation-map-bg" aria-hidden="true" />
            <p class="navigation-map-caption">{{ t("navigation.map.placeholder") }}</p>
            <span
                v-if="currentExpedition"
                class="navigation-status-pill"
                :class="`navigation-status-pill--${getExpeditionStatusKey(currentExpedition.status)}`"
            >
              {{ currentExpedition.status }}
            </span>

            <!-- Simulated current location marker -->
            <div class="navigation-map-marker navigation-map-marker--current">
              <span class="navigation-map-dot" aria-hidden="true" />
              <span class="navigation-map-marker-label">
                {{ t("navigation.map.current") }}
              </span>
            </div>

            <!-- Next checkpoint marker -->
            <div
                v-if="nextCheckpoint"
                class="navigation-map-marker navigation-map-marker--next"
            >
              <i class="pi pi-map-marker" aria-hidden="true" />
              <span class="navigation-map-marker-label">
                {{ t("navigation.map.next") }}: {{ nextCheckpoint.name }}
              </span>
            </div>

            <!-- Route progress overlay -->
            <div class="navigation-map-progress">
              <div class="navigation-map-progress-head">
                <span>{{ t("navigation.map.progress") }}</span>
                <strong>{{ checkpointStats.percentage }}%</strong>
              </div>
              <div class="navigation-progress-bar">
                <div
                    class="navigation-progress-fill"
                    :style="{ width: checkpointStats.percentage + '%' }"
                />
              </div>
            </div>

            <div class="navigation-map-sos-wrap">
              <pv-button
                  type="button"
                  :label="`⚠️ ${t('incident.report')}`"
                  severity="danger"
                  class="navigation-map-sos"
                  @click="handleReportIncident"
              />
            </div>
          </div>

          <aside class="navigation-waypoints-card">
            <h3>{{ t("navigation.map.waypoints") }}</h3>

            <p v-if="!checkpoints.length" class="navigation-empty navigation-waypoint-list">
              {{ t("navigation.map.no-checkpoints") }}
            </p>

            <ul v-else class="navigation-waypoint-list">
              <li
                  v-for="cp in checkpoints"
                  :key="cp.order"
                  class="navigation-waypoint-item"
                  :class="{ completed: isCompleted(cp), 'is-next': isNext(cp) }"
              >
                <i class="pi pi-map-marker navigation-waypoint-pin" aria-hidden="true" />
                <span>{{ cp.name }}</span>
                <span
                    v-if="isNext(cp)"
                    class="navigation-waypoint-badge navigation-waypoint-badge--next"
                >
                  {{ t("navigation.map.next") }}
                </span>
                <span
                    v-else
                    class="navigation-waypoint-badge"
                    :class="isCompleted(cp) ? 'navigation-waypoint-badge--done' : 'navigation-waypoint-badge--pending'"
                >
                  <i
                      v-if="isCompleted(cp)"
                      class="pi pi-check navigation-waypoint-badge-icon"
                      aria-hidden="true"
                  />
                  {{ isCompleted(cp) ? t("navigation.map.completed") : t("navigation.map.pending") }}
                </span>
              </li>
            </ul>

            <div class="navigation-waypoints-footer">
              <pv-button
                  type="button"
                  :label="downloading
                    ? t('navigation.map.downloading')
                    : t('navigation.map.download-offline')"
                  class="navigation-outline-button"
                  icon="pi pi-download"
                  outlined
                  :loading="downloading"
                  @click="handleDownloadOffline"
              />
            </div>
          </aside>
        </div>
      </template>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </NavigationPanel>
</template>

<style scoped>
.navigation-incident-button {
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
}

.navigation-map-visual {
  position: relative;
  min-height: 460px;
  overflow: hidden;
}

/* FINISHED / status pill -> fixed to the top-left corner */
.navigation-map-visual .navigation-status-pill {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.navigation-map-topo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.navigation-map-topo path {
  fill: none;
  stroke: #1a3a2a;
  stroke-width: 2;
  opacity: 0.3;
}

.navigation-map-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.navigation-map-marker-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.7);
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;
}

.navigation-map-marker--current {
  top: 40%;
  left: 22%;
}

.navigation-map-dot {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #2563eb;
  border: 2px solid #ffffff;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.9);
  animation: navigation-marker-pulse 1.5s ease-in-out infinite;
}

@keyframes navigation-marker-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
}

.navigation-map-marker--next {
  top: 30%;
  right: 14%;
}

.navigation-map-marker--next .pi {
  color: #f59e0b;
  font-size: 1.2rem;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.7));
}

.navigation-map-progress {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 12px;
  padding: 14px 16px;
  z-index: 2;
}

.navigation-map-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  color: #e2e8f0;
  font-size: 0.72rem;
  font-weight: 700;
}

.navigation-map-progress-head strong {
  color: #ffffff;
  font-size: 0.95rem;
}

.navigation-map-progress .navigation-progress-bar {
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
}

.navigation-map-progress .navigation-progress-fill {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f97316 0%, #22c55e 100%);
}

/* FINISHED status badge -> green */
.navigation-status-pill--finished {
  background: #22c55e;
  color: #ffffff;
}

.navigation-waypoint-badge-icon {
  font-size: 0.62rem;
  margin-right: 4px;
}

.navigation-waypoint-item.is-next {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.5);
  border-radius: 10px;
}

.navigation-waypoint-badge--next {
  background: #f59e0b;
  color: #1f2937;
  font-weight: 800;
}

.navigation-map-sos-wrap {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}

.navigation-map-sos {
  font-weight: 800;
  letter-spacing: 0.02em;
  font-size: 0.98rem;
  padding: 0.9rem 1.5rem;
  background: #dc2626;
  border-color: #dc2626;
  box-shadow: 0 6px 18px rgba(220, 38, 38, 0.5);
  animation: navigation-sos-pulse 2s ease-in-out infinite;
}

.navigation-map-sos:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

@keyframes navigation-sos-pulse {
  0%,
  100% {
    box-shadow: 0 6px 18px rgba(220, 38, 38, 0.45);
  }
  50% {
    box-shadow: 0 6px 26px rgba(220, 38, 38, 0.85);
  }
}
</style>
