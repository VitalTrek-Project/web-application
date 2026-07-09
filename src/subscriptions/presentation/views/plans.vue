<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import useSubscriptionsStore from "../../application/subscriptions.store.js";
import { usePlanCatalog } from "../composables/use-plan-catalog.js";
import { useAppModeStore } from "../../../shared/application/app-mode.store.js";

const { t } = useI18n();
const route = useRoute();
const store = useSubscriptionsStore();
const modeStore = useAppModeStore();
const { subscription, loading, errors, checkoutUrl } = storeToRefs(store);
const { fetchMySubscription, startCheckout, cancelSubscription } = store;
const { trekkerPlans, agencyPlans } = usePlanCatalog();

const checkingOutPlanId = ref(null);

const plans = computed(() => (modeStore.mode === "empresa" ? agencyPlans.value : trekkerPlans.value));

const activeStatuses = ["active", "trialing"];
const isSubscriptionActive = computed(() => activeStatuses.includes(subscription.value?.status));

function isCurrentPlan(plan) {
  if (plan.tier === "free") return !isSubscriptionActive.value;
  return isSubscriptionActive.value && subscription.value?.plan === plan.stripePlan;
}

async function handleCheckout(plan) {
  checkingOutPlanId.value = plan.id;
  try {
    const url = await startCheckout(plan.stripePlan);
    if (url) window.location.assign(url);
  } finally {
    checkingOutPlanId.value = null;
  }
}

async function handleCancel() {
  await cancelSubscription();
  await fetchMySubscription();
}

onMounted(() => {
  fetchMySubscription().catch(() => {});
});
</script>

<template>
  <section class="subscriptions-page">
    <div v-if="route.query.checkout === 'success'" class="subscriptions-banner subscriptions-banner--success">
      {{ t("subscriptions.checkout-success") }}
    </div>
    <div v-else-if="route.query.checkout === 'cancel'" class="subscriptions-banner subscriptions-banner--cancel">
      {{ t("subscriptions.checkout-cancelled") }}
    </div>

    <div v-if="errors.length" class="subscriptions-banner subscriptions-banner--error">
      <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
    </div>

    <article class="current-plan-card">
      <h2>{{ t("subscriptions.current") }}</h2>
      <p v-if="loading" class="current-plan-loading">{{ t("subscriptions.loading") }}</p>
      <template v-else>
        <div class="current-plan-row">
          <span class="current-plan-label">{{ t("subscriptions.plan") }}</span>
          <span class="current-plan-value">{{ subscription?.plan ?? t("subscriptions.none") }}</span>
        </div>
        <div class="current-plan-row">
          <span class="current-plan-label">{{ t("subscriptions.status") }}</span>
          <span class="current-plan-value">{{ subscription?.status ?? "—" }}</span>
        </div>
        <div v-if="subscription?.startDate" class="current-plan-row">
          <span class="current-plan-label">{{ t("subscriptions.start") }}</span>
          <span class="current-plan-value">{{ subscription.startDate }}</span>
        </div>
        <div v-if="subscription?.endDate" class="current-plan-row">
          <span class="current-plan-label">{{ t("subscriptions.end") }}</span>
          <span class="current-plan-value">{{ subscription.endDate }}</span>
        </div>
      </template>
    </article>

    <h2 class="plans-title">{{ t("subscriptions.choose-plan-title") }}</h2>

    <div class="plans-grid">
      <article
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          :class="{ 'plan-card--recommended': plan.recommended, 'plan-card--current': isCurrentPlan(plan) }"
      >
        <span v-if="plan.recommended" class="plan-card-tag">{{ t("subscriptions.most-popular") }}</span>
        <span v-else-if="isCurrentPlan(plan)" class="plan-card-tag plan-card-tag--current">
          {{ t("subscriptions.current-plan-badge") }}
        </span>

        <h3 class="plan-card-name">{{ plan.name }}</h3>
        <p class="plan-card-badge">{{ plan.badge }}</p>
        <p class="plan-card-price">{{ plan.price }}</p>
        <p class="plan-card-description">{{ plan.description }}</p>

        <ul class="plan-card-features">
          <li v-for="feature in plan.features" :key="feature">
            <i class="pi pi-check" aria-hidden="true" />
            {{ feature }}
          </li>
        </ul>

        <button
            v-if="plan.tier === 'free'"
            type="button"
            class="plan-card-cta plan-card-cta--static"
            disabled
        >
          {{ t("subscriptions.included") }}
        </button>
        <button
            v-else-if="isCurrentPlan(plan)"
            type="button"
            class="plan-card-cta plan-card-cta--ghost"
            :disabled="loading"
            @click="handleCancel"
        >
          {{ t("subscriptions.cancel") }}
        </button>
        <button
            v-else
            type="button"
            class="plan-card-cta plan-card-cta--solid"
            :disabled="loading"
            @click="handleCheckout(plan)"
        >
          {{ checkingOutPlanId === plan.id ? t("subscriptions.processing") : t("subscriptions.subscribe") }}
        </button>
      </article>
    </div>

    <p v-if="checkoutUrl" class="subscriptions-meta">{{ checkoutUrl }}</p>
  </section>
</template>

<style scoped>
.subscriptions-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: 1.5rem;
  color: #f8fafc;
}

.subscriptions-banner {
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  font-size: 0.88rem;
  line-height: 1.4;
}

.subscriptions-banner p {
  margin: 0;
}

.subscriptions-banner--success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #86efac;
}

.subscriptions-banner--cancel {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #cbd5e1;
}

.subscriptions-banner--error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}

.current-plan-card {
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  background: #151d2b;
  display: grid;
  gap: 0.75rem;
}

.current-plan-card h2 {
  margin: 0 0 0.25rem;
  font-size: 1.05rem;
  color: #f8fafc;
}

.current-plan-loading {
  margin: 0;
  color: #94a3b8;
  font-size: 0.88rem;
}

.current-plan-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  font-size: 0.88rem;
}

.current-plan-row:last-child {
  border-bottom: none;
}

.current-plan-label {
  color: #94a3b8;
}

.current-plan-value {
  color: #f8fafc;
  font-weight: 600;
}

.plans-title {
  margin: 0.5rem 0 -0.5rem;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  background: #151d2b;
}

.plan-card--recommended {
  border-color: rgba(242, 106, 61, 0.55);
  box-shadow: 0 0 0 1px rgba(242, 106, 61, 0.25), 0 24px 48px rgba(242, 106, 61, 0.12);
}

.plan-card--current:not(.plan-card--recommended) {
  border-color: rgba(94, 234, 212, 0.4);
}

.plan-card-tag {
  position: absolute;
  top: -12px;
  left: 1.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #f26a3d;
  color: #ffffff;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.plan-card-tag--current {
  background: #2dd4bf;
  color: #0b1220;
}

.plan-card-name {
  margin: 0.5rem 0 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
}

.plan-card-badge {
  margin: 0;
  color: #f26a3d;
  font-size: 0.78rem;
  font-weight: 700;
}

.plan-card-price {
  margin: 0.35rem 0;
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 700;
}

.plan-card-description {
  margin: 0 0 0.5rem;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.45;
}

.plan-card-features {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  display: grid;
  gap: 0.5rem;
  flex: 1;
}

.plan-card-features li {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: #dbe4ef;
  font-size: 0.84rem;
  line-height: 1.4;
}

.plan-card-features i {
  color: #f26a3d;
  margin-top: 0.18rem;
  font-size: 0.78rem;
}

.plan-card-cta {
  width: 100%;
  min-height: 46px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: filter 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.plan-card-cta--solid {
  border: 0;
  background: linear-gradient(135deg, #f26a3d 0%, #e0522a 100%);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(242, 106, 61, 0.35);
}

.plan-card-cta--solid:hover {
  filter: brightness(1.06);
}

.plan-card-cta--ghost {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: transparent;
  color: #f8fafc;
}

.plan-card-cta--ghost:hover {
  border-color: #ef4444;
  color: #fca5a5;
}

.plan-card-cta--static {
  border: 1px dashed rgba(148, 163, 184, 0.3);
  background: transparent;
  color: #94a3b8;
  cursor: default;
}

.plan-card-cta:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.subscriptions-meta {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  word-break: break-all;
}
</style>
