<script setup>
// TODO [IAM]: Eliminar este componente cuando se implemente autenticación real.
// El modo activo pasará a leerse del claim `role` del JWT (via auth store),
// y este selector manual se reemplazará por un flujo de login con
// Account + TrekkerProfile / CompanyProfile. Ver app-mode.store.js.
import { useI18n } from "vue-i18n";
import { useAppModeStore } from "../../application/app-mode.store.js";

const { t } = useI18n();
const modeStore = useAppModeStore();
</script>

<template>
  <div class="mode-selector">
    <span class="mode-label">
      {{ modeStore.mode ? t('mode-selector.mode') : t('mode-selector.prompt') }}
    </span>
    <div class="mode-pills" role="group" :aria-label="t('mode-selector.label')">
      <button
        type="button"
        class="mode-pill"
        :class="{ 'mode-pill--active': modeStore.mode === 'trekker' }"
        @click="modeStore.setMode('trekker')"
      >
        {{ t('mode-selector.trekker') }}
      </button>
      <button
        type="button"
        class="mode-pill"
        :class="{ 'mode-pill--active': modeStore.mode === 'empresa' }"
        @click="modeStore.setMode('empresa')"
      >
        {{ t('mode-selector.empresa') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mode-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.mode-label {
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8c99aa;
  font-weight: 700;
  padding: 0 2px;
}

.mode-pills {
  display: flex;
  gap: 4px;
}

.mode-pill {
  flex: 1;
  padding: 5px 6px;
  border-radius: 6px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: transparent;
  color: #8c99aa;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  text-align: center;
  line-height: 1;
}

.mode-pill:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #dbe4ef;
  border-color: rgba(148, 163, 184, 0.35);
}

.mode-pill--active {
  background: linear-gradient(90deg, rgba(239, 100, 61, 0.35), rgba(239, 100, 61, 0.08));
  border-color: rgba(255, 255, 255, 0.75);
  color: #ffffff;
}
</style>