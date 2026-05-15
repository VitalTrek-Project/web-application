<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

function isFormTab() {
  return (
    route.name === "tour-management-tour-new" ||
    route.name === "tour-management-tour-edit"
  );
}
</script>

<template>
  <nav class="tour-tabs" aria-label="Tour management">
    <router-link
        to="/tours"
        class="tour-tab"
        exact-active-class="tour-tab-active"
    >
      {{ t("tour.tabs.list") }}
    </router-link>

    <router-link
        :to="{ name: 'tour-management-tour-new' }"
        class="tour-tab"
        :class="{ 'tour-tab-active': isFormTab() }"
    >
      {{ t("tour.tabs.form") }}
    </router-link>

    <router-link
        to="/tourists-assignment"
        class="tour-tab"
        active-class="tour-tab-active"
    >
      {{ t("tour.tabs.assign-tourists") }}
    </router-link>
  </nav>
</template>
