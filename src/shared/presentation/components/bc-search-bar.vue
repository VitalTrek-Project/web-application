<script setup>
import { useI18n } from "vue-i18n";

const model = defineModel({ type: String, default: "" });

const { t } = useI18n();
</script>

<template>
  <div class="bc-search-bar">
    <i class="pi pi-search bc-search-bar__icon" aria-hidden="true" />
    <pv-input-text
        v-model="model"
        type="search"
        class="bc-search-bar__input"
        :placeholder="t('common.search')"
    />
  </div>
</template>
