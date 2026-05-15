<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

function isSignsForm() {
  return (
    route.name === "monitoring-sign-new" ||
    route.name === "monitoring-sign-edit"
  );
}

function isAlertsSection() {
  return (
    route.name === "monitoring-alert" ||
    route.name === "monitoring-alert-new" ||
    route.name === "monitoring-alert-edit"
  );
}
</script>

<template>
  <nav class="monitoring-tabs" aria-label="Monitoring">
    <router-link
        :to="{ name: 'monitoring-signs' }"
        class="monitoring-tab"
        exact-active-class="monitoring-tab-active"
    >
      {{ t("monitoring.tabs.vital-signs") }}
    </router-link>

    <router-link
        :to="{ name: 'monitoring-sign-new' }"
        class="monitoring-tab"
        :class="{ 'monitoring-tab-active': isSignsForm() }"
    >
      {{ t("monitoring.tabs.new-sign") }}
    </router-link>

    <router-link
        :to="{ name: 'monitoring-alert' }"
        class="monitoring-tab"
        :class="{ 'monitoring-tab-active': isAlertsSection() }"
    >
      {{ t("monitoring.tabs.alerts") }}
    </router-link>
  </nav>
</template>
