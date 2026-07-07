<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  empty: { type: Boolean, default: false },
  emptyMessage: { type: String, default: "" }
});
</script>

<template>
  <section class="chart-card">
    <header class="chart-card__header">
      <h3>{{ title }}</h3>
      <p v-if="subtitle">{{ subtitle }}</p>
    </header>
    <div class="chart-card__body">
      <pv-skeleton v-if="loading" width="100%" height="220px" />
      <div v-else-if="empty" class="chart-card__empty">
        <i class="pi pi-chart-bar" aria-hidden="true" />
        <p>{{ emptyMessage || t("dashboard.empty-generic") }}</p>
      </div>
      <slot v-else />
    </div>
  </section>
</template>

<style scoped>
.chart-card {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chart-card__header h3 {
  margin: 0 0 4px;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.05rem;
}

.chart-card__header p {
  margin: 0 0 14px;
  color: #94a3b8;
  font-size: 0.78rem;
}

.chart-card__body {
  flex: 1;
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.chart-card__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #64748b;
  text-align: center;
}

.chart-card__empty i {
  font-size: 1.8rem;
}

.chart-card__empty p {
  margin: 0;
  font-size: 0.8rem;
  max-width: 240px;
}
</style>
