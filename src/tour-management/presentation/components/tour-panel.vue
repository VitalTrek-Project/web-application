<script setup>
import TourNavTabs from "./tour-nav-tabs.vue";
</script>

<template>
  <section class="tour-page">
    <div class="tour-panel">
      <TourNavTabs />
      <div class="tour-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tour-panel-body {
  padding: 28px 30px 32px;
}

@media (max-width: 800px) {
  .tour-panel-body {
    padding: 20px 16px 24px;
  }
}
</style>
