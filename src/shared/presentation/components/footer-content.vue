<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="footer-content">
    <div class="footer-brand">
      <div class="footer-brand-header">
        <div class="footer-logo">
          <i class="pi pi-map-marker"></i>
        </div>

        <h3>VitalTrek</h3>
      </div>

      <p>
        {{ t('footer.description') }}
      </p>

      <span class="follow-title">
        {{ t('footer.follow-us') }}
      </span>

      <div class="social-links">
        <a href="#" aria-label="TikTok">
          <i class="pi pi-music"></i>
        </a>

        <a href="#" aria-label="Instagram">
          <i class="pi pi-instagram"></i>
        </a>

        <a href="#" aria-label="Facebook">
          <i class="pi pi-facebook"></i>
        </a>

        <a href="#" aria-label="YouTube">
          <i class="pi pi-youtube"></i>
        </a>
      </div>

      <ul class="contact-list">
        <li>TikTok: @vitaltrek</li>
        <li>Instagram: @vitaltrek.pe</li>
        <li>Facebook: VitalTrekPeru</li>
        <li>YouTube: VitalTrek</li>
      </ul>
    </div>

    <div class="footer-column">
      <h4>{{ t('footer.platform.title') }}</h4>
      <a href="#">{{ t('footer.platform.routes') }}</a>
      <a href="#">{{ t('footer.platform.monitoring') }}</a>
      <a href="#">{{ t('footer.platform.dashboard') }}</a>
      <a href="#">{{ t('footer.platform.community') }}</a>
      <a href="#">{{ t('footer.platform.agencies') }}</a>
    </div>

    <div class="footer-column">
      <h4>{{ t('footer.account.title') }}</h4>
      <a href="#">{{ t('footer.account.agency-account') }}</a>
      <a href="#">{{ t('footer.account.my-profile') }}</a>
      <a href="#">{{ t('footer.account.settings') }}</a>
    </div>

    <div class="footer-column">
      <h4>{{ t('footer.support.title') }}</h4>
      <a href="#">{{ t('footer.support.help-center') }}</a>
      <a href="#">{{ t('footer.support.contact') }}</a>
      <a href="#">{{ t('footer.support.privacy') }}</a>
      <a href="#">{{ t('footer.support.terms') }}</a>
      <a href="#">{{ t('footer.support.iot-security') }}</a>
    </div>
  </div>
</template>

<style scoped>
.footer-content {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 54px 24px 46px;
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1fr;
  gap: 58px;
  color: #d7dee9;
  text-align: left;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-brand-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.footer-logo {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(34, 197, 94, 0.12);
  color: #84cc16;
  flex: 0 0 auto;
}

h3,
h4 {
  color: #ffffff;
  margin: 0;
  font-family: var(--sans);
}

h3 {
  font-size: 0.95rem;
  font-weight: 800;
}

h4 {
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 14px;
}

p {
  color: #aab6c5;
  font-size: 0.76rem;
  line-height: 1.6;
  max-width: 290px;
  margin: 0;
}

.follow-title {
  display: block;
  color: #aab6c5;
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  font-weight: 800;
  margin-top: 18px;
  margin-bottom: 10px;
}

.social-links {
  display: flex;
  gap: 9px;
  margin-bottom: 18px;
}

.social-links a {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: #ffffff;
  text-decoration: none;
  background: #111827;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.social-links a:hover {
  transform: translateY(-2px);
  filter: brightness(1.12);
}

.social-links a:nth-child(2) {
  background: #e1306c;
}

.social-links a:nth-child(3) {
  background: #1877f2;
}

.social-links a:nth-child(4) {
  background: #ff0000;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: #8c99aa;
  font-size: 0.68rem;
  line-height: 1.75;
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-column a {
  color: #9aa8b9;
  text-decoration: none;
  font-size: 0.75rem;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #ffffff;
}

@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
}

@media (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 38px 20px;
  }
}
</style>