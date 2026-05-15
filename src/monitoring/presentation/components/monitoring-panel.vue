<script setup>
import MonitoringNavTabs from "./monitoring-nav-tabs.vue";
</script>

<template>
  <section class="monitoring-page">
    <div class="monitoring-panel">
      <MonitoringNavTabs />
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
