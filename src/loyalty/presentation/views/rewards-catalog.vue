<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import useLoyaltyStore from "../../application/loyalty.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import { getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";

const { t } = useI18n();
const toast = useToast();
const store = useLoyaltyStore();
const { rewards, rewardsLoading, profile, errors } = storeToRefs(store);
const { fetchRewards, fetchProfile, redeemReward } = store;

// There is no multi-agency directory yet, so the agency whose loyalty
// program a tourist browses is still a per-browser placeholder; the
// tourist's own identity, however, now comes from the real IAM session.
const agencyId = getLocalAgencyId();
const touristId = useIamStore().currentUserId;

onMounted(() => {
  fetchRewards(agencyId, true);
  if (!profile.value) fetchProfile(agencyId, touristId);
});

function canAfford(reward) {
  return (profile.value?.totalPoints ?? 0) >= reward.pointsCost;
}

function redeem(reward) {
  redeemReward(agencyId, touristId, reward.id)
    .then((redemption) => {
      toast.add({
        severity: "success",
        summary: t("loyalty.rewards.redeemed-summary"),
        detail: t("loyalty.rewards.redeemed-detail", { code: redemption.code }),
        life: 8000
      });
      fetchProfile(agencyId, touristId);
    })
    .catch(() => {
      toast.add({ severity: "error", summary: t("loyalty.rewards.redeem-error"), life: 5000 });
    });
}
</script>

<template>
  <LoyaltyPanel variant="tourist">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.rewards.title") }}</h2>
      <p class="support-meta">
        {{ t("loyalty.rewards.subtitle", { points: profile?.totalPoints ?? 0 }) }}
      </p>

      <div v-if="rewardsLoading" class="loyalty-rewards-grid">
        <pv-skeleton v-for="n in 3" :key="n" height="150px" />
      </div>
      <p v-else-if="!rewards.length" class="loyalty-empty-text">{{ t("loyalty.rewards.empty") }}</p>
      <div v-else class="loyalty-rewards-grid">
        <article v-for="reward in rewards" :key="reward.id" class="support-info-card loyalty-reward-card">
          <h3>{{ reward.name }}</h3>
          <p class="loyalty-reward-description">{{ reward.description }}</p>
          <div class="loyalty-reward-footer">
            <span class="loyalty-reward-cost">{{ t("loyalty.rewards.cost", { points: reward.pointsCost }) }}</span>
            <pv-button
                :label="t('loyalty.rewards.redeem')"
                class="support-primary-button"
                :disabled="!canAfford(reward)"
                @click="redeem(reward)"
            />
          </div>
          <p v-if="!canAfford(reward)" class="loyalty-reward-insufficient">{{ t("loyalty.rewards.insufficient") }}</p>
        </article>
      </div>

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

.loyalty-rewards-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.loyalty-reward-card {
  margin-bottom: 0;
}

.loyalty-reward-card h3 {
  margin: 0 0 6px;
  color: #ffffff;
  font-family: var(--heading);
  font-size: 1rem;
}

.loyalty-reward-description {
  margin: 0 0 14px;
  color: #cbd5e1;
  font-size: 0.82rem;
  line-height: 1.5;
}

.loyalty-reward-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.loyalty-reward-cost {
  color: #ffb07a;
  font-weight: 800;
  font-size: 0.9rem;
}

.loyalty-reward-insufficient {
  margin: 8px 0 0;
  color: #fca5a5;
  font-size: 0.72rem;
}
</style>
