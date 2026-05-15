<script setup>
import NavigationNavTabs from "./navigation-nav-tabs.vue";
</script>

<template>
  <section class="navigation-page">
    <div class="navigation-panel">
      <NavigationNavTabs />
      <div class="navigation-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.navigation-panel-body {
  padding: 28px 30px 32px;
}

@media (max-width: 800px) {
  .navigation-panel-body {
    padding: 20px 16px 24px;
  }
}
</style>
