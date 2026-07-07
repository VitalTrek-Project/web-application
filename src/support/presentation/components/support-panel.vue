<script setup>
import { computed, provide, ref } from "vue";
import { useRoute } from "vue-router";
import SupportNavTabs from "./support-nav-tabs.vue";
import BcSearchBar from "../../../shared/presentation/components/bc-search-bar.vue";
import { BC_SEARCH_KEY } from "../../../shared/presentation/composables/use-bc-search.js";

const route = useRoute();
const searchQuery = ref("");
provide(BC_SEARCH_KEY, searchQuery);

const showSearch = computed(() => route.name === "support-tickets");
</script>

<template>
  <section class="support-page">
    <div class="support-panel">
      <SupportNavTabs />
      <div v-if="showSearch" class="bc-panel-toolbar">
        <BcSearchBar v-model="searchQuery" />
      </div>
      <div class="support-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.support-panel-body {
  padding: 28px 30px 32px;
}

@media (max-width: 800px) {
  .support-panel-body {
    padding: 20px 16px 24px;
  }
}
</style>
