<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import useNavigationStore from "../application/navigation.store.js";

const { t } = useI18n();
const store = useNavigationStore();

const weather = ref(null);
const loading = ref(false);
const error = ref(null);

/**
 * Fetch weather from store
 */
const loadWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 🔥 puedes cambiar coords según tu lógica real
    weather.value = await store.fetchWeather(0, 0);

  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadWeather();
});
</script>

<template>
  <div class="weather-widget">
    <h3>{{ t('weather.title') }}</h3>

    <!-- Loading -->
    <div v-if="loading">
      {{ t('weather.loading') }}
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error">
      {{ t('errors.occurred') }}:
      {{ error?.message || error }}
    </div>

    <!-- Weather Info -->
    <div v-else-if="weather">
      <p>
        🌡 {{ t('weather.temperature') }}:
        {{ weather.temperatureCelsius }} °C
      </p>

      <p>
        ☁️ {{ t('weather.condition') }}:
        {{ weather.condition }}
      </p>

      <p>
        💧 {{ t('weather.humidity') }}:
        {{ weather.humidity }}%
      </p>

      <p>
        🌬 {{ t('weather.wind') }}:
        {{ weather.windSpeedKmh }} km/h
      </p>
    </div>

    <!-- Reload -->
    <div class="actions">
      <pv-button
          icon="pi pi-refresh"
          :label="t('weather.refresh')"
          @click="loadWeather"
          :loading="loading"
      />
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  background: #33465f;
  border: 1px solid rgba(185, 198, 216, 0.16);
  border-radius: 10px;
  padding: 16px;
  color: #ffffff;
}

.weather-widget h3 {
  margin-bottom: 10px;
}

.error {
  color: #fecaca;
  font-size: 0.8rem;
}

.actions {
  margin-top: 12px;
}
</style>