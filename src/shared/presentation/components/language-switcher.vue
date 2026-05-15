<script setup>
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const setLocale = (code) => {
  locale.value = code;
};
</script>

<template>
  <div class="language-pills" role="group" aria-label="Language">
    <button
        type="button"
        class="language-pill"
        :class="{ 'language-pill-active': locale === 'es' }"
        @click="setLocale('es')"
    >
      ES
    </button>
    <button
        type="button"
        class="language-pill"
        :class="{ 'language-pill-active': locale === 'en' }"
        @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.language-pills {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.language-pill {
  min-width: 44px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.5);
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-pill:hover {
  border-color: rgba(242, 106, 61, 0.5);
  color: #e2e8f0;
}

.language-pill-active {
  background: #f26a3d;
  border-color: #f26a3d;
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(242, 106, 61, 0.35);
}

.language-pill:focus-visible {
  outline: 2px solid #f26a3d;
  outline-offset: 2px;
}
</style>
