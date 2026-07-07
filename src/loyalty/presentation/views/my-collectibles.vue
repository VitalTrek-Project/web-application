<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalUserId, getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";
import { formatLoyaltyDate, getRedemptionStatusKey } from "../utils/loyalty-presenter.js";

const { t } = useI18n();
const store = useLoyaltyStore();
const { badges, badgesLoading, myRedemptions, myRedemptionsLoading, rewards, errors } = storeToRefs(store);
const { fetchBadges, fetchMyRedemptions, fetchRewards } = store;

const agencyId = getLocalAgencyId();
const touristId = getLocalUserId();

onMounted(() => {
  fetchBadges(agencyId, touristId);
  fetchMyRedemptions(agencyId, touristId);
  if (!rewards.value.length) fetchRewards(agencyId, false);
});

function rewardName(rewardId) {
  return rewards.value.find((r) => r.id === rewardId)?.name ?? t("loyalty.collectibles.unknown-reward");
}

const sortedBadges = computed(() =>
  [...badges.value].sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt))
);
</script>

<template>
  <LoyaltyPanel variant="tourist">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.collectibles.title") }}</h2>
      <p class="support-meta">{{ t("loyalty.collectibles.subtitle") }}</p>

      <section class="support-info-card">
        <h3>{{ t("loyalty.collectibles.badges") }}</h3>
        <pv-skeleton v-if="badgesLoading" width="100%" height="80px" />
        <p v-else-if="!sortedBadges.length" class="loyalty-empty-text">{{ t("loyalty.collectibles.no-badges") }}</p>
        <ul v-else class="loyalty-badge-list">
          <li v-for="badge in sortedBadges" :key="badge.id" class="loyalty-badge-item">
            <i class="pi pi-star-fill loyalty-badge-icon" aria-hidden="true" />
            <div>
              <strong>{{ badge.name }}</strong>
              <p>{{ badge.description }}</p>
              <span>{{ formatLoyaltyDate(badge.awardedAt) }}</span>
            </div>
          </li>
        </ul>
      </section>

      <section class="support-info-card">
        <h3>{{ t("loyalty.collectibles.redemptions") }}</h3>
        <pv-skeleton v-if="myRedemptionsLoading" width="100%" height="80px" />
        <p v-else-if="!myRedemptions.length" class="loyalty-empty-text">{{ t("loyalty.collectibles.no-redemptions") }}</p>
        <ul v-else class="loyalty-redemption-list">
          <li v-for="redemption in myRedemptions" :key="redemption.id" class="loyalty-redemption-item">
            <div>
              <strong>{{ rewardName(redemption.rewardId) }}</strong>
              <span class="loyalty-redemption-code">{{ redemption.code }}</span>
            </div>
            <span
                class="support-status-pill"
                :class="`support-status-pill--${getRedemptionStatusKey(redemption.status)}`"
            >
              {{ redemption.status }}
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
.loyalty-empty-text {
  color: #64748b;
  font-size: 0.82rem;
  text-align: center;
  padding: 16px 0;
}

.loyalty-badge-list,
.loyalty-redemption-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loyalty-badge-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.loyalty-badge-icon {
  color: #ffb07a;
  font-size: 1.3rem;
  margin-top: 2px;
}

.loyalty-badge-item strong {
  color: #f1f5f9;
  font-size: 0.86rem;
}

.loyalty-badge-item p {
  margin: 2px 0;
  color: #cbd5e1;
  font-size: 0.78rem;
}

.loyalty-badge-item span {
  color: #94a3b8;
  font-size: 0.7rem;
}

.loyalty-redemption-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.loyalty-redemption-item:last-child {
  border-bottom: none;
}

.loyalty-redemption-item strong {
  display: block;
  color: #f1f5f9;
  font-size: 0.84rem;
}

.loyalty-redemption-code {
  color: #94a3b8;
  font-size: 0.72rem;
  font-family: monospace;
  letter-spacing: 0.05em;
}
</style>
