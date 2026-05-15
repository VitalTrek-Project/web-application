<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <nav class="iot-tabs" aria-label="IoT">
    <router-link
        :to="{ name: 'iot-devices' }"
        class="iot-tab"
        active-class="iot-tab-active"
    >
      {{ t("iot.tabs.devices") }}
    </router-link>
    <router-link
        :to="{ name: 'iot-readings' }"
        class="iot-tab"
        active-class="iot-tab-active"
    >
      {{ t("iot.tabs.readings") }}
    </router-link>
    <router-link
        :to="{ name: 'iot-control' }"
        class="iot-tab"
        active-class="iot-tab-active"
    >
      {{ t("iot.tabs.control") }}
    </router-link>
  </nav>
</template>
