<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import {
  getExpeditionStatusKey,
  summarizeCheckpointProgress
} from "./utils/navigation-presenter.js";

const { t } = useI18n();
const store = useNavigationStore();
const { currentExpedition, progress, errors, loading } = storeToRefs(store);
const { ensureExpeditionLoaded } = store;

const checkpoints = computed(() => currentExpedition.value?.checkpoints ?? []);

const checkpointStats = computed(() =>
  summarizeCheckpointProgress(
    checkpoints.value,
    progress.value?.completedCheckpoints
  )
);

const isCompleted = (checkpoint) => {
  const completed = progress.value?.completedCheckpoints ?? 0;
  return checkpoint.order <= completed;
};

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
            <i class="pi pi-map" aria-hidden="true" />
            <p>{{ t("navigation.map.placeholder") }}</p>
            <span
                v-if="currentExpedition"
                class="navigation-status-pill"
                :class="`navigation-status-pill--${getExpeditionStatusKey(currentExpedition.status)}`"
            >
              {{ currentExpedition.status }}
            </span>
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
                  :class="{ completed: isCompleted(cp) }"
              >
                <i class="pi pi-map-marker navigation-waypoint-pin" aria-hidden="true" />
                <span>{{ cp.name }}</span>
                <span
                    class="navigation-waypoint-badge"
                    :class="isCompleted(cp) ? 'navigation-waypoint-badge--done' : 'navigation-waypoint-badge--pending'"
                >
                  {{ isCompleted(cp) ? t("navigation.map.completed") : t("navigation.map.pending") }}
                </span>
              </li>
            </ul>

            <div class="navigation-waypoints-footer">
              <pv-button
                  type="button"
                  :label="t('navigation.map.download-offline')"
                  class="navigation-outline-button"
                  icon="pi pi-download"
                  outlined
                  @click="store.downloadOfflineRoute(currentExpedition?.tourId)"
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
