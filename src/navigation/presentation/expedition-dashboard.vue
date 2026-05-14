<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import useNavigationStore from "../application/navigation.store.js";

import RouteMap from "./route-map.vue";
import WeatherWidget from "./weather-widget.vue";
import ExperienceLog from "./experience-log.vue";

const { t } = useI18n();
const store = useNavigationStore();

/**
 * STATE
 */
const expedition = computed(() =>
    store.currentExpedition ?? null
);

const progress = computed(() =>
    store.progress ?? null
);

/**
 * COMPUTED
 */
const progressPercentage = computed(() => {
  if (!progress.value) return 0;

  return progress.value.totalCheckpoints > 0
      ? (progress.value.completedCheckpoints /
      progress.value.totalCheckpoints) * 100
      : 0;
});

/**
 * METHODS
 */
const handleStart = async () => {
  if (!expedition.value) return;

  try {
    await store.startExpedition(expedition.value.tourId);
  } catch (error) {
    console.error(error);
  }
};

const handleFinish = async () => {
  if (!expedition.value) return;

  try {
    await store.finishExpedition(expedition.value.id);
  } catch (error) {
    console.error(error);
  }
};

/**
 * LIFECYCLE
 */
onMounted(async () => {
  try {
    await store.fetchExpedition();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <section class="dashboard">
    <h2>{{ t('expedition.title') }}</h2>

    <!-- NO DATA -->
    <div v-if="!expedition">
      {{ t('expedition.no-data') }}
    </div>

    <!-- DASHBOARD -->
    <div v-else class="dashboard-content">

      <!-- HEADER -->
      <div class="dashboard-header">
        <div>
          <p>
            <strong>{{ t('expedition.status') }}:</strong>
            {{ expedition.status }}
          </p>

          <p>
            <strong>{{ t('expedition.tour-id') }}:</strong>
            {{ expedition.tourId }}
          </p>
        </div>

        <!-- ACTIONS -->
        <div class="actions">
          <pv-button
              icon="pi pi-play"
              :label="t('expedition.start')"
              @click="handleStart"
              :disabled="expedition.status === 'started'"
          />

          <pv-button
              icon="pi pi-check"
              severity="success"
              :label="t('expedition.finish')"
              @click="handleFinish"
              :disabled="expedition.status === 'finished'"
          />
        </div>
      </div>

      <!-- PROGRESS -->
      <div class="progress-section" v-if="progress">
        <p>
          {{ t('expedition.progress') }}:
          {{ progress.completedCheckpoints }} /
          {{ progress.totalCheckpoints }}
        </p>

        <div class="progress-bar">
          <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
          />
        </div>
      </div>

      <!-- GRID -->
      <div class="dashboard-grid">

        <RouteMap />

        <WeatherWidget />

        <ExperienceLog />

      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  width: min(1200px, 100%);
  margin: 0 auto;
  color: #ffffff;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 10px;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-bar {
  height: 8px;
  background: #3b506b;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  transition: width 0.3s ease;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.dashboard-grid > *:nth-child(3) {
  grid-column: 1 / -1;
}
</style>