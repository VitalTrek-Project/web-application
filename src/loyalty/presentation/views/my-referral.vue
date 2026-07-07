<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalUserId, getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";

const { t } = useI18n();
const toast = useToast();
const store = useLoyaltyStore();
const { referralCode, referralCodeLoading, errors } = storeToRefs(store);
const { fetchReferralCode, redeemReferralCode } = store;

const agencyId = getLocalAgencyId();
const touristId = getLocalUserId();
const friendCode = ref("");

onMounted(() => {
  fetchReferralCode(agencyId, touristId);
});

function copyCode() {
  navigator.clipboard?.writeText(referralCode.value).then(() => {
    toast.add({ severity: "success", summary: t("loyalty.referral.copied"), life: 3000 });
  });
}

function redeemFriendCode() {
  const code = friendCode.value.trim();
  if (!code) return;
  redeemReferralCode(agencyId, code, touristId)
    .then(() => {
      toast.add({ severity: "success", summary: t("loyalty.referral.redeem-success"), life: 5000 });
      friendCode.value = "";
    })
    .catch(() => {
      toast.add({ severity: "error", summary: t("loyalty.referral.redeem-error"), life: 5000 });
    });
}
</script>

<template>
  <LoyaltyPanel variant="tourist">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.referral.title") }}</h2>
      <p class="support-meta">{{ t("loyalty.referral.subtitle") }}</p>

      <section class="support-info-card loyalty-referral-card">
        <pv-skeleton v-if="referralCodeLoading" width="100%" height="60px" />
        <template v-else>
          <span class="loyalty-referral-label">{{ t("loyalty.referral.your-code") }}</span>
          <div class="loyalty-referral-code-row">
            <code class="loyalty-referral-code">{{ referralCode }}</code>
            <pv-button icon="pi pi-copy" :label="t('loyalty.referral.copy')" outlined @click="copyCode" />
          </div>
        </template>
      </section>

      <section class="support-info-card">
        <h3>{{ t("loyalty.referral.have-code") }}</h3>
        <form class="bc-form" @submit.prevent="redeemFriendCode">
          <div class="bc-form-field">
            <label for="friend-code">{{ t("loyalty.referral.friend-code-label") }}</label>
            <pv-input-text id="friend-code" v-model="friendCode" class="w-full" />
          </div>
          <div class="bc-form-actions">
            <pv-button type="submit" :label="t('loyalty.referral.redeem')" class="support-primary-button" />
          </div>
        </form>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </LoyaltyPanel>
</template>

<style scoped>
.loyalty-referral-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loyalty-referral-label {
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loyalty-referral-code-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.loyalty-referral-code {
  font-family: monospace;
  font-size: 1.4rem;
  letter-spacing: 0.12em;
  color: #ffb07a;
  background: rgba(255, 122, 48, 0.08);
  border: 1px solid rgba(255, 122, 48, 0.22);
  border-radius: 10px;
  padding: 8px 16px;
}

:deep(.p-inputtext) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}
</style>
