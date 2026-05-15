<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <nav class="navigation-tabs" aria-label="Navigation">
    <router-link
        :to="{ name: 'navigation-map' }"
        class="navigation-tab"
        active-class="navigation-tab-active"
    >
      {{ t("navigation.tabs.map-route") }}
    </router-link>

    <router-link
        :to="{ name: 'navigation-weather' }"
        class="navigation-tab"
        active-class="navigation-tab-active"
    >
      {{ t("navigation.tabs.climate") }}
    </router-link>

    <router-link
        :to="{ name: 'navigation-log' }"
        class="navigation-tab"
        active-class="navigation-tab-active"
    >
      {{ t("navigation.tabs.binnacle") }}
    </router-link>

    <router-link
        :to="{ name: 'navigation-expedition' }"
        class="navigation-tab"
        active-class="navigation-tab-active"
    >
      {{ t("navigation.tabs.expedition-panel") }}
    </router-link>
  </nav>
</template>
