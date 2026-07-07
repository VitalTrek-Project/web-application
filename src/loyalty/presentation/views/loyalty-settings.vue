<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";

const { t } = useI18n();
const confirm = useConfirm();
const toast = useToast();
const store = useLoyaltyStore();
const { program, programLoading, tiers, tiersLoading, errors } = storeToRefs(store);
const { fetchProgram, updateProgram, fetchTiers, createTier, updateTier, deleteTier } = store;

const agencyId = getLocalAgencyId();

const expirationOptions = [
  { label: t("loyalty.settings.expiration-never"), value: null },
  { label: t("loyalty.settings.expiration-12"), value: 12 },
  { label: t("loyalty.settings.expiration-24"), value: 24 }
];

const programForm = ref({
  pointsPerExpeditionCompleted: 0,
  pointsPerExpeditionBooked: 0,
  pointsPerReferral: 0,
  pointsPerReview: 0,
  expirationMonths: null
});

onMounted(async () => {
  await fetchProgram(agencyId);
  if (program.value) {
    programForm.value = {
      pointsPerExpeditionCompleted: program.value.pointsPerExpeditionCompleted,
      pointsPerExpeditionBooked: program.value.pointsPerExpeditionBooked,
      pointsPerReferral: program.value.pointsPerReferral,
      pointsPerReview: program.value.pointsPerReview,
      expirationMonths: program.value.expirationMonths
    };
  }
  fetchTiers(agencyId);
});

function saveProgram() {
  updateProgram(agencyId, programForm.value).then(() => {
    toast.add({ severity: "success", summary: t("loyalty.settings.saved"), life: 3000 });
  });
}

const tierDialogVisible = ref(false);
const editingTier = ref(null);
const tierForm = ref({ name: "", minPoints: 0, benefits: "", sortOrder: 0 });

function openNewTier() {
  editingTier.value = null;
  tierForm.value = { name: "", minPoints: 0, benefits: "", sortOrder: tiers.value.length };
  tierDialogVisible.value = true;
}

function openEditTier(tier) {
  editingTier.value = tier;
  tierForm.value = { name: tier.name, minPoints: tier.minPoints, benefits: tier.benefits, sortOrder: tier.sortOrder };
  tierDialogVisible.value = true;
}

function saveTier() {
  const action = editingTier.value
    ? updateTier(agencyId, editingTier.value.id, tierForm.value)
    : createTier(agencyId, tierForm.value);
  action.then(() => {
    tierDialogVisible.value = false;
  });
}

function confirmDeleteTier(tier) {
  confirm.require({
    message: t("loyalty.settings.confirm-delete-tier", { name: tier.name }),
    header: t("loyalty.settings.delete-tier-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: t("ticket.cancel"), severity: "secondary", outlined: true },
    acceptProps: { label: t("ticket.delete"), severity: "danger" },
    accept: () => deleteTier(agencyId, tier.id)
  });
}
</script>

<template>
  <LoyaltyPanel variant="admin">
    <div class="support-card">
      <h2 class="support-section-title">{{ t("loyalty.settings.title") }}</h2>
      <p class="support-meta">{{ t("loyalty.settings.subtitle") }}</p>

      <section class="support-info-card">
        <h3>{{ t("loyalty.settings.program") }}</h3>
        <pv-skeleton v-if="programLoading" width="100%" height="140px" />
        <form v-else class="bc-form loyalty-settings-grid" @submit.prevent="saveProgram">
          <div class="bc-form-field">
            <label for="pointsCompleted">{{ t("loyalty.settings.points-completed") }}</label>
            <pv-input-number id="pointsCompleted" v-model="programForm.pointsPerExpeditionCompleted" :min="0" class="w-full" />
          </div>
          <div class="bc-form-field">
            <label for="pointsBooked">{{ t("loyalty.settings.points-booked") }}</label>
            <pv-input-number id="pointsBooked" v-model="programForm.pointsPerExpeditionBooked" :min="0" class="w-full" />
          </div>
          <div class="bc-form-field">
            <label for="pointsReferral">{{ t("loyalty.settings.points-referral") }}</label>
            <pv-input-number id="pointsReferral" v-model="programForm.pointsPerReferral" :min="0" class="w-full" />
          </div>
          <div class="bc-form-field">
            <label for="pointsReview">{{ t("loyalty.settings.points-review") }}</label>
            <pv-input-number id="pointsReview" v-model="programForm.pointsPerReview" :min="0" class="w-full" />
          </div>
          <div class="bc-form-field">
            <label for="expiration">{{ t("loyalty.settings.expiration") }}</label>
            <pv-select
                id="expiration"
                v-model="programForm.expirationMonths"
                :options="expirationOptions"
                option-label="label"
                option-value="value"
                class="w-full"
            />
          </div>
          <div class="bc-form-actions loyalty-settings-actions">
            <pv-button type="submit" :label="t('loyalty.settings.save')" class="support-primary-button" icon="pi pi-save" />
          </div>
        </form>
      </section>

      <section class="support-info-card">
        <div class="loyalty-tiers-header">
          <h3>{{ t("loyalty.settings.tiers") }}</h3>
          <pv-button :label="t('loyalty.settings.add-tier')" icon="pi pi-plus" outlined @click="openNewTier" />
        </div>
        <pv-skeleton v-if="tiersLoading" width="100%" height="120px" />
        <div v-else class="support-table-scroll">
          <pv-data-table :value="tiers" class="support-table-mock">
            <pv-column :header="t('loyalty.settings.tier-name')" field="name" />
            <pv-column :header="t('loyalty.settings.tier-min-points')" field="minPoints" />
            <pv-column :header="t('loyalty.settings.tier-benefits')" field="benefits" />
            <pv-column :header="t('tickets.actions')">
              <template #body="slotProps">
                <div class="table-actions">
                  <pv-button icon="pi pi-pencil" rounded text class="edit-button" @click="openEditTier(slotProps.data)" />
                  <pv-button icon="pi pi-trash" rounded text class="delete-button" @click="confirmDeleteTier(slotProps.data)" />
                </div>
              </template>
            </pv-column>
          </pv-data-table>
        </div>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>

    <pv-dialog v-model:visible="tierDialogVisible" modal :header="editingTier ? t('loyalty.settings.edit-tier') : t('loyalty.settings.add-tier')" class="loyalty-tier-dialog">
      <form class="bc-form" @submit.prevent="saveTier">
        <div class="bc-form-field">
          <label for="tierName">{{ t("loyalty.settings.tier-name") }}</label>
          <pv-input-text id="tierName" v-model="tierForm.name" class="w-full" required />
        </div>
        <div class="bc-form-field">
          <label for="tierMinPoints">{{ t("loyalty.settings.tier-min-points") }}</label>
          <pv-input-number id="tierMinPoints" v-model="tierForm.minPoints" :min="0" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="tierBenefits">{{ t("loyalty.settings.tier-benefits") }}</label>
          <pv-textarea id="tierBenefits" v-model="tierForm.benefits" rows="3" class="w-full" />
        </div>
        <div class="bc-form-actions">
          <pv-button type="button" :label="t('ticket.cancel')" severity="secondary" outlined @click="tierDialogVisible = false" />
          <pv-button type="submit" :label="t('loyalty.settings.save')" class="support-primary-button" />
        </div>
      </form>
    </pv-dialog>
  </LoyaltyPanel>
</template>

<style scoped>
.loyalty-settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.loyalty-settings-actions {
  grid-column: 1 / -1;
}

.loyalty-tiers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.loyalty-tiers-header h3 {
  margin: 0;
}

:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-select),
:deep(.p-inputnumber-input) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

@media (max-width: 700px) {
  .loyalty-settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
