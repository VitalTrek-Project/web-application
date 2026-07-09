<script setup>
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { SignUpCommand } from "../../domain/sign-up.command.js";
import { useAppModeStore } from "../../../shared/application/app-mode.store.js";
import VitalTrekLogo from "../../../shared/presentation/components/vital-trek-logo.vue";
import LanguageSwitcher from "../../../shared/presentation/components/language-switcher.vue";
import AuthHeroPanel from "../components/auth-hero-panel.vue";
import { usePlanCatalog } from "../../../subscriptions/presentation/composables/use-plan-catalog.js";

const SIGNUP_DRAFT_KEY = "vitaltrek_signup_draft";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();
const modeStore = useAppModeStore();
const { signUp } = store;
const { trekkerPlans, agencyPlans } = usePlanCatalog();

const step = ref(1);
const submitted = ref(false);
const step2Submitted = ref(false);
const totalSteps = 2;

const form = reactive({
  fullName: "",
  email: "",
  password: "",
  role: "Agency",
  // Trekker profile
  phone: "",
  emergencyPhone: "",
  experienceLevel: "",
  // Agency profile
  ruc: "",
  region: "",
  commercialPhone: "",
  agencyDescription: "",
  // Shared
  plan: "recommended"
});

const roles = computed(() => [
  {
    value: "Tourist",
    title: t("iam.sign-up.role-trekker"),
    description: t("iam.sign-up.role-trekker-desc"),
    icon: "pi pi-compass"
  },
  {
    value: "Agency",
    title: t("iam.sign-up.role-agency"),
    description: t("iam.sign-up.role-agency-desc"),
    icon: "pi pi-building"
  }
]);

const experienceLevels = computed(() => [
  { value: "Beginner", label: t("iam.sign-up.experience.beginner") },
  { value: "Intermediate", label: t("iam.sign-up.experience.intermediate") },
  { value: "Advanced", label: t("iam.sign-up.experience.advanced") }
]);

const regions = computed(() => [
  "Lima",
  "Cusco",
  "Arequipa",
  "Puno",
  "Ancash",
  "Cajamarca",
  "Other"
].map((value) => ({
  value,
  label: t(`iam.sign-up.regions.${value}`)
})));

const activePlans = computed(() =>
  form.role === "Agency" ? agencyPlans.value : trekkerPlans.value
);

const stepTitle = computed(() =>
  step.value === 1 ? t("iam.sign-up.title") : t("iam.sign-up.profile-title")
);

const canContinueStep1 = computed(() =>
  form.fullName.trim().length > 1 &&
  form.email.trim().includes("@") &&
  form.password.length >= 8 &&
  Boolean(form.role)
);

const canContinueStep2 = computed(() => {
  if (!form.plan) return false;
  if (form.role === "Agency") {
    return form.ruc.trim().length >= 8 &&
      Boolean(form.region) &&
      form.commercialPhone.trim().length >= 6;
  }
  return form.phone.trim().length >= 6 &&
    form.emergencyPhone.trim().length >= 6 &&
    Boolean(form.experienceLevel);
});

function selectRole(role) {
  form.role = role;
  form.plan = "recommended";
  modeStore.setMode(role === "Agency" ? "empresa" : "trekker");
}

function selectPlan(planId) {
  form.plan = planId;
}

function goToStep2() {
  submitted.value = true;
  if (!canContinueStep1.value) return;
  step.value = 2;
  step2Submitted.value = false;
}

function goToStep1() {
  step.value = 1;
}

function persistSignupDraft() {
  const draft = {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    role: form.role,
    plan: form.plan,
    phone: form.phone.trim(),
    emergencyPhone: form.emergencyPhone.trim(),
    experienceLevel: form.experienceLevel,
    ruc: form.ruc.trim(),
    region: form.region,
    commercialPhone: form.commercialPhone.trim(),
    agencyDescription: form.agencyDescription.trim()
  };
  localStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify(draft));
}

function performSignUp() {
  step2Submitted.value = true;
  if (!canContinueStep1.value || !canContinueStep2.value) return;
  persistSignupDraft();
  const signUpCommand = new SignUpCommand({
    username: form.email.trim(),
    password: form.password,
    role: form.role
  });
  signUp(signUpCommand, router);
}

function continueAsGuest() {
  modeStore.setMode(form.role === "Agency" ? "empresa" : "trekker");
  router.push({ name: "home" });
}
</script>

<template>
  <div class="auth-screen">
    <AuthHeroPanel />

    <div class="auth-panel">
      <div class="auth-language">
        <LanguageSwitcher />
      </div>

    <div class="auth-card" :class="{ 'auth-card--wide': step === 2 }">
      <div class="auth-brand">
        <VitalTrekLogo variant="auth" />
        <span>Vital<span class="auth-brand-accent">Trek</span></span>
      </div>

      <p class="auth-eyebrow">{{ t("iam.sign-up.eyebrow") }}</p>
      <h1 class="auth-title">{{ stepTitle }}</h1>
      <p class="auth-step">
        {{ t("iam.sign-up.step", { current: step, total: totalSteps }) }}
      </p>
      <div class="auth-progress" aria-hidden="true">
        <span
            v-for="n in totalSteps"
            :key="n"
            class="auth-progress-bar"
            :class="{ 'auth-progress-bar--active': n <= step }"
        />
      </div>

      <pv-message
          v-if="store.errors.length"
          severity="error"
          :closable="false"
          class="auth-error"
      >
        {{ store.errors[store.errors.length - 1] }}
      </pv-message>

      <!-- STEP 1: account basics -->
      <form v-if="step === 1" class="auth-form" @submit.prevent="goToStep2">
        <div class="role-grid" role="radiogroup" :aria-label="t('iam.sign-up.role-label')">
          <button
              v-for="role in roles"
              :key="role.value"
              type="button"
              class="role-card"
              :class="{ 'role-card--active': form.role === role.value }"
              :aria-pressed="form.role === role.value"
              @click="selectRole(role.value)"
          >
            <span class="role-card__icon" aria-hidden="true">
              <i :class="role.icon" />
            </span>
            <span class="role-card__title">{{ role.title }}</span>
            <span class="role-card__desc">{{ role.description }}</span>
          </button>
        </div>

        <label class="auth-field">
          <span>{{ t("iam.sign-up.full-name") }}</span>
          <input
              v-model="form.fullName"
              type="text"
              :placeholder="t('iam.sign-up.full-name-placeholder')"
              autocomplete="name"
              :class="{ 'is-invalid': submitted && form.fullName.trim().length < 2 }"
          />
        </label>

        <label class="auth-field">
          <span>{{ t("iam.sign-up.email") }}</span>
          <input
              v-model="form.email"
              type="email"
              :placeholder="t('iam.sign-up.email-placeholder')"
              autocomplete="email"
              :class="{ 'is-invalid': submitted && !form.email.trim().includes('@') }"
          />
        </label>

        <label class="auth-field">
          <span>{{ t("iam.sign-up.password") }}</span>
          <input
              v-model="form.password"
              type="password"
              :placeholder="t('iam.sign-up.password-placeholder')"
              autocomplete="new-password"
              :class="{ 'is-invalid': submitted && form.password.length < 8 }"
          />
        </label>

        <button type="submit" class="auth-primary">
          {{ t("iam.sign-up.continue") }}
          <span aria-hidden="true">→</span>
        </button>

        <button type="button" class="auth-guest" @click="continueAsGuest">
          {{ t("iam.sign-up.guest") }}
        </button>
      </form>

      <!-- STEP 2: complete profile + plan -->
      <form v-else class="auth-form" @submit.prevent="performSignUp">
        <template v-if="form.role === 'Tourist'">
          <label class="auth-field">
            <span>{{ t("iam.sign-up.phone") }}</span>
            <input
                v-model="form.phone"
                type="tel"
                :placeholder="t('iam.sign-up.phone-placeholder')"
                :class="{ 'is-invalid': step2Submitted && form.phone.trim().length < 6 }"
            />
          </label>

          <label class="auth-field">
            <span>{{ t("iam.sign-up.emergency-phone") }}</span>
            <input
                v-model="form.emergencyPhone"
                type="tel"
                :placeholder="t('iam.sign-up.phone-placeholder')"
                :class="{ 'is-invalid': step2Submitted && form.emergencyPhone.trim().length < 6 }"
            />
          </label>

          <label class="auth-field">
            <span>{{ t("iam.sign-up.experience-level") }}</span>
            <select
                v-model="form.experienceLevel"
                :class="{ 'is-invalid': step2Submitted && !form.experienceLevel }"
            >
              <option disabled value="">{{ t("iam.sign-up.select-placeholder") }}</option>
              <option
                  v-for="level in experienceLevels"
                  :key="level.value"
                  :value="level.value"
              >
                {{ level.label }}
              </option>
            </select>
          </label>

          <p class="auth-note">
            <i class="pi pi-heart-fill" aria-hidden="true" />
            {{ t("iam.sign-up.emergency-note") }}
          </p>
        </template>

        <template v-else>
          <label class="auth-field">
            <span>{{ t("iam.sign-up.ruc") }}</span>
            <input
                v-model="form.ruc"
                type="text"
                :placeholder="t('iam.sign-up.ruc-placeholder')"
                :class="{ 'is-invalid': step2Submitted && form.ruc.trim().length < 8 }"
            />
          </label>

          <label class="auth-field">
            <span>{{ t("iam.sign-up.region") }}</span>
            <select
                v-model="form.region"
                :class="{ 'is-invalid': step2Submitted && !form.region }"
            >
              <option disabled value="">{{ t("iam.sign-up.select-placeholder") }}</option>
              <option
                  v-for="region in regions"
                  :key="region.value"
                  :value="region.value"
              >
                {{ region.label }}
              </option>
            </select>
          </label>

          <label class="auth-field">
            <span>{{ t("iam.sign-up.commercial-phone") }}</span>
            <input
                v-model="form.commercialPhone"
                type="tel"
                :placeholder="t('iam.sign-up.commercial-phone-placeholder')"
                :class="{ 'is-invalid': step2Submitted && form.commercialPhone.trim().length < 6 }"
            />
          </label>

          <label class="auth-field">
            <span>{{ t("iam.sign-up.agency-description") }}</span>
            <textarea
                v-model="form.agencyDescription"
                rows="3"
                :placeholder="t('iam.sign-up.agency-description-placeholder')"
            />
          </label>
        </template>

        <div class="plan-block">
          <h2 class="plan-title">{{ t("iam.sign-up.choose-plan") }}</h2>
          <div class="plan-grid" role="radiogroup" :aria-label="t('iam.sign-up.choose-plan')">
            <button
                v-for="plan in activePlans"
                :key="plan.id"
                type="button"
                class="plan-card"
                :class="{
                  'plan-card--active': form.plan === plan.id,
                  'plan-card--recommended': plan.recommended
                }"
                :aria-pressed="form.plan === plan.id"
                @click="selectPlan(plan.id)"
            >
              <span v-if="plan.recommended" class="plan-recommended-tag">
                {{ t("iam.sign-up.recommended") }}
              </span>
              <span class="plan-name">{{ plan.name }}</span>
              <span class="plan-badge">{{ plan.badge }}</span>
              <span class="plan-desc">{{ plan.description }}</span>
              <span class="plan-price">{{ plan.price }}</span>
            </button>
          </div>
        </div>

        <div class="auth-actions">
          <button type="button" class="auth-secondary" @click="goToStep1">
            ← {{ t("iam.sign-up.back") }}
          </button>
          <button type="submit" class="auth-primary auth-primary--inline">
            {{ t("iam.sign-up.create-account") }}
          </button>
        </div>
      </form>

      <p class="auth-footer">
        {{ t("iam.sign-up.have-account") }}
        <router-link :to="{ name: 'iam-sign-in' }">
          {{ t("iam.sign-up.sign-in-link") }}
        </router-link>
      </p>
    </div>
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  color: #f8fafc;
}

.auth-panel {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 2rem 1rem 3rem;
  background:
    radial-gradient(ellipse at top, rgba(242, 106, 61, 0.08), transparent 45%),
    #0b1220;
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

.auth-card--wide {
  width: min(560px, 100%);
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.01em;
}

.auth-brand-accent {
  color: #f26a3d;
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
  font-size: clamp(1.7rem, 4vw, 2.1rem);
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
}

.auth-step {
  margin: 0.55rem 0 0.75rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.auth-progress {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 1.35rem;
}

.auth-progress-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}

.auth-progress-bar--active {
  background: #f26a3d;
}

.auth-error {
  width: 100%;
  margin-bottom: 1rem;
}

.auth-form {
  display: grid;
  gap: 0.95rem;
}

.role-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.role-card {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "icon title"
    "icon desc";
  column-gap: 0.75rem;
  row-gap: 0.2rem;
  align-items: start;
  text-align: left;
  padding: 0.95rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.55);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.role-card:hover {
  border-color: rgba(242, 106, 61, 0.55);
}

.role-card--active {
  border-color: #f26a3d;
  box-shadow: 0 0 0 1px rgba(242, 106, 61, 0.35);
  background: rgba(242, 106, 61, 0.08);
}

.role-card__icon {
  grid-area: icon;
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.12);
  color: #f8fafc;
  font-size: 0.95rem;
  margin-top: 0.1rem;
}

.role-card--active .role-card__icon {
  background: rgba(242, 106, 61, 0.18);
  color: #f26a3d;
}

.role-card__title {
  grid-area: title;
  font-size: 0.92rem;
  font-weight: 700;
}

.role-card__desc {
  grid-area: desc;
  color: #94a3b8;
  font-size: 0.75rem;
  line-height: 1.35;
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

.auth-field input,
.auth-field select,
.auth-field textarea {
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

.auth-field textarea {
  min-height: 92px;
  resize: vertical;
}

.auth-field input::placeholder,
.auth-field textarea::placeholder {
  color: #64748b;
}

.auth-field input:focus,
.auth-field select:focus,
.auth-field textarea:focus {
  outline: none;
  border-color: #f26a3d;
  box-shadow: 0 0 0 3px rgba(242, 106, 61, 0.18);
}

.auth-field .is-invalid {
  border-color: #ef4444;
}

.auth-note {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0;
  color: #94a3b8;
  font-size: 0.78rem;
  line-height: 1.4;
}

.auth-note i {
  color: #f26a3d;
  margin-top: 0.1rem;
}

.plan-block {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.plan-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
}

.plan-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
}

.plan-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.3rem;
  text-align: left;
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(15, 23, 42, 0.55);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.plan-card:hover {
  border-color: rgba(242, 106, 61, 0.45);
}

.plan-card--active,
.plan-card--recommended.plan-card--active {
  border-color: #f26a3d;
  box-shadow: 0 0 0 1px rgba(242, 106, 61, 0.35);
  background: rgba(242, 106, 61, 0.08);
}

.plan-recommended-tag {
  position: absolute;
  top: 0.7rem;
  right: 0.75rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f26a3d;
}

.plan-name {
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f8fafc;
}

.plan-badge {
  color: #94a3b8;
  font-size: 0.75rem;
}

.plan-desc {
  color: #cbd5e1;
  font-size: 0.78rem;
  line-height: 1.35;
}

.plan-price {
  margin-top: 0.25rem;
  color: #f26a3d;
  font-size: 0.86rem;
  font-weight: 700;
}

.auth-actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 0.75rem;
  margin-top: 0.35rem;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  box-shadow: 0 10px 24px rgba(242, 106, 61, 0.35);
}

.auth-primary--inline {
  margin-top: 0;
  width: 100%;
}

.auth-secondary {
  min-height: 48px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.auth-secondary:hover {
  border-color: rgba(242, 106, 61, 0.5);
}

.auth-guest {
  border: 0;
  background: transparent;
  color: #94a3b8;
  font: inherit;
  font-size: 0.88rem;
  cursor: pointer;
  padding: 0.35rem;
}

.auth-guest:hover {
  color: #e2e8f0;
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

@media (max-width: 560px) {
  .auth-actions {
    grid-template-columns: 1fr;
  }

  .auth-card,
  .auth-card--wide {
    padding: 1.5rem 1.15rem 1.35rem;
  }
}
</style>
