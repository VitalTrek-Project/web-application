<script setup>
import { computed, provide, ref } from "vue";
import { useRoute } from "vue-router";
import MonitoringNavTabs from "./monitoring-nav-tabs.vue";
import BcSearchBar from "../../../shared/presentation/components/bc-search-bar.vue";
import { BC_SEARCH_KEY } from "../../../shared/presentation/composables/use-bc-search.js";

const route = useRoute();
const searchQuery = ref("");
provide(BC_SEARCH_KEY, searchQuery);

const showSearch = computed(
  () =>
    route.name === "monitoring-signs" || route.name === "monitoring-alert"
);
</script>

<template>
  <section class="monitoring-page">
    <div class="monitoring-panel">
      <MonitoringNavTabs />
      <div v-if="showSearch" class="bc-panel-toolbar">
        <BcSearchBar v-model="searchQuery" />
      </div>
      <div class="monitoring-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.monitoring-panel-body {
  padding: 28px 30px 32px;
}

@media (max-width: 800px) {
  .monitoring-panel-body {
    padding: 20px 16px 24px;
  }
}
</style>
