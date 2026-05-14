<script setup>
import { computed } from "vue";
import useNavigationStore from "../application/navigation.store.js";

const store = useNavigationStore();

/**
 * DATA
 */
const expedition = computed(() =>
    store.currentExpedition ?? null
);

const checkpoints = computed(() =>
    expedition.value?.checkpoints ?? []
);

/**
 * Helpers
 */
const isCompleted = (checkpoint) => {
  const completed =
      store.progress?.completedCheckpoints ?? 0;

  return checkpoint.order <= completed;
};
</script>

<template>
  <div class="route-map">
    <h3>Route Map</h3>

    <!-- Empty -->
    <div v-if="!checkpoints.length">
      No checkpoints available
    </div>

    <!-- List -->
    <ul v-else class="checkpoint-list">
      <li
          v-for="cp in checkpoints"
          :key="cp.order"
          class="checkpoint-item"
          :class="{ completed: isCompleted(cp) }"
      >
        <div class="checkpoint-header">
          <span class="checkpoint-order">
            #{{ cp.order }}
          </span>

          <span class="checkpoint-name">
            {{ cp.name }}
          </span>
        </div>

        <div class="checkpoint-coords">
          📍 {{ cp.latitude }}, {{ cp.longitude }}
        </div>

        <div class="checkpoint-status">
          <span v-if="isCompleted(cp)">✅ Completed</span>
          <span v-else>⏳ Pending</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.route-map {
  background: #33465f;
  border: 1px solid rgba(185, 198, 216, 0.16);
  border-radius: 10px;
  padding: 16px;
  color: #ffffff;
}

.checkpoint-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.checkpoint-item {
  background: #3b506b;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.checkpoint-item.completed {
  border-left: 4px solid #22c55e;
}

.checkpoint-header {
  display: flex;
  gap: 10px;
  font-weight: bold;
}

.checkpoint-coords {
  font-size: 0.8rem;
  color: #d0d9e6;
}

.checkpoint-status {
  margin-top: 4px;
  font-size: 0.8rem;
}
</style>