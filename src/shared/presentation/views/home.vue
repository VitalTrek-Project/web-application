<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import RouteCard from "../components/route-card.vue";
import { useRouteCatalog } from "../composables/use-route-catalog.js";
import { HOME_STATS, HOME_FEATURES } from "../data/platform-static.js";

const { t } = useI18n();
const router = useRouter();
const { routes, loading } = useRouteCatalog({ featuredOnly: true });
</script>

<template>
  <div class="platform-page">
    <section class="platform-hero platform-hero--home">
      <span class="platform-eyebrow platform-eyebrow--teal">
        {{ t("platform.home.eyebrow") }}
      </span>
      <h1 class="platform-hero-title">{{ t("platform.home.title") }}</h1>
      <p class="platform-hero-subtitle">{{ t("platform.home.subtitle") }}</p>

      <div class="platform-hero-actions">
        <pv-button
            :label="t('platform.home.cta-routes')"
            class="platform-primary-button"
            @click="router.push('/routes')"
        />
        <pv-button
            :label="t('platform.home.cta-dashboard')"
            class="platform-secondary-button"
            outlined
            @click="router.push('/iot')"
        />
        <pv-button
            :label="t('sidebar.sos')"
            class="platform-sos-inline"
            @click="router.push('/navigation')"
        />
      </div>

      <div class="platform-stats-row">
        <div v-for="stat in HOME_STATS" :key="stat.labelKey" class="platform-stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ t(stat.labelKey) }}</span>
        </div>
      </div>
    </section>

    <section class="platform-features">
      <article
          v-for="feature in HOME_FEATURES"
          :key="feature.titleKey"
          class="platform-feature-card"
      >
        <span class="platform-feature-icon">{{ feature.icon }}</span>
        <h3>{{ t(feature.titleKey) }}</h3>
        <p>{{ t(feature.subtitleKey) }}</p>
      </article>
    </section>

    <section class="platform-section">
      <div class="platform-section-header">
        <h2>{{ t("platform.home.featured-title") }}</h2>
        <pv-button
            :label="t('platform.home.see-all')"
            class="platform-secondary-button"
            outlined
            @click="router.push('/routes')"
        />
      </div>

      <p v-if="loading" class="platform-muted">{{ t("platform.loading") }}</p>

      <div v-else class="platform-routes-grid">
        <RouteCard
            v-for="route in routes"
            :key="route.id"
            :route="route"
            compact
        />
      </div>
    </section>
  </div>
</template>
