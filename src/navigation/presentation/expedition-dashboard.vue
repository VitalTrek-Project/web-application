<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import {
  formatNavigationDate,
  getExpeditionStatusKey,
  summarizeCheckpointProgress
} from "./utils/navigation-presenter.js";

const { t } = useI18n();
const store = useNavigationStore();
const { currentExpedition, progress, errors, loading } = storeToRefs(store);
const { ensureExpeditionLoaded, startExpedition, finishExpedition } = store;

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
      </template>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </NavigationPanel>
</template>
