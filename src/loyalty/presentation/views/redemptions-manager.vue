<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import useLoyaltyStore from "../../application/loyalty.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";
import { formatLoyaltyDate, getRedemptionStatusKey } from "../utils/loyalty-presenter.js";

const { t } = useI18n();
const toast = useToast();
const store = useLoyaltyStore();
const { foundRedemption, foundRedemptionLoading, errors } = storeToRefs(store);
const { findRedemptionByCode, markRedemptionUsed } = store;

const agencyId = useIamStore().currentAgencyId;
const searchCode = ref("");
const searched = ref(false);

function search() {
  const code = searchCode.value.trim();
  if (!code) return;
  searched.value = true;
  findRedemptionByCode(agencyId, code);
}

function markUsed() {
  markRedemptionUsed(agencyId, foundRedemption.value.id)
    .then(() => {
      toast.add({ severity: "success", summary: t("loyalty.redemptionsManager.marked-used"), life: 4000 });
    })
    .catch(() => {
      toast.add({ severity: "error", summary: t("loyalty.redemptionsManager.mark-error"), life: 5000 });
    });
}
</script>

<template>
  <LoyaltyPanel variant="admin">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.redemptionsManager.title") }}</h2>
      <p class="support-meta">{{ t("loyalty.redemptionsManager.subtitle") }}</p>

      <section class="support-info-card">
        <form class="loyalty-code-search" @submit.prevent="search">
          <pv-input-text
              v-model="searchCode"
              :placeholder="t('loyalty.redemptionsManager.code-placeholder')"
              class="w-full"
          />
          <pv-button type="submit" :label="t('loyalty.redemptionsManager.search')" icon="pi pi-search" class="support-primary-button" />
        </form>

        <pv-skeleton v-if="foundRedemptionLoading" width="100%" height="120px" class="loyalty-search-skeleton" />

        <div v-else-if="searched && !foundRedemption" class="loyalty-empty-text">
          {{ t("loyalty.redemptionsManager.not-found") }}
        </div>

        <div v-else-if="foundRedemption" class="loyalty-found-redemption">
          <div class="loyalty-found-row">
            <span>{{ t("loyalty.redemptionsManager.code") }}</span>
            <strong>{{ foundRedemption.code }}</strong>
          </div>
          <div class="loyalty-found-row">
            <span>{{ t("loyalty.redemptionsManager.points-spent") }}</span>
            <strong>{{ foundRedemption.pointsSpent }}</strong>
          </div>
          <div class="loyalty-found-row">
            <span>{{ t("loyalty.redemptionsManager.created-at") }}</span>
            <strong>{{ formatLoyaltyDate(foundRedemption.createdAt) }}</strong>
          </div>
          <div class="loyalty-found-row">
            <span>{{ t("loyalty.redemptionsManager.status") }}</span>
            <span
                class="support-status-pill"
                :class="`support-status-pill--${getRedemptionStatusKey(foundRedemption.status)}`"
            >
              {{ foundRedemption.status }}
            </span>
          </div>

          <pv-button
              v-if="foundRedemption.status === 'Pending'"
              :label="t('loyalty.redemptionsManager.mark-used')"
              icon="pi pi-check"
              class="support-primary-button loyalty-mark-used-button"
              @click="markUsed"
          />
        </div>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </LoyaltyPanel>
</template>

<style scoped>
.loyalty-code-search {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.loyalty-search-skeleton {
  margin-top: 10px;
}

.loyalty-empty-text {
  color: #64748b;
  font-size: 0.82rem;
  text-align: center;
  padding: 16px 0;
}

.loyalty-found-redemption {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.14);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loyalty-found-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.loyalty-found-row span {
  color: #94a3b8;
  font-size: 0.78rem;
}

.loyalty-found-row strong {
  color: #f1f5f9;
  font-size: 0.86rem;
}

.loyalty-mark-used-button {
  margin-top: 8px;
  align-self: flex-start;
}

:deep(.p-inputtext) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}
</style>
