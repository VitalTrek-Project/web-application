<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import useSupportStore from "../../application/support.store.js";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { Ticket } from "../../domain/model/ticket.entity.js";
import { useAppModeStore } from "../../../shared/application/app-mode.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import { mapAppModeToTicketUserMode } from "../utils/support-presenter.js";
import SupportPanel from "../components/support-panel.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSupportStore();
const modeStore = useAppModeStore();
const { errors, ticketsLoaded } = storeToRefs(store);
const { addTicket, updateTicket, fetchTickets, getTicketById } = store;

// The backend's Support bounded context only accepts these exact values
// (case-sensitive) — see Support/Domain/Model/ValueObjects on the backend.
const userModeOptions = computed(() => [
  { label: t("ticket.user-modes.tourist"), value: "Tourist" },
  { label: t("ticket.user-modes.guide"), value: "Guide" }
]);

const categoryOptions = computed(() => [
  { label: t("ticket.categories.general"), value: "general" },
  { label: t("ticket.categories.technical"), value: "technical" },
  { label: t("ticket.categories.billing"), value: "billing" },
  { label: t("ticket.categories.tour"), value: "tour" },
  { label: t("ticket.categories.account"), value: "account" },
  { label: t("ticket.categories.other"), value: "other" }
]);

const priorityOptions = computed(() => [
  { label: t("ticket.priorities.low"), value: "Low" },
  { label: t("ticket.priorities.medium"), value: "Medium" },
  { label: t("ticket.priorities.high"), value: "High" },
  { label: t("ticket.priorities.urgent"), value: "Urgent" }
]);

const statusOptions = computed(() => [
  { label: t("ticket.statuses.open"), value: "Open" },
  { label: t("ticket.statuses.in_progress"), value: "InProgress" },
  { label: t("ticket.statuses.resolved"), value: "Resolved" },
  { label: t("ticket.statuses.closed"), value: "Closed" }
]);

const form = ref({
  userMode: mapAppModeToTicketUserMode(modeStore.mode),
  fullName: "",
  email: "",
  subject: "",
  category: "general",
  priority: "Medium",
  status: "Open",
  description: ""
});

const isEdit = computed(() => !!route.params.id);
const currentTicket = computed(() => (isEdit.value ? getTicketById(route.params.id) : null));

onMounted(async () => {
  if (!ticketsLoaded.value) {
    await fetchTickets();
  }
  if (isEdit.value) {
    const ticket = getTicketById(route.params.id);
    if (ticket) {
      form.value.priority = ticket.priority;
      form.value.status = ticket.status;
    } else {
      navigateBack();
    }
  }
});

const navigateBack = () => router.push({ name: "support-tickets" });

const saveTicket = () => {
  if (isEdit.value) {
    // The backend only allows changing status/priority after creation.
    updateTicket(route.params.id, {
      status: form.value.status,
      priority: form.value.priority
    }).then(navigateBack);
    return;
  }

  const ticket = new Ticket({
    userId: useIamStore().currentUserId,
    userMode: form.value.userMode,
    fullName: form.value.fullName,
    email: form.value.email,
    subject: form.value.subject,
    category: form.value.category,
    priority: form.value.priority,
    description: form.value.description
  });
  addTicket(ticket).then(navigateBack);
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
        <template v-if="isEdit && currentTicket">
          <dl class="ticket-form__readonly">
            <div>
              <dt>{{ t("ticket.subject") }}</dt>
              <dd>{{ currentTicket.subject }}</dd>
            </div>
            <div>
              <dt>{{ t("ticket.category") }}</dt>
              <dd>{{ currentTicket.category }}</dd>
            </div>
            <div>
              <dt>{{ t("ticket.fullName") }}</dt>
              <dd>{{ currentTicket.fullName }} ({{ currentTicket.email }})</dd>
            </div>
            <div class="ticket-form__readonly-description">
              <dt>{{ t("ticket.description") }}</dt>
              <dd>{{ currentTicket.description }}</dd>
            </div>
          </dl>
        </template>

        <form class="bc-form" @submit.prevent="saveTicket">
          <template v-if="!isEdit">
            <div class="bc-form-field">
              <label for="userMode">{{ t("ticket.userMode") }}</label>
              <pv-select
                  id="userMode"
                  v-model="form.userMode"
                  :options="userModeOptions"
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
              <label for="description">{{ t("ticket.description") }}</label>
              <pv-textarea id="description" v-model="form.description" rows="4" class="w-full" required />
            </div>
          </template>

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

.ticket-form__readonly {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 0 0 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.ticket-form__readonly dt {
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.ticket-form__readonly dd {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.86rem;
}

.ticket-form__readonly-description {
  grid-column: 1 / -1;
}

@media (max-width: 700px) {
  .ticket-form__readonly {
    grid-template-columns: 1fr;
  }
}
</style>
