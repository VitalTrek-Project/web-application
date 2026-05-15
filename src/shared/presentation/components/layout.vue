<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";
import VitalTrekLogo from "./vital-trek-logo.vue";

const { t } = useI18n();
const route = useRoute();

const items = [
  { label: "option.home", to: "/home" },
  { label: "option.routes", to: "/routes" },
  { label: "option.navigation-expedition", to: "/navigation" },
  { label: "option.iot", to: "/iot" },
  { label: "option.tour-management", to: "/tours" },
  { label: "option.monitoring", to: "/monitoring/signs" },
  { label: "option.community", to: "/community" },
  { label: "option.agencies", to: "/agencies" },
  { label: "option.plans", to: "/plans" },
  { label: "option.identity-access", to: "/identity" },
  { label: "option.notifications-profile", to: "/notifications" },
  { label: "option.my-profile", to: "/profile" },
  { label: "option.about", to: "/about" }
];

const hideShellHero = computed(() =>
  ["/home", "/routes", "/community"].includes(route.path)
);

const hero = computed(() => {
  const path = route.path;
  if (path.startsWith("/monitoring")) {
    return {
      eyebrow: t("monitoring.context"),
      title: t("monitoring.title"),
      subtitle: t("monitoring.subtitle")
    };
  }
  if (path.startsWith("/navigation")) {
    return {
      eyebrow: t("navigation.context"),
      title: t("navigation.title"),
      subtitle: t("navigation.subtitle")
    };
  }
  if (path.startsWith("/iot")) {
    return {
      eyebrow: t("iot.context"),
      title: t("iot.title"),
      subtitle: t("iot.subtitle")
    };
  }
  if (path.startsWith("/tours") || path.startsWith("/tourists-assignment")) {
    return {
      eyebrow: t("tour-management.context"),
      title: t("tour-management.title"),
      subtitle: t("tour-management.subtitle")
    };
  }
  return {
    eyebrow: t("app-shell.context"),
    title: t("app-shell.title"),
    subtitle: t("app-shell.subtitle")
  };
});
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <VitalTrekLogo variant="sidebar" />
        <span>VitalTrek</span>
      </div>

      <language-switcher />

      <nav class="sidebar-nav">
        <router-link
            v-for="item in items"
            :key="item.label"
            :to="item.to"
            class="sidebar-link"
            active-class="sidebar-link-active"
            :class="{
              'sidebar-link-active':
                (item.to === '/monitoring/signs' && route.path.startsWith('/monitoring')) ||
                (item.to === '/navigation' && route.path.startsWith('/navigation')) ||
                (item.to === '/iot' && route.path.startsWith('/iot'))
            }"
        >
          {{ t(item.label) }}
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <pv-button
            type="button"
            :label="t('sidebar.sos')"
            severity="danger"
            size="large"
            class="sos-button"
        />

        <div class="user-avatar" :aria-label="t('option.my-profile')">
          <i class="pi pi-user" aria-hidden="true" />
        </div>
      </div>
    </aside>

    <section class="page-area">
      <header v-if="!hideShellHero" class="hero-header">
        <div class="hero-content">
          <span class="eyebrow">{{ hero.eyebrow }}</span>
          <h1>{{ hero.title }}</h1>
          <p>{{ hero.subtitle }}</p>
        </div>
      </header>

      <main class="main-content" :class="{ 'main-content--platform': hideShellHero }">
        <router-view />
      </main>

      <footer class="footer">
        <footer-content />
        <div class="footer-bottom">
          <span>{{ t("footer.copyright") }}</span>
          <div class="store-buttons">
            <a href="#" class="store-button">{{ t("footer.app-store") }}</a>
            <a href="#" class="store-button">{{ t("footer.google-play") }}</a>
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #111b2a;
  color: #f8fafc;
}

.sidebar {
  width: 230px;
  min-height: 100vh;
  position: fixed;
  inset: 0 auto 0 0;
  background: #101a27;
  border-right: 1px solid rgba(148, 163, 184, 0.12);
  display: flex;
  flex-direction: column;
  padding: 28px 16px 24px;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f8fafc;
  font-weight: 700;
  margin-bottom: 20px;
}

.brand :deep(.vital-trek-logo--sidebar) {
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 28px;
}

.sidebar-link {
  color: #dbe4ef;
  text-decoration: none;
  font-size: 0.82rem;
  padding: 9px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-align: left;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.sidebar-link-active {
  background: linear-gradient(90deg, rgba(239, 100, 61, 0.35), rgba(239, 100, 61, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.75);
  color: #ffffff;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.sos-button {
  width: 100%;
  min-height: 52px;
  padding: 0.65rem 1rem;
  background: linear-gradient(180deg, #ff7a4f 0%, #e85a2e 100%);
  border: none;
  border-color: transparent;
  box-shadow:
    0 4px 14px rgba(242, 106, 61, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.sos-button :deep(.p-button-icon) {
  font-size: 1.15rem;
}

.sos-button:hover {
  filter: brightness(1.06);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f26a3d;
  color: #ffffff;
  font-size: 0.95rem;
  box-shadow: 0 0 0 4px rgba(242, 106, 61, 0.12);
}

.user-avatar .pi-user {
  font-size: 0.95rem;
}

.page-area {
  margin-left: 230px;
  min-height: 100vh;
  width: calc(100% - 230px);
  display: flex;
  flex-direction: column;
  background: #111b2a;
}

.hero-header {
  position: relative;
  min-height: 168px;
  display: flex;
  align-items: center;
  padding: 36px 12% 48px;
  overflow: hidden;
  background: #15102a;
  border-bottom: none;
}

.hero-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 140% at 88% -25%, rgba(192, 92, 255, 0.5) 0%, transparent 58%),
    radial-gradient(ellipse 70% 90% at 12% 110%, rgba(75, 35, 110, 0.45) 0%, transparent 52%),
    radial-gradient(ellipse 50% 80% at 50% 0%, rgba(120, 60, 160, 0.25) 0%, transparent 45%),
    linear-gradient(
      102deg,
      #7a3d9e 0%,
      #5b2a79 28%,
      #3d1f5c 58%,
      #221638 82%,
      #15102a 100%
    );
  pointer-events: none;
}

.hero-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(17, 27, 42, 0.55) 45%,
    #111b2a 100%
  );
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: left;
  max-width: 640px;
}

.eyebrow {
  display: block;
  color: #ff8f5f;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  font-weight: 800;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0;
  font-size: 2.15rem;
  line-height: 1.08;
  font-family: var(--heading);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.25);
  background: linear-gradient(180deg, #ffffff 0%, #f3eaf8 55%, #d4c4e8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-content p {
  margin: 10px 0 0;
  color: rgba(229, 216, 239, 0.82);
  font-size: 0.82rem;
  line-height: 1.5;
  max-width: 420px;
}

.main-content {
  flex: 1;
  padding: 28px 24px 48px;
  margin-top: -8px;
}

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.13);
  background: #0d1723;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 18px 24px 28px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  color: #8c99aa;
  font-size: 0.68rem;
}

.store-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.store-button {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  background: #111827;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #ffffff;
  text-decoration: none;
  font-size: 0.68rem;
  font-weight: 700;
  transition: background 0.2s ease;
}

.store-button:hover {
  background: #1f2937;
}

@media (max-width: 900px) {
  .sidebar {
    position: relative;
    width: 100%;
    min-height: auto;
  }

  .app-shell {
    flex-direction: column;
  }

  .page-area {
    margin-left: 0;
    width: 100%;
  }

  .hero-header {
    padding: 28px 20px 40px;
    min-height: auto;
  }

  .hero-content h1 {
    font-size: 1.65rem;
  }

  .main-content {
    padding: 20px 16px 32px;
    margin-top: 0;
  }
}
</style>
