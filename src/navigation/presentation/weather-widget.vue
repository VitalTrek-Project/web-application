<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useNavigationStore from "../application/navigation.store.js";
import NavigationPanel from "./components/navigation-panel.vue";
import { getWeatherIcon } from "./utils/navigation-presenter.js";

const { t } = useI18n();
const store = useNavigationStore();
const { weather, errors } = storeToRefs(store);
const { fetchWeather } = store;

const loading = ref(false);

const weatherIcon = computed(() => getWeatherIcon(weather.value?.condition));

const loadWeather = async (latitude = 0, longitude = 0) => {
  loading.value = true;
  try {
    await fetchWeather(latitude, longitude);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
      () => loadWeather(0, 0),
      { timeout: 5000 }
    );
  } else {
    loadWeather(0, 0);
  }
});
</script>

<template>
  <NavigationPanel>
    <div class="navigation-card">
      <div class="navigation-dashboard-header">
        <div>
          <h2 class="navigation-section-title">{{ t("weather.title") }}</h2>
          <p class="navigation-meta">{{ t("weather.subtitle") }}</p>
        </div>
        <div class="navigation-dashboard-actions">
          <pv-button
              icon="pi pi-refresh"
              :label="t('weather.refresh')"
              class="navigation-outline-button"
              outlined
              :loading="loading"
              @click="loadWeather()"
          />
        </div>
      </div>

      <section class="navigation-info-card">
        <div v-if="loading" class="navigation-empty">{{ t("weather.loading") }}</div>

        <template v-else-if="weather">
          <p v-if="weather.location" class="navigation-meta" style="color: #ff9a5c">
            <i class="pi pi-map-marker" aria-hidden="true" />
            {{ weather.location }}
          </p>

          <div class="navigation-weather-grid">
            <article class="navigation-weather-metric">
              <i :class="weatherIcon" aria-hidden="true" />
              <strong>{{ weather.temperatureCelsius }} °C</strong>
              <span>{{ t("weather.temperature") }}</span>
            </article>
            <article class="navigation-weather-metric">
              <i class="pi pi-cloud" aria-hidden="true" />
              <strong>{{ weather.condition }}</strong>
              <span>{{ t("weather.condition") }}</span>
            </article>
            <article class="navigation-weather-metric">
              <i class="pi pi-percentage" aria-hidden="true" />
              <strong>{{ weather.humidity }}%</strong>
              <span>{{ t("weather.humidity") }}</span>
            </article>
            <article class="navigation-weather-metric">
              <i class="pi pi-flag" aria-hidden="true" />
              <strong>{{ weather.windSpeedKmh }} km/h</strong>
              <span>{{ t("weather.wind") }}</span>
            </article>
          </div>
        </template>

        <p v-else class="navigation-empty">{{ t("weather.no-data") }}</p>
      </section>

      <div v-if="errors.length" class="monitoring-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </NavigationPanel>
</template>
