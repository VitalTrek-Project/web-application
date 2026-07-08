import { computed, onMounted, ref, watch } from "vue";
import useTourManagementStore from "../../../tour-management/application/tourManagement.store.js";
import { toRouteCard } from "../utils/route-presenter.js";
import { STATIC_ROUTES } from "../data/platform-static.js";

/**
 * Loads route cards from platform tours when available, with static fallback.
 */
export function useRouteCatalog(options = {}) {
  const { limit = null, featuredOnly = false } = options;
  const store = useTourManagementStore();
  const loading = ref(false);
  const usedApi = ref(false);

  const routes = computed(() => {
    let items = [];
    if (store.tours.length) {
      items = store.tours.map((tour, index) => toRouteCard(tour, index));
      usedApi.value = true;
    } else {
      items = STATIC_ROUTES.map((route, index) => toRouteCard(route, index));
      usedApi.value = false;
    }

    if (featuredOnly) {
      items = items.filter((route) => route.status !== "full").slice(0, 6);
    }
    if (limit) {
      items = items.slice(0, limit);
    }
    return items;
  });

  onMounted(async () => {
    if (store.toursLoaded) {
      usedApi.value = store.tours.length > 0;
      return;
    }
    loading.value = true;
    try {
      // Catalog browse: no assignment hydration; store calls agency list or search with a non-empty term.
      await store.fetchTours({hydrate: false});
    } finally {
      loading.value = false;
      usedApi.value = store.tours.length > 0;
    }
  });

  watch(
    () => store.toursLoaded,
    (loaded) => {
      if (!loaded) return;
      usedApi.value = store.tours.length > 0;
      loading.value = false;
    },
    { immediate: true }
  );

  return { routes, loading, usedApi };
}
