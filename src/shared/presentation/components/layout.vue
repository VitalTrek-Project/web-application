<script setup>
import LanguageSwitcher from "./language-switcher.vue";
import { useI18n } from "vue-i18n";
import FooterContent from "./footer-content.vue";

const { t } = useI18n();

const items = [
  { label: 'option.home', to: '/home' },
  { label: 'option.routes', to: '/routes' },
  { label: 'option.navigation-expedition', to: '/navigation' },
  { label: 'option.safety-monitoring', to: '/safety' },
  { label: 'option.tour-management', to: '/tours' },
  { label: 'option.community', to: '/community' },
  { label: 'option.agencies', to: '/agencies' },
  { label: 'option.plans', to: '/plans' },
  { label: 'option.identity-access', to: '/identity' },
  { label: 'option.notifications-profile', to: '/notifications' },
  { label: 'option.my-profile', to: '/profile' }
];
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">
          <i class="pi pi-map-marker"></i>
        </div>
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
        >
          {{ t(item.label) }}
        </router-link>
      </nav>

      <div class="sidebar-bottom">
        <pv-button
            :label="t('sidebar.sos')"
            icon="pi pi-heart"
            severity="danger"
            class="sos-button"
        />

        <div class="user-avatar">
          MG
        </div>
      </div>
    </aside>

    <section class="page-area">
      <header class="hero-header">
        <div class="hero-content">
          <span class="eyebrow">{{ t('tour-management.context') }}</span>
          <h1>{{ t('tour-management.title') }}</h1>
          <p>{{ t('tour-management.subtitle') }}</p>
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <footer class="footer">
        <footer-content />
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

.brand-icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(34, 197, 94, 0.12);
  color: #84cc16;
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
  background: #f26a3d;
  border-color: #f26a3d;
  font-size: 0.78rem;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f26a3d;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 0 0 4px rgba(242, 106, 61, 0.12);
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
  height: 140px;
  background:
      radial-gradient(circle at 75% 10%, rgba(88, 28, 135, 0.65), transparent 38%),
      linear-gradient(90deg, #5b2a79 0%, #2f124b 55%, #1d1237 100%);
  display: flex;
  align-items: center;
  padding: 0 12%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.hero-content {
  text-align: left;
}

.eyebrow {
  display: block;
  color: #d7c7e8;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero-content h1 {
  color: #ffffff;
  margin: 0;
  font-size: 2rem;
  line-height: 1.1;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
}

.hero-content p {
  margin-top: 8px;
  color: #e5d8ef;
  font-size: 0.8rem;
}

.main-content {
  flex: 1;
  padding: 70px 24px 48px;
}

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.13);
  background: #0d1723;
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
    padding: 36px 24px;
    height: auto;
  }

  .main-content {
    padding: 32px 16px;
  }
}
</style>