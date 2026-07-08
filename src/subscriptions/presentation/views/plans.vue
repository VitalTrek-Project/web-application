<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useSubscriptionsStore from "../../application/subscriptions.store.js";

const { t } = useI18n();
const store = useSubscriptionsStore();
const { subscription, loading, errors, checkoutUrl } = storeToRefs(store);
const { fetchMySubscription, startCheckout, cancelSubscription } = store;

const selectedPlan = ref("Pro");
const plans = ["Starter", "Pro", "Enterprise"];

const statusLabel = computed(() => subscription.value?.status ?? t("subscriptions.none"));

async function handleCheckout() {
  const url = await startCheckout(selectedPlan.value);
  if (url) {
    window.location.assign(url);
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
    <header class="subscriptions-header">
      <h1>{{ t("subscriptions.title") }}</h1>
      <p>{{ t("subscriptions.subtitle") }}</p>
    </header>

    <div v-if="errors.length" class="subscriptions-error">
      <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
    </div>

    <article class="subscriptions-card">
      <h2>{{ t("subscriptions.current") }}</h2>
      <p v-if="loading">{{ t("subscriptions.loading") }}</p>
      <template v-else>
        <p><strong>{{ t("subscriptions.plan") }}:</strong> {{ subscription?.plan ?? "—" }}</p>
        <p><strong>{{ t("subscriptions.status") }}:</strong> {{ statusLabel }}</p>
        <p v-if="subscription?.startDate">
          <strong>{{ t("subscriptions.start") }}:</strong> {{ subscription.startDate }}
        </p>
        <p v-if="subscription?.endDate">
          <strong>{{ t("subscriptions.end") }}:</strong> {{ subscription.endDate }}
        </p>
      </template>
    </article>

    <article class="subscriptions-card">
      <h2>{{ t("subscriptions.checkout") }}</h2>
      <label class="subscriptions-label" for="plan-select">{{ t("subscriptions.choose-plan") }}</label>
      <select id="plan-select" v-model="selectedPlan" class="subscriptions-select">
        <option v-for="plan in plans" :key="plan" :value="plan">{{ plan }}</option>
      </select>
      <div class="subscriptions-actions">
        <button type="button" class="subscriptions-primary" :disabled="loading" @click="handleCheckout">
          {{ t("subscriptions.start-checkout") }}
        </button>
        <button
          type="button"
          class="subscriptions-secondary"
          :disabled="loading || !subscription"
          @click="handleCancel"
        >
          {{ t("subscriptions.cancel") }}
        </button>
      </div>
      <p v-if="checkoutUrl" class="subscriptions-meta">{{ checkoutUrl }}</p>
    </article>
  </section>
</template>

<style scoped>
.subscriptions-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: 1.25rem;
}

.subscriptions-header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
}

.subscriptions-header p,
.subscriptions-meta {
  margin: 0;
  color: #5b6472;
}

.subscriptions-card {
  border: 1px solid #d7dde5;
  border-radius: 12px;
  padding: 1.25rem;
  background: #fff;
  display: grid;
  gap: 0.65rem;
}

.subscriptions-card h2 {
  margin: 0;
  font-size: 1.1rem;
}

.subscriptions-label {
  font-size: 0.9rem;
}

.subscriptions-select {
  max-width: 240px;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid #c8d0da;
}

.subscriptions-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.subscriptions-primary,
.subscriptions-secondary {
  border: 0;
  border-radius: 999px;
  padding: 0.6rem 1.1rem;
  cursor: pointer;
}

.subscriptions-primary {
  background: #0f766e;
  color: #fff;
}

.subscriptions-secondary {
  background: #eef2f6;
  color: #243042;
}

.subscriptions-error {
  color: #b42318;
  background: #fef3f2;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}
</style>
