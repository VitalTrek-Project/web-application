<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalUserId, getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";
import { formatLoyaltyDate, tierProgressPercentage, transactionSign } from "../utils/loyalty-presenter.js";

const { t } = useI18n();
const store = useLoyaltyStore();
const { profile, profileLoading, transactions, transactionsLoading, errors } = storeToRefs(store);
const { fetchProfile, fetchTransactions } = store;

const agencyId = getLocalAgencyId();
const touristId = getLocalUserId();

function load() {
  fetchProfile(agencyId, touristId);
  fetchTransactions(agencyId, touristId);
}

onMounted(load);

const progress = computed(() => tierProgressPercentage(profile.value));
</script>

<template>
  <LoyaltyPanel variant="tourist">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.points.title") }}</h2>
      <p class="support-meta">{{ t("loyalty.points.subtitle") }}</p>

      <section class="support-info-card loyalty-balance-card">
        <pv-skeleton v-if="profileLoading" width="100%" height="90px" />
        <template v-else-if="profile">
          <div class="loyalty-balance">
            <strong>{{ profile.totalPoints }}</strong>
            <span>{{ t("loyalty.points.balance") }}</span>
          </div>
          <div class="loyalty-tier-row">
            <span class="support-status-pill support-status-pill--active">
              {{ profile.currentTierName || t("loyalty.points.no-tier") }}
            </span>
            <span v-if="profile.nextTierName" class="loyalty-next-tier">
              {{ t("loyalty.points.points-to-next", { points: profile.pointsToNextTier, tier: profile.nextTierName }) }}
            </span>
          </div>
          <div class="community-stat-bar loyalty-progress-bar">
            <div class="community-stat-fill" :style="{ width: `${progress}%` }" />
          </div>
        </template>
      </section>

      <section class="support-info-card">
        <h3>{{ t("loyalty.points.history") }}</h3>
        <pv-skeleton v-if="transactionsLoading" width="100%" height="120px" />
        <p v-else-if="!transactions.length" class="loyalty-empty-text">{{ t("loyalty.points.no-history") }}</p>
        <ul v-else class="loyalty-history-list">
          <li v-for="transaction in transactions" :key="transaction.id" class="loyalty-history-item">
            <div class="loyalty-history-item__main">
              <strong>{{ transaction.description }}</strong>
              <span>{{ formatLoyaltyDate(transaction.createdAt) }}</span>
            </div>
            <span
                class="loyalty-history-item__points"
                :class="transaction.points >= 0 ? 'loyalty-history-item__points--positive' : 'loyalty-history-item__points--negative'"
            >
              {{ transactionSign(transaction.points) }}{{ transaction.points }}
            </span>
          </li>
        </ul>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </LoyaltyPanel>
</template>

<style scoped>
.loyalty-balance-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loyalty-balance {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.loyalty-balance strong {
  font-size: 2.2rem;
  font-family: var(--heading);
  color: #ffffff;
}

.loyalty-balance span {
  color: #94a3b8;
  font-size: 0.8rem;
}

.loyalty-tier-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.loyalty-next-tier {
  color: #94a3b8;
  font-size: 0.76rem;
}

.loyalty-progress-bar {
  margin-top: 4px;
}

.loyalty-empty-text {
  color: #64748b;
  font-size: 0.82rem;
  text-align: center;
  padding: 16px 0;
}

.loyalty-history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loyalty-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.loyalty-history-item:last-child {
  border-bottom: none;
}

.loyalty-history-item__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.loyalty-history-item__main strong {
  color: #f1f5f9;
  font-size: 0.84rem;
}

.loyalty-history-item__main span {
  color: #94a3b8;
  font-size: 0.7rem;
}

.loyalty-history-item__points {
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.loyalty-history-item__points--positive {
  color: #6ee7a0;
}

.loyalty-history-item__points--negative {
  color: #fca5a5;
}
</style>
