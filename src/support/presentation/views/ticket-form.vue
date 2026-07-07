<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useSupportStore from "../../application/support.store.js";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { Ticket } from "../../domain/model/ticket.entity.js";
import { useAppModeStore } from "../../../shared/application/app-mode.store.js";
import SupportPanel from "../components/support-panel.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSupportStore();
const modeStore = useAppModeStore();
const { errors, ticketsLoaded } = storeToRefs(store);
const { addTicket, updateTicket, fetchTickets, getTicketById } = store;

const categoryOptions = computed(() => [
  { label: t("ticket.categories.general"), value: "general" },
  { label: t("ticket.categories.technical"), value: "technical" },
  { label: t("ticket.categories.billing"), value: "billing" },
  { label: t("ticket.categories.tour"), value: "tour" },
  { label: t("ticket.categories.account"), value: "account" },
  { label: t("ticket.categories.other"), value: "other" }
]);

const priorityOptions = computed(() => [
  { label: t("ticket.priorities.low"), value: "low" },
  { label: t("ticket.priorities.medium"), value: "medium" },
  { label: t("ticket.priorities.high"), value: "high" },
  { label: t("ticket.priorities.urgent"), value: "urgent" }
]);

const statusOptions = computed(() => [
  { label: t("ticket.statuses.open"), value: "open" },
  { label: t("ticket.statuses.in_progress"), value: "in_progress" },
  { label: t("ticket.statuses.resolved"), value: "resolved" },
  { label: t("ticket.statuses.closed"), value: "closed" }
]);

const form = ref({
  userMode: modeStore.mode || "trekker",
  fullName: "",
  email: "",
  subject: "",
  category: "general",
  priority: "medium",
  status: "open",
  description: ""
});

const isEdit = computed(() => !!route.params.id);

onMounted(async () => {
  if (!ticketsLoaded.value) {
    await fetchTickets();
  }
  if (isEdit.value) {
    const ticket = getTicketById(route.params.id);
    if (ticket) {
      form.value.userMode = ticket.userMode;
      form.value.fullName = ticket.fullName;
      form.value.email = ticket.email;
      form.value.subject = ticket.subject;
      form.value.category = ticket.category;
      form.value.priority = ticket.priority;
      form.value.status = ticket.status;
      form.value.description = ticket.description;
    } else {
      navigateBack();
    }
  }
});

const navigateBack = () => router.push({ name: "support-tickets" });

const saveTicket = () => {
  const now = new Date().toISOString();
  const ticket = new Ticket({
    id: isEdit.value ? route.params.id : null,
    userMode: form.value.userMode,
    fullName: form.value.fullName,
    email: form.value.email,
    subject: form.value.subject,
    category: form.value.category,
    priority: form.value.priority,
    status: form.value.status,
    description: form.value.description,
    createdAt: isEdit.value ? getTicketById(route.params.id)?.createdAt : now,
    updatedAt: now
  });
  if (isEdit.value) {
    updateTicket(ticket);
  } else {
    addTicket(ticket);
  }
  navigateBack();
};
</script>

<template>
  <SupportPanel>
    <div class="support-card">
      <div class="support-dashboard-header">
        <div>
          <h2 class="support-section-title">
            {{ isEdit ? t("ticket.edit-title") : t("ticket.new-title") }}
          </h2>
          <p class="support-meta">{{ t("tickets.subtitle") }}</p>
        </div>
      </div>

      <section class="support-info-card">
        <form class="bc-form" @submit.prevent="saveTicket">
          <div class="bc-form-field">
            <label for="userMode">{{ t("ticket.userMode") }}</label>
            <pv-select
                id="userMode"
                v-model="form.userMode"
                :options="[{label: t('mode-selector.trekker'), value: 'trekker'}, {label: t('mode-selector.empresa'), value: 'empresa'}]"
                option-label="label"
                option-value="value"
                class="w-full"
            />
          </div>
          <div class="bc-form-field">
            <label for="fullName">{{ t("ticket.fullName") }}</label>
            <pv-input-text id="fullName" v-model="form.fullName" class="w-full" required />
          </div>
          <div class="bc-form-field">
            <label for="email">{{ t("ticket.email") }}</label>
            <pv-input-text id="email" v-model="form.email" type="email" class="w-full" required />
          </div>
          <div class="bc-form-field">
            <label for="subject">{{ t("ticket.subject") }}</label>
            <pv-input-text id="subject" v-model="form.subject" class="w-full" required />
          </div>
          <div class="bc-form-field">
            <label for="category">{{ t("ticket.category") }}</label>
            <pv-select
                id="category"
                v-model="form.category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                class="w-full"
            />
          </div>
          <div class="bc-form-field">
            <label for="priority">{{ t("ticket.priority") }}</label>
            <pv-select
                id="priority"
                v-model="form.priority"
                :options="priorityOptions"
                option-label="label"
                option-value="value"
                class="w-full"
            />
          </div>
          <div v-if="isEdit" class="bc-form-field">
            <label for="status">{{ t("ticket.status") }}</label>
            <pv-select
                id="status"
                v-model="form.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                class="w-full"
            />
          </div>
          <div class="bc-form-field">
            <label for="description">{{ t("ticket.description") }}</label>
            <pv-textarea id="description" v-model="form.description" rows="4" class="w-full" required />
          </div>

          <div class="bc-form-actions">
            <pv-button
                type="button"
                :label="t('ticket.cancel')"
                severity="secondary"
                outlined
                @click="navigateBack"
            />
            <pv-button
                type="submit"
                :label="t('ticket.save')"
                class="support-primary-button"
                icon="pi pi-save"
            />
          </div>
        </form>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}: {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </SupportPanel>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-textarea),
:deep(.p-select) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-inputtext:enabled:focus),
:deep(.p-textarea:enabled:focus),
:deep(.p-select:not(.p-disabled).p-focus) {
  border-color: #ff7a30;
  box-shadow: 0 0 0 1px rgba(255, 122, 48, 0.25);
}

:deep(.p-select-label),
:deep(.p-select-dropdown) {
  color: #ffffff;
}
</style>
