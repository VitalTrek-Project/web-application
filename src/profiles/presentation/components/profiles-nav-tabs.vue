<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
</script>

<template>
  <nav class="support-tabs" :aria-label="t('profile.title')">
    <router-link to="/profile" class="support-tab" :class="{ 'support-tab-active': route.path === '/profile' }">
      {{ t("profile.tabs.profile") }}
    </router-link>
    <router-link :to="{ name: 'my-preferences' }" class="support-tab" :class="{ 'support-tab-active': route.name === 'my-preferences' }">
      {{ t("profile.tabs.preferences") }}
    </router-link>
  </nav>
</template>
