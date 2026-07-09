<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import VitalTrekLogo from "../../../shared/presentation/components/vital-trek-logo.vue";
import mountainsHero from "../../../assets/images/mountains-hero.png";

const { t } = useI18n();

const features = computed(() => [
  { icon: "pi pi-map", label: t("iam.hero.features.routes") },
  { icon: "pi pi-heart-fill", label: t("iam.hero.features.monitoring") },
  { icon: "pi pi-users", label: t("iam.hero.features.community") },
  { icon: "pi pi-shield", label: t("iam.hero.features.alerts") },
  { icon: "pi pi-headphones", label: t("iam.hero.features.support") }
]);

const currentYear = new Date().getFullYear();
</script>

<template>
  <div class="auth-hero" :style="{ backgroundImage: `url(${mountainsHero})` }">
    <div class="auth-hero-overlay" aria-hidden="true" />

    <div class="auth-hero-content">
      <div class="auth-brand">
        <VitalTrekLogo variant="auth" />
        <span>Vital<span class="auth-brand-accent">Trek</span></span>
      </div>

      <h1 class="auth-hero-title">
        {{ t("iam.hero.title-line1") }}<br>
        <span class="auth-brand-accent">{{ t("iam.hero.title-line2") }}</span>
      </h1>

      <p class="auth-hero-subtitle">{{ t("iam.hero.subtitle") }}</p>

      <div class="auth-hero-features">
        <span v-for="feature in features" :key="feature.label" class="auth-hero-feature">
          <i :class="feature.icon" aria-hidden="true" />
          {{ feature.label }}
        </span>
      </div>
    </div>

    <p class="auth-hero-copyright">{{ t("iam.hero.copyright", { year: currentYear }) }}</p>
  </div>
</template>

<style scoped>
.auth-hero {
  position: relative;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 3rem;
  background-size: cover;
  background-position: center 55%;
  background-repeat: no-repeat;
  filter: grayscale(0.15);
  overflow: hidden;
}

.auth-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(11, 18, 32, 0.75) 0%, rgba(11, 18, 32, 0.55) 45%, rgba(11, 18, 32, 0.88) 100%),
    linear-gradient(90deg, rgba(11, 18, 32, 0.35) 0%, transparent 55%);
}

.auth-hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  max-width: 520px;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  font-size: 1.05rem;
  color: #f8fafc;
}

.auth-brand-accent {
  color: #f26a3d;
}

.auth-hero-title {
  margin: 0.5rem 0 0;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: clamp(2.1rem, 3.4vw, 2.9rem);
  font-weight: 700;
  line-height: 1.18;
  color: #ffffff;
}

.auth-hero-subtitle {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.98rem;
  line-height: 1.55;
  max-width: 420px;
}

.auth-hero-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.auth-hero-feature {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(248, 250, 252, 0.14);
  background: rgba(21, 29, 43, 0.55);
  backdrop-filter: blur(6px);
  color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 600;
}

.auth-hero-feature i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 8px;
  background: rgba(242, 106, 61, 0.18);
  color: #f26a3d;
  font-size: 0.85rem;
}

.auth-hero-copyright {
  position: relative;
  z-index: 1;
  margin: 0;
  color: rgba(248, 250, 252, 0.55);
  font-size: 0.78rem;
}

@media (min-width: 960px) {
  .auth-hero {
    display: flex;
    flex: 1.15;
    min-height: 100vh;
  }
}

@media (max-width: 640px) {
  .auth-hero-features {
    grid-template-columns: 1fr;
  }
}
</style>
