<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps({
  route: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const { t } = useI18n();
const router = useRouter();

const goToDetail = () => {
  router.push({ name: "route-detail", params: { id: props.route.id } });
};
</script>

<template>
  <article class="route-card" :class="{ 'route-card--compact': compact }">
    <div class="route-card-visual" :class="route.headerClass">
      <span class="route-card-icon" aria-hidden="true">{{ route.icon }}</span>
      <span class="route-card-price">{{ route.priceLabel }}</span>
      <span class="route-card-difficulty">{{ t(route.difficultyLabelKey) }}</span>
    </div>

    <div class="route-card-body">
      <span class="route-card-region">{{ route.region }}</span>
      <h3 class="route-card-title">{{ route.title }}</h3>
      <p class="route-card-description">{{ route.description }}</p>

      <div class="route-card-stats">
        <span>📏 {{ route.distanceKm }} km</span>
        <span>📅 {{ route.days }} {{ t("platform.route.days") }}</span>
        <span>⛰ {{ route.maxAltitudeM }} m</span>
      </div>

      <div class="route-card-actions">
        <pv-button
            :label="t('platform.route.start')"
            class="platform-primary-button"
            @click="goToDetail"
        />
        <button type="button" class="route-card-more" @click="goToDetail">
          {{ t("platform.route.see-more") }}
        </button>
      </div>
    </div>
  </article>
</template>
