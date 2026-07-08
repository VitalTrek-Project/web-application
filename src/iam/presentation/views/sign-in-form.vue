<script setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { SignInCommand } from "../../domain/sign-in.command.js";
import VitalTrekLogo from "../../../shared/presentation/components/vital-trek-logo.vue";
import LanguageSwitcher from "../../../shared/presentation/components/language-switcher.vue";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useIamStore();
const { signIn } = store;

const form = reactive({
  username: "",
  password: ""
});

const canSubmit = computed(() =>
  form.username.trim().includes("@") && form.password.length >= 1
);

function performSignIn() {
  if (!canSubmit.value) return;
  const signInCommand = new SignInCommand({
    username: form.username.trim(),
    password: form.password
  });
  signIn(signInCommand, router, route.query.redirect ?? null);
}
</script>

<template>
  <div class="auth-screen">
    <div class="auth-language">
      <LanguageSwitcher />
    </div>

    <div class="auth-card">
      <div class="auth-brand">
        <VitalTrekLogo variant="auth" />
        <span>VitalTrek</span>
      </div>

      <p class="auth-eyebrow">{{ t("iam.sign-in.eyebrow") }}</p>
      <h1 class="auth-title">{{ t("iam.sign-in.title") }}</h1>
      <div class="auth-title-rule" aria-hidden="true" />
      <p class="auth-step">{{ t("iam.sign-in.subtitle") }}</p>

      <pv-message
          v-if="store.errors.length"
          severity="error"
          :closable="false"
          class="auth-error"
      >
        {{ store.errors[store.errors.length - 1] }}
      </pv-message>

      <form class="auth-form" @submit.prevent="performSignIn">
        <label class="auth-field">
          <span>{{ t("iam.sign-in.email") }}</span>
          <input
              v-model="form.username"
              type="email"
              :placeholder="t('iam.sign-in.email-placeholder')"
              autocomplete="username"
          />
        </label>

        <label class="auth-field">
          <span>{{ t("iam.sign-in.password") }}</span>
          <input
              v-model="form.password"
              type="password"
              :placeholder="t('iam.sign-in.password-placeholder')"
              autocomplete="current-password"
          />
        </label>

        <button type="submit" class="auth-primary" :disabled="!canSubmit">
          {{ t("iam.sign-in.submit") }}
        </button>
      </form>

      <p class="auth-footer">
        {{ t("iam.sign-in.no-account") }}
        <router-link :to="{ name: 'iam-sign-up' }">
          {{ t("iam.sign-in.sign-up-link") }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem 3rem;
  background:
    radial-gradient(ellipse at top, rgba(242, 106, 61, 0.08), transparent 45%),
    #0b1220;
  color: #f8fafc;
}

.auth-language {
  position: fixed;
  top: 1.1rem;
  right: 1.25rem;
  z-index: 5;
}

.auth-language :deep(.language-pills) {
  margin: 0;
}

.auth-card {
  width: min(460px, 100%);
  background: #151d2b;
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 2rem 1.75rem 1.75rem;
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.45);
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.05rem;
}

.auth-eyebrow {
  margin: 0 0 0.35rem;
  color: #f26a3d;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.auth-title {
  margin: 0;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: clamp(1.85rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
}

.auth-title-rule {
  width: 42px;
  height: 3px;
  margin: 0.75rem 0 0.85rem;
  border-radius: 999px;
  background: #f26a3d;
}

.auth-step {
  margin: 0 0 1.35rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.auth-error {
  width: 100%;
  margin-bottom: 1rem;
}

.auth-form {
  display: grid;
  gap: 0.95rem;
}

.auth-field {
  display: grid;
  gap: 0.4rem;
}

.auth-field span {
  color: #cbd5e1;
  font-size: 0.82rem;
  font-weight: 600;
}

.auth-field input {
  width: 100%;
  box-sizing: border-box;
  min-height: 46px;
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #0f1724;
  color: #f8fafc;
  font: inherit;
}

.auth-field input::placeholder {
  color: #64748b;
}

.auth-field input:focus {
  outline: none;
  border-color: #f26a3d;
  box-shadow: 0 0 0 3px rgba(242, 106, 61, 0.18);
}

.auth-primary {
  margin-top: 0.35rem;
  min-height: 48px;
  border: 0;
  border-radius: 10px;
  background: #f26a3d;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
}

.auth-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.auth-footer {
  margin: 1.35rem 0 0;
  text-align: center;
  color: #94a3b8;
  font-size: 0.88rem;
}

.auth-footer a {
  color: #f26a3d;
  font-weight: 700;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
