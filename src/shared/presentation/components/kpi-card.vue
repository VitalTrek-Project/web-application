<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: 0 },
  deltaPercentage: { type: Number, default: null },
  invertDelta: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: "default" }
});

const hasDelta = computed(() => props.deltaPercentage !== null && props.deltaPercentage !== undefined);

const deltaDirection = computed(() => {
  if (!hasDelta.value) return "flat";
  if (props.deltaPercentage > 0) return "up";
  if (props.deltaPercentage < 0) return "down";
  return "flat";
});

const deltaTone = computed(() => {
  if (deltaDirection.value === "flat") return "neutral";
  const isUp = deltaDirection.value === "up";
  const positive = props.invertDelta ? !isUp : isUp;
  return positive ? "positive" : "negative";
});

const deltaIcon = computed(() => {
  if (deltaDirection.value === "up") return "pi pi-arrow-up";
  if (deltaDirection.value === "down") return "pi pi-arrow-down";
  return "pi pi-minus";
});

const formattedDelta = computed(() =>
  hasDelta.value ? `${Math.abs(props.deltaPercentage).toFixed(1)}%` : ""
);
</script>

<template>
  <article class="kpi-card" :class="`kpi-card--${variant}`">
    <pv-skeleton v-if="loading" width="70%" height="1.9rem" class="kpi-card__skeleton" />
    <template v-else>
      <span class="kpi-card__label">{{ label }}</span>
      <strong class="kpi-card__value">{{ value }}</strong>
      <span v-if="hasDelta" class="kpi-card__delta" :class="`kpi-card__delta--${deltaTone}`">
        <i :class="deltaIcon" aria-hidden="true" />
        {{ formattedDelta }}
      </span>
    </template>
  </article>
</template>

<style scoped>
.kpi-card {
  border-radius: 14px;
  padding: 16px 18px;
  background: rgba(255, 122, 48, 0.08);
  border: 1px solid rgba(255, 122, 48, 0.22);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.kpi-card--teal {
  background: rgba(20, 184, 166, 0.08);
  border-color: rgba(20, 184, 166, 0.22);
}

.kpi-card--muted {
  background: rgba(148, 163, 184, 0.06);
  border-color: rgba(148, 163, 184, 0.16);
}

.kpi-card__label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
}

.kpi-card__value {
  font-size: 1.55rem;
  font-family: var(--heading);
  color: #ffffff;
  line-height: 1.1;
}

.kpi-card__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  font-size: 0.7rem;
  font-weight: 700;
}

.kpi-card__delta i {
  font-size: 0.62rem;
}

.kpi-card__delta--positive {
  color: #6ee7a0;
}

.kpi-card__delta--negative {
  color: #fca5a5;
}

.kpi-card__delta--neutral {
  color: #94a3b8;
}

.kpi-card__skeleton {
  margin: 4px 0;
}
</style>
