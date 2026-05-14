<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const isSpanish = computed(() => locale.value === 'es');

const toggleLanguage = () => {
  locale.value = isSpanish.value ? 'en' : 'es';
};
</script>

<template>
  <button
      type="button"
      class="language-toggle"
      :class="{ 'is-spanish': isSpanish }"
      @click="toggleLanguage"
      aria-label="Change language"
  >
    <span class="language-option language-option-es">ES</span>
    <span class="language-option language-option-en">EN</span>
    <span class="language-thumb">
      {{ isSpanish ? 'ES' : 'EN' }}
    </span>
  </button>
</template>

<style scoped>
.language-toggle {
  position: relative;
  width: 72px;
  height: 32px;
  padding: 3px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.55);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.language-toggle:hover {
  border-color: rgba(242, 106, 61, 0.65);
  background: rgba(15, 23, 42, 0.85);
}

.language-option {
  width: 50%;
  position: relative;
  z-index: 1;
  color: #94a3b8;
  font-size: 0.66rem;
  font-weight: 800;
  line-height: 1;
  text-align: center;
  pointer-events: none;
}

.language-thumb {
  position: absolute;
  z-index: 2;
  top: 3px;
  right: 3px;
  width: 32px;
  height: 24px;
  border-radius: 999px;
  background: #f26a3d;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 0.64rem;
  font-weight: 900;
  box-shadow: 0 8px 18px rgba(242, 106, 61, 0.35);
  transition: transform 0.28s ease;
}

.language-toggle.is-spanish .language-thumb {
  transform: translateX(-34px);
}

.language-toggle.is-spanish .language-option-es,
.language-toggle:not(.is-spanish) .language-option-en {
  color: transparent;
}

.language-toggle:focus-visible {
  outline: 2px solid #f26a3d;
  outline-offset: 3px;
}
</style>