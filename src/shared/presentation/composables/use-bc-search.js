import { computed, inject, ref, unref } from "vue";

export const BC_SEARCH_KEY = "bcSearchQuery";

/**
 * @param {import('vue').Ref<Object[]>|Object[]} items
 * @param {import('vue').Ref<string>|string} [query]
 */
export function filterBySearchQuery(items, query) {
  const list = unref(items) ?? [];
  const q = String(unref(query) ?? "")
    .trim()
    .toLowerCase();

  if (!q) {
    return list;
  }

  return list.filter((item) =>
    Object.values(item ?? {}).some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(q)
    )
  );
}

/**
 * @param {import('vue').Ref<Object[]>|Object[]} items
 */
export function useBcSearch(items) {
  const searchQuery = inject(BC_SEARCH_KEY, ref(""));

  const filteredItems = computed(() =>
    filterBySearchQuery(items, searchQuery)
  );

  return { searchQuery, filteredItems };
}
