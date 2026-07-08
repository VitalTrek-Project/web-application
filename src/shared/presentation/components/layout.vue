<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./language-switcher.vue";
import ModeSelector from "./mode-selector.vue";
import FooterContent from "./footer-content.vue";
import VitalTrekLogo from "./vital-trek-logo.vue";
import { useIncidentReport } from "../composables/use-incident-report.js";
import { useAppModeStore } from "../../application/app-mode.store.js";
import NotificationBell from "../../../loyalty/presentation/components/notification-bell.vue";
import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";

const { t } = useI18n();
const route = useRoute();
const { reportIncident } = useIncidentReport();
const modeStore = useAppModeStore();

/**
 * Only real, working modules. 404 placeholders were removed.
 * modes: which roles see the item ('trekker' | 'empresa')
 */
const navSections = [
  {
    key: "main",
    label: "sidebar.section.main",
    items: [
      { label: "option.home", to: "/home", icon: "pi pi-home", modes: ["trekker", "empresa"] },
      { label: "option.dashboard", to: "/dashboard", icon: "pi pi-chart-bar", modes: ["empresa"] },
      { label: "option.my-expedition", to: "/mi-expedicion", icon: "pi pi-map", modes: ["trekker"] }
    ]
  },
  {
    key: "operations",
    label: "sidebar.section.operations",
    items: [
      { label: "option.tour-management", to: "/tours", icon: "pi pi-compass", modes: ["empresa"] },
      { label: "option.routes", to: "/routes", icon: "pi pi-directions", modes: ["trekker", "empresa"] },
      { label: "option.navigation-expedition", to: "/navigation", icon: "pi pi-send", modes: ["trekker", "empresa"] },
      { label: "option.monitoring", to: "/monitoring/signs", icon: "pi pi-heart", modes: ["trekker", "empresa"] },
      { label: "option.iot", to: "/iot", icon: "pi pi-wifi", modes: ["empresa"] }
    ]
  },
  {
    key: "engagement",
    label: "sidebar.section.engagement",
    items: [
      { label: "option.loyalty", to: "/loyalty/points", icon: "pi pi-star", modes: ["trekker"] },
      { label: "option.loyalty-admin", to: "/loyalty-admin/settings", icon: "pi pi-star", modes: ["empresa"] },
      { label: "option.community", to: "/community", icon: "pi pi-users", modes: ["trekker", "empresa"] },
      { label: "option.plans", to: "/plans", icon: "pi pi-credit-card", modes: ["empresa"] }
    ]
  },
  {
    key: "account",
    label: "sidebar.section.account",
    items: [
      { label: "option.my-profile", to: "/profile", icon: "pi pi-user", modes: ["trekker", "empresa"] },
      { label: "option.support", to: "/support/tickets", icon: "pi pi-comments", modes: ["trekker", "empresa"] }
    ]
  }
];

const visibleSections = computed(() => {
  const mode = modeStore.mode;
  return navSections
    .map((section) => ({
      ...section,
      items: mode
        ? section.items.filter((item) => item.modes.includes(mode))
        : section.items
    }))
    .filter((section) => section.items.length > 0);
});

const showSos = computed(() => !modeStore.mode || modeStore.mode === "trekker");
const showNotificationBell = computed(() => !modeStore.mode || modeStore.mode === "trekker");
const isAuthScreen = computed(() => route.path.startsWith("/iam"));

const hideShellHero = computed(() =>
  isAuthScreen.value || ["/home", "/routes", "/community"].includes(route.path)
);

function isActive(to) {
  const path = route.path;
  if (to === "/home") return path === "/home";
  if (to === "/profile") return path.startsWith("/profile");
  if (to === "/monitoring/signs") return path.startsWith("/monitoring");
  if (to === "/navigation") return path.startsWith("/navigation");
  if (to === "/iot") return path.startsWith("/iot");
  if (to === "/support/tickets") return path.startsWith("/support");
  if (to === "/loyalty/points") return path.startsWith("/loyalty/");
  if (to === "/loyalty-admin/settings") return path.startsWith("/loyalty-admin");
  if (to === "/tours") return path.startsWith("/tours") || path.startsWith("/tourists-assignment");
  if (to === "/dashboard") return path.startsWith("/dashboard");
  if (to === "/mi-expedicion") return path.startsWith("/mi-expedicion");
  if (to === "/plans") return path.startsWith("/plans");
  return path === to || path.startsWith(`${to}/`);
}

const hero = computed(() => {
  const path = route.path;
  if (path.startsWith("/monitoring")) {
    return { eyebrow: t("monitoring.context"), title: t("monitoring.title"), subtitle: t("monitoring.subtitle") };
  }
  if (path.startsWith("/navigation")) {
    return { eyebrow: t("navigation.context"), title: t("navigation.title"), subtitle: t("navigation.subtitle") };
  }
  if (path.startsWith("/iot")) {
    return { eyebrow: t("iot.context"), title: t("iot.title"), subtitle: t("iot.subtitle") };
  }
  if (path.startsWith("/tours") || path.startsWith("/tourists-assignment")) {
    return { eyebrow: t("tour-management.context"), title: t("tour-management.title"), subtitle: t("tour-management.subtitle") };
  }
  if (path.startsWith("/support")) {
    return { eyebrow: t("support.context"), title: t("support.title"), subtitle: t("support.subtitle") };
  }
  if (path.startsWith("/dashboard")) {
    return { eyebrow: t("dashboard.admin.context"), title: t("dashboard.admin.title"), subtitle: t("dashboard.admin.subtitle") };
  }
  if (path.startsWith("/mi-expedicion")) {
    return { eyebrow: t("dashboard.tourist.context"), title: t("dashboard.tourist.title"), subtitle: t("dashboard.tourist.subtitle") };
  }
  if (path.startsWith("/loyalty-admin")) {
    return { eyebrow: t("loyalty.context"), title: t("loyalty.adminTitle"), subtitle: t("loyalty.adminSubtitle") };
  }
  if (path.startsWith("/loyalty")) {
    return { eyebrow: t("loyalty.context"), title: t("loyalty.title"), subtitle: t("loyalty.subtitle") };
  }
  if (path.startsWith("/profile")) {
    return { eyebrow: t("profile.context"), title: t("profile.title"), subtitle: t("profile.subtitle") };
  }
  if (path.startsWith("/plans")) {
    return { eyebrow: t("subscriptions.eyebrow"), title: t("subscriptions.title"), subtitle: t("subscriptions.subtitle") };
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

  <div v-if="isAuthScreen" class="auth-shell">
    <router-view />
  </div>

  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <VitalTrekLogo variant="sidebar" />
        <div class="brand-text">
          <span class="brand-name">VitalTrek</span>
          <span class="brand-tag">Platform</span>
        </div>
      </div>

      <div class="sidebar-tools">
        <language-switcher />
        <mode-selector />
      </div>

      <nav class="sidebar-nav" aria-label="Main">
        <div v-for="section in visibleSections" :key="section.key" class="nav-section">
          <p class="nav-section-label">{{ t(section.label) }}</p>
          <router-link
              v-for="item in section.items"
              :key="item.label"
              :to="item.to"
              class="sidebar-link"
              :class="{ 'sidebar-link-active': isActive(item.to) }"
          >
            <i :class="item.icon" aria-hidden="true" />
            <span>{{ t(item.label) }}</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-bottom">
        <pv-button
            v-if="showSos"
            type="button"
            :label="t('sidebar.sos')"
            severity="danger"
            size="large"
            class="sos-button"
            @click="reportIncident({ source: 'sidebar-sos' })"
        />

        <NotificationBell v-if="showNotificationBell" />
        <AuthenticationSection />
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
        </div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  background: #0b1220;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  background: #0e1622;
  color: #f8fafc;
}

.sidebar {
  width: 260px;
  min-height: 100vh;
  position: fixed;
  inset: 0 auto 0 0;
  background: linear-gradient(180deg, #101925 0%, #0c141f 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  flex-direction: column;
  padding: 22px 14px 20px;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding: 4px 8px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-name {
  color: #f8fafc;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
}

.brand-tag {
  color: #7d8fa8;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand :deep(.vital-trek-logo--sidebar) {
  flex-shrink: 0;
}

.sidebar-tools {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 4px 8px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
  overflow-y: auto;
  padding-right: 2px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section-label {
  margin: 0 0 4px 10px;
  color: #64748b;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b7c4d6;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  border: 1px solid transparent;
  text-align: left;
}

.sidebar-link i {
  width: 1.1rem;
  text-align: center;
  font-size: 0.92rem;
  color: #7d8fa8;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.sidebar-link:hover i {
  color: #f26a3d;
}

.sidebar-link-active {
  background: linear-gradient(90deg, rgba(242, 106, 61, 0.22), rgba(242, 106, 61, 0.06));
  border-color: rgba(242, 106, 61, 0.35);
  color: #ffffff;
}

.sidebar-link-active i {
  color: #f26a3d;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.sos-button {
  width: 100%;
  min-height: 48px;
  background: linear-gradient(180deg, #ff7a4f 0%, #e85a2e 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(242, 106, 61, 0.4);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.sos-button:hover {
  filter: brightness(1.05);
}

.page-area {
  margin-left: 260px;
  min-height: 100vh;
  width: calc(100% - 260px);
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 70% 40% at 100% 0%, rgba(242, 106, 61, 0.06), transparent 55%),
    #0e1622;
}

.hero-header {
  position: relative;
  min-height: 140px;
  display: flex;
  align-items: center;
  padding: 28px clamp(28px, 4vw, 48px) 36px;
  overflow: hidden;
  background: #121a27;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}

.hero-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 120% at 92% -30%, rgba(242, 106, 61, 0.28) 0%, transparent 55%),
    linear-gradient(105deg, #1a2433 0%, #151d2b 55%, #101825 100%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: left;
  max-width: 760px;
}

.eyebrow {
  display: block;
  color: #f26a3d;
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  font-weight: 800;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(1.7rem, 2.4vw, 2.15rem);
  line-height: 1.15;
  font-family: var(--heading);
  font-weight: 700;
  color: #ffffff;
}

.hero-content p {
  margin: 8px 0 0;
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 560px;
}

.main-content {
  flex: 1;
  padding: 28px clamp(28px, 4vw, 48px) 48px;
}

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  background: #0b121c;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 16px clamp(28px, 4vw, 48px) 24px;
  color: #7d8fa8;
  font-size: 0.72rem;
}

@media (max-width: 960px) {
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

  .sidebar-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .hero-header {
    padding: 24px 20px 28px;
    min-height: auto;
  }

  .main-content {
    padding: 20px 16px 32px;
  }
}

@media (max-width: 640px) {
  .sidebar-nav {
    grid-template-columns: 1fr;
  }
}
</style>
