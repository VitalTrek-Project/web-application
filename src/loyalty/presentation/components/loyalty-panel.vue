<script setup>
import LoyaltyNavTabs from "./loyalty-nav-tabs.vue";

defineProps({
  variant: { type: String, default: "tourist" }
});
</script>

<template>
  <section class="support-page loyalty-page" :class="`loyalty-page--${variant}`">
    <div class="support-panel">
      <LoyaltyNavTabs :variant="variant" />
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

.loyalty-page--tourist {
  width: min(560px, 100%);
}

@media (max-width: 800px) {
  .loyalty-panel-body {
    padding: 18px 14px 24px;
  }
}
</style>
