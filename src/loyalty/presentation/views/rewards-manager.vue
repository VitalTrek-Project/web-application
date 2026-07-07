<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalAgencyId } from "../../../shared/infrastructure/local-identity.js";
import LoyaltyPanel from "../components/loyalty-panel.vue";

const { t } = useI18n();
const confirm = useConfirm();
const store = useLoyaltyStore();
const { rewards, rewardsLoading, errors } = storeToRefs(store);
const { fetchRewards, createReward, updateReward, deactivateReward } = store;

const agencyId = getLocalAgencyId();

onMounted(() => fetchRewards(agencyId, false, true));

const dialogVisible = ref(false);
const editingReward = ref(null);
const form = ref({ name: "", description: "", pointsCost: 100, stock: null, isActive: true });

function openNew() {
  editingReward.value = null;
  form.value = { name: "", description: "", pointsCost: 100, stock: null, isActive: true };
  dialogVisible.value = true;
}

function openEdit(reward) {
  editingReward.value = reward;
  form.value = { ...reward };
  dialogVisible.value = true;
}

function save() {
  const action = editingReward.value
    ? updateReward(agencyId, editingReward.value.id, form.value)
    : createReward(agencyId, form.value);
  action.then(() => { dialogVisible.value = false; });
}

function confirmDeactivate(reward) {
  confirm.require({
    message: t("loyalty.rewardsManager.confirm-deactivate", { name: reward.name }),
    header: t("loyalty.rewardsManager.deactivate-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: t("ticket.cancel"), severity: "secondary", outlined: true },
    acceptProps: { label: t("loyalty.rewardsManager.deactivate"), severity: "danger" },
    accept: () => deactivateReward(agencyId, reward.id)
  });
}
</script>

<template>
  <LoyaltyPanel variant="admin">
    <div class="support-card">
      <div class="support-dashboard-header">
        <div>
          <h2 class="support-section-title">{{ t("loyalty.rewardsManager.title") }}</h2>
          <p class="support-meta">{{ t("loyalty.rewardsManager.subtitle") }}</p>
        </div>
        <div class="support-dashboard-actions">
          <pv-button :label="t('loyalty.rewardsManager.new')" icon="pi pi-plus" class="support-primary-button" @click="openNew" />
        </div>
      </div>

      <section class="support-info-card support-info-card--table">
        <div class="support-table-scroll">
          <pv-data-table :loading="rewardsLoading" :value="rewards" class="support-table-mock">
            <pv-column :header="t('loyalty.rewardsManager.name')" field="name" />
            <pv-column :header="t('loyalty.rewardsManager.cost')" field="pointsCost" />
            <pv-column :header="t('loyalty.rewardsManager.stock')" field="stock">
              <template #body="slotProps">
                {{ slotProps.data.stock ?? t("loyalty.rewardsManager.unlimited") }}
              </template>
            </pv-column>
            <pv-column :header="t('loyalty.rewardsManager.status')">
              <template #body="slotProps">
                <span
                    class="support-status-pill"
                    :class="slotProps.data.isActive ? 'support-status-pill--active' : 'support-status-pill--neutral'"
                >
                  {{ slotProps.data.isActive ? t("loyalty.rewardsManager.active") : t("loyalty.rewardsManager.inactive") }}
                </span>
              </template>
            </pv-column>
            <pv-column :header="t('tickets.actions')">
              <template #body="slotProps">
                <div class="table-actions">
                  <pv-button icon="pi pi-pencil" rounded text class="edit-button" @click="openEdit(slotProps.data)" />
                  <pv-button
                      v-if="slotProps.data.isActive"
                      icon="pi pi-ban"
                      rounded
                      text
                      class="delete-button"
                      @click="confirmDeactivate(slotProps.data)"
                  />
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

    <pv-dialog v-model:visible="dialogVisible" modal :header="editingReward ? t('loyalty.rewardsManager.edit') : t('loyalty.rewardsManager.new')">
      <form class="bc-form" @submit.prevent="save">
        <div class="bc-form-field">
          <label for="rewardName">{{ t("loyalty.rewardsManager.name") }}</label>
          <pv-input-text id="rewardName" v-model="form.name" class="w-full" required />
        </div>
        <div class="bc-form-field">
          <label for="rewardDescription">{{ t("loyalty.rewardsManager.description") }}</label>
          <pv-textarea id="rewardDescription" v-model="form.description" rows="3" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="rewardCost">{{ t("loyalty.rewardsManager.cost") }}</label>
          <pv-input-number id="rewardCost" v-model="form.pointsCost" :min="1" class="w-full" />
        </div>
        <div class="bc-form-field">
          <label for="rewardStock">{{ t("loyalty.rewardsManager.stock-optional") }}</label>
          <pv-input-number id="rewardStock" v-model="form.stock" :min="0" class="w-full" show-buttons />
        </div>
        <div v-if="editingReward" class="bc-form-field">
          <label for="rewardActive">{{ t("loyalty.rewardsManager.status") }}</label>
          <pv-select
              id="rewardActive"
              v-model="form.isActive"
              :options="[{label: t('loyalty.rewardsManager.active'), value: true}, {label: t('loyalty.rewardsManager.inactive'), value: false}]"
              option-label="label"
              option-value="value"
              class="w-full"
          />
        </div>
        <div class="bc-form-actions">
          <pv-button type="button" :label="t('ticket.cancel')" severity="secondary" outlined @click="dialogVisible = false" />
          <pv-button type="submit" :label="t('loyalty.settings.save')" class="support-primary-button" />
        </div>
      </form>
    </pv-dialog>
  </LoyaltyPanel>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-select),
:deep(.p-inputnumber-input) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}
</style>
