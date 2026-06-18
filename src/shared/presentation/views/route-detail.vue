<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouteCatalog } from "../composables/use-route-catalog.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const { routes, loading } = useRouteCatalog();

const enrolled = ref(false);
const enrolling = ref(false);

const current = computed(() =>
  routes.value.find((item) => String(item.id) === String(route.params.id))
);

const goBack = () => router.push({ name: "routes" });

const confirmEnrollment = () => {
  if (!current.value) return;
  confirm.require({
    message: t("platform.detail.enroll-confirm", { title: current.value.title }),
    header: t("platform.detail.enroll-header"),
    icon: "pi pi-check-circle",
    acceptProps: {
      label: t("platform.detail.enroll-accept"),
      icon: "pi pi-check"
    },
    rejectProps: {
      label: t("platform.detail.enroll-cancel"),
      severity: "secondary",
      outlined: true
    },
    accept: () => {
      enrolling.value = true;
      setTimeout(() => {
        enrolling.value = false;
        enrolled.value = true;
        toast.add({
          severity: "success",
          summary: t("platform.detail.enroll-success-summary"),
          detail: t("platform.detail.enroll-success-detail", {
            title: current.value.title
          }),
          life: 5000
        });
      }, 900);
    }
  });
};
</script>

<template>
  <div class="platform-page">
    <button type="button" class="detail-back" @click="goBack">
      ‹ {{ t("platform.detail.back") }}
    </button>

    <p v-if="loading" class="platform-muted">{{ t("platform.loading") }}</p>

    <p v-else-if="!current" class="platform-muted">
      {{ t("platform.detail.not-found") }}
    </p>

    <div v-else class="detail-layout">
      <article class="detail-main">
        <div class="detail-visual" :class="current.headerClass">
          <span class="detail-visual-icon">{{ current.icon }}</span>
          <span class="detail-visual-region">{{ current.region }}</span>
          <span class="detail-visual-difficulty">
            {{ t(current.difficultyLabelKey) }}
          </span>
        </div>

        <h1 class="detail-title">{{ current.title }}</h1>
        <p class="detail-description">{{ current.description }}</p>

        <div class="detail-stats">
          <div class="detail-stat">
            <span class="detail-stat-label">{{ t("platform.detail.distance") }}</span>
            <strong>{{ current.distanceKm }} km</strong>
          </div>
          <div class="detail-stat">
            <span class="detail-stat-label">{{ t("platform.detail.duration") }}</span>
            <strong>{{ current.days }} {{ t("platform.route.days") }}</strong>
          </div>
          <div class="detail-stat">
            <span class="detail-stat-label">{{ t("platform.detail.altitude") }}</span>
            <strong>{{ current.maxAltitudeM }} m</strong>
          </div>
          <div class="detail-stat">
            <span class="detail-stat-label">{{ t("platform.detail.difficulty") }}</span>
            <strong>{{ t(current.difficultyLabelKey) }}</strong>
          </div>
        </div>
      </article>

      <aside class="detail-enroll-card">
        <span class="detail-price-label">{{ t("platform.detail.price") }}</span>
        <strong class="detail-price">{{ current.priceLabel }}</strong>
        <p class="detail-enroll-note">{{ t("platform.detail.enroll-note") }}</p>

        <pv-button
            v-if="!enrolled"
            :label="t('platform.detail.enroll')"
            icon="pi pi-user-plus"
            class="platform-primary-button detail-enroll-button"
            :loading="enrolling"
            @click="confirmEnrollment"
        />

        <div v-else class="detail-enrolled">
          <i class="pi pi-check-circle" aria-hidden="true" />
          <span>{{ t("platform.detail.enrolled") }}</span>
        </div>

        <button type="button" class="detail-secondary" @click="goBack">
          {{ t("platform.detail.back-to-catalog") }}
        </button>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.detail-back {
  background: none;
  border: none;
  color: #9fb0c4;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 12px;
}

.detail-back:hover {
  color: #ffffff;
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.detail-main {
  background: #1a2535;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 16px;
  padding: 0 0 24px;
  overflow: hidden;
}

.detail-visual {
  position: relative;
  height: 200px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2c8a78, #1f6f8b);
}

.detail-visual-icon {
  font-size: 4rem;
}

.detail-visual-region,
.detail-visual-difficulty {
  position: absolute;
  top: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: rgba(15, 23, 42, 0.55);
  color: #ffffff;
}

.detail-visual-region {
  left: 14px;
}

.detail-visual-difficulty {
  right: 14px;
}

.detail-title {
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1.7rem;
  margin: 20px 24px 8px;
}

.detail-description {
  color: #c4d0e0;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 24px 20px;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 0 24px;
}

.detail-stat {
  background: rgba(59, 80, 107, 0.4);
  border: 1px solid rgba(220, 229, 241, 0.12);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-stat-label {
  color: #9fb0c4;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-stat strong {
  color: #ffffff;
  font-size: 1.05rem;
}

.detail-enroll-card {
  background: #1a2535;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 24px;
}

.detail-price-label {
  color: #9fb0c4;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-price {
  color: #ffffff;
  font-size: 2rem;
  font-family: var(--heading);
}

.detail-enroll-note {
  color: #aebacb;
  font-size: 0.78rem;
  line-height: 1.5;
  margin: 0 0 6px;
}

.detail-enroll-button {
  width: 100%;
  justify-content: center;
}

.detail-enrolled {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(34, 197, 94, 0.45);
  border-radius: 10px;
  padding: 12px;
  color: #86efac;
  font-weight: 800;
}

.detail-secondary {
  background: none;
  border: none;
  color: #9fb0c4;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
}

.detail-secondary:hover {
  color: #ffffff;
}

@media (max-width: 850px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-enroll-card {
    position: static;
  }
}
</style>