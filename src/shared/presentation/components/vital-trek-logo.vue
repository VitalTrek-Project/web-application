<script setup>
import { ref } from "vue";
import { VITAL_TREK_LOGO_ALT, VITAL_TREK_LOGO_SRC } from "../constants/brand.js";

defineProps({
  variant: {
    type: String,
    default: "sidebar",
    validator: (value) => ["sidebar", "footer"].includes(value)
  }
});

const imageFailed = ref(false);
</script>

<template>
  <img
      v-if="!imageFailed"
      :src="VITAL_TREK_LOGO_SRC"
      :alt="VITAL_TREK_LOGO_ALT"
      class="vital-trek-logo"
      :class="`vital-trek-logo--${variant}`"
      @error="imageFailed = true"
  />
  <span
      v-else
      class="vital-trek-logo-fallback"
      :class="`vital-trek-logo-fallback--${variant}`"
      aria-hidden="true"
  >
    VT
  </span>
</template>

<style scoped>
.vital-trek-logo {
  display: block;
  object-fit: contain;
}

.vital-trek-logo--sidebar {
  width: 30px;
  height: 30px;
}

.vital-trek-logo--footer {
  width: 32px;
  height: 32px;
}

.vital-trek-logo-fallback {
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 122, 48, 0.2);
  color: #ff8f4f;
  font-weight: 800;
  font-size: 0.62rem;
}

.vital-trek-logo-fallback--sidebar {
  width: 30px;
  height: 30px;
}

.vital-trek-logo-fallback--footer {
  width: 32px;
  height: 32px;
}
</style>
