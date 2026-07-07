<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

function isTicketsSection() {
  return (
    route.name === "support-tickets" ||
    route.name === "support-ticket-detail" ||
    route.name === "support-ticket-edit"
  );
}
</script>

<template>
  <nav class="support-tabs" :aria-label="t('support.title')">
    <router-link
        :to="{ name: 'support-tickets' }"
        class="support-tab"
        :class="{ 'support-tab-active': isTicketsSection() }"
    >
      {{ t("support.tabs.tickets") }}
    </router-link>

    <router-link
        :to="{ name: 'support-ticket-new' }"
        class="support-tab"
        exact-active-class="support-tab-active"
    >
      {{ t("support.tabs.new-ticket") }}
    </router-link>
  </nav>
</template>
