<script setup>
import IotNavTabs from "./iot-nav-tabs.vue";
</script>

<template>
  <section class="iot-page">
    <div class="iot-panel">
      <IotNavTabs />
      <div class="iot-panel-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.iot-panel-body {
  padding: 28px 30px 32px;
}
</style>
