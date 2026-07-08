<script setup>
import ProfilesNavTabs from "./profiles-nav-tabs.vue";
</script>

<template>
  <section class="support-page profiles-page">
    <div class="support-panel">
      <ProfilesNavTabs />
      <div class="loyalty-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.loyalty-panel-body {
  padding: 28px 30px 32px;
}

.profiles-page {
  width: min(560px, 100%);
}

@media (max-width: 800px) {
  .loyalty-panel-body {
    padding: 18px 14px 24px;
  }
}
</style>
