<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import RouteCard from "../components/route-card.vue";
import { useRouteCatalog } from "../composables/use-route-catalog.js";
import { filterRoutes } from "../utils/route-presenter.js";

const { t } = useI18n();
const { routes, loading } = useRouteCatalog();

const search = ref("");
const activeFilter = ref("all");

const filters = [
  { id: "all", labelKey: "platform.filters.all" },
  { id: "easy", labelKey: "platform.difficulty.easy" },
  { id: "medium", labelKey: "platform.difficulty.moderate" },
  { id: "hard", labelKey: "platform.difficulty.difficult" }
];

const filteredRoutes = computed(() =>
  filterRoutes(routes.value, {
    query: search.value,
    difficulty: activeFilter.value
  })
);
</script>

<template>
  <div class="platform-page">
    <header class="platform-page-header">
      <span class="platform-eyebrow">{{ t("platform.routes.eyebrow") }}</span>
      <h1 class="platform-page-title">{{ t("platform.routes.title") }}</h1>
    </header>

    <div class="platform-toolbar">
      <input
          v-model="search"
          type="search"
          class="platform-search"
          :placeholder="t('platform.routes.search-placeholder')"
      />
      <div class="platform-filters">
        <button
            v-for="filter in filters"
            :key="filter.id"
            type="button"
            class="platform-filter-chip"
            :class="{ 'platform-filter-chip--active': activeFilter === filter.id }"
            @click="activeFilter = filter.id"
        >
          {{ t(filter.labelKey) }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="platform-muted">{{ t("platform.loading") }}</p>

    <div v-else class="platform-routes-grid">
      <RouteCard
          v-for="route in filteredRoutes"
          :key="route.id"
          :route="route"
      />
    </div>

    <p v-if="!loading && !filteredRoutes.length" class="platform-muted">
      {{ t("platform.routes.empty") }}
    </p>
  </div>
</template>
