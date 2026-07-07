<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const model = defineModel({ type: Object, required: true });
const { t } = useI18n();

const presetOptions = computed(() => [
  { label: t("date-range.today"), value: "today" },
  { label: t("date-range.7d"), value: "7d" },
  { label: t("date-range.30d"), value: "30d" },
  { label: t("date-range.custom"), value: "custom" }
]);

function rangeForPreset(preset) {
  const to = new Date();
  const from = new Date();
  if (preset === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (preset === "7d") {
    from.setDate(from.getDate() - 7);
  } else if (preset === "30d") {
    from.setDate(from.getDate() - 30);
  }
  return { from, to };
}

function selectPreset(preset) {
  if (preset === "custom") {
    model.value = { ...model.value, preset };
    return;
  }
  model.value = { preset, ...rangeForPreset(preset) };
}

function setCustomFrom(value) {
  model.value = { ...model.value, from: value };
}

function setCustomTo(value) {
  model.value = { ...model.value, to: value };
}
</script>

<template>
  <div class="date-range-filter">
    <pv-select-button
        :model-value="model.preset"
        :options="presetOptions"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        @update:model-value="selectPreset"
    />
    <div v-if="model.preset === 'custom'" class="date-range-filter__custom">
      <pv-date-picker
          :model-value="model.from"
          :placeholder="t('date-range.from')"
          date-format="dd/mm/yy"
          show-icon
          @update:model-value="setCustomFrom"
      />
      <span class="date-range-filter__sep" aria-hidden="true">—</span>
      <pv-date-picker
          :model-value="model.to"
          :placeholder="t('date-range.to')"
          date-format="dd/mm/yy"
          show-icon
          @update:model-value="setCustomTo"
      />
    </div>
  </div>
</template>

<style scoped>
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-range-filter__custom {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range-filter__sep {
  color: #64748b;
}

:deep(.p-selectbutton .p-togglebutton) {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(148, 163, 184, 0.22);
  color: #cbd5e1;
  font-size: 0.78rem;
}

:deep(.p-selectbutton .p-togglebutton.p-togglebutton-checked) {
  background: #ff7a30;
  border-color: #ff7a30;
  color: #0f1419;
  font-weight: 700;
}

:deep(.p-datepicker-input) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
  font-size: 0.8rem;
}

@media (max-width: 800px) {
  .date-range-filter {
    width: 100%;
  }

  .date-range-filter__custom {
    width: 100%;
  }

  .date-range-filter__custom :deep(.p-datepicker) {
    flex: 1;
  }
}
</style>
