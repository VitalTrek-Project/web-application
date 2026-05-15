<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { t } = useI18n();

const unavailableRoute = computed(() => route.fullPath);
</script>

<template>
  <div class="placeholder-page m-4">
    <h1>{{ t("page-not-found.title") }}</h1>
    <p>
      {{ t("page-not-found.content", { "unavailable-route": unavailableRoute }) }}
    </p>
    <router-link class="placeholder-page__link" to="/home">
      {{ t("page-not-found.go-home") }}
    </router-link>
  </div>
</template>

<style scoped>
.placeholder-page h1 {
  margin: 0 0 12px;
  font-family: var(--heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
}

.placeholder-page p {
  margin: 0 0 16px;
  color: #cbd5e1;
  font-size: 0.9rem;
}

.placeholder-page__link {
  color: #ff8f4f;
  font-weight: 600;
  text-decoration: none;
}

.placeholder-page__link:hover {
  color: #ffb07a;
  text-decoration: underline;
}
</style>
