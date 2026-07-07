<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import useSupportStore from "../../application/support.store.js";
import SupportPanel from "../components/support-panel.vue";
import { useBcSearch } from "../../../shared/presentation/composables/use-bc-search.js";
import {
  formatSupportDate,
  formatTicketCategory,
  getTicketPriorityKey,
  getTicketStatusKey,
  summarizeTicketStats
} from "../utils/support-presenter.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useSupportStore();
const { tickets, errors, ticketsLoaded } = storeToRefs(store);
const { fetchTickets, deleteTicket } = store;
const { filteredItems: filteredTickets } = useBcSearch(tickets);

const stats = computed(() => summarizeTicketStats(tickets.value));

const navigateToNew = () => router.push({ name: "support-ticket-new" });
const navigateToDetail = (id) => router.push({ name: "support-ticket-detail", params: { id } });
const navigateToEdit = (id) => router.push({ name: "support-ticket-edit", params: { id } });

const confirmDelete = (ticket) => {
  confirm.require({
    message: t("tickets.confirm-delete", { subject: ticket.subject }),
    header: t("tickets.delete-header"),
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: t("ticket.cancel"),
      severity: "secondary",
      outlined: true
    },
    acceptProps: {
      label: t("ticket.delete"),
      severity: "danger"
    },
    accept: () => deleteTicket(ticket)
  });
};

onMounted(() => {
  if (!ticketsLoaded.value) fetchTickets();
});
</script>

<template>
  <SupportPanel>
    <div class="support-card">
      <div class="support-dashboard-header">
        <div>
          <h2 class="support-section-title">{{ t("tickets.title") }}</h2>
          <p class="support-meta">{{ t("tickets.subtitle") }}</p>
        </div>
        <div class="support-dashboard-actions">
          <pv-button
              :label="t('tickets.new')"
              class="support-primary-button"
              icon="pi pi-plus"
              @click="navigateToNew"
          />
        </div>
      </div>

      <div v-if="ticketsLoaded && tickets.length" class="support-stats-row">
        <article class="support-stat-card">
          <strong>{{ stats.total }}</strong>
          <span>{{ t("tickets.stats-total") }}</span>
        </article>
        <article class="support-stat-card support-stat-card--teal">
          <strong>{{ stats.open }}</strong>
          <span>{{ t("tickets.stats-open") }}</span>
        </article>
        <article class="support-stat-card support-stat-card--muted">
          <strong>{{ stats.urgent }}</strong>
          <span>{{ t("tickets.stats-urgent") }}</span>
        </article>
      </div>

      <section class="support-info-card support-info-card--table">
        <div class="support-table-scroll">
          <pv-data-table
              :loading="!ticketsLoaded"
              :rows="8"
              :rows-per-page-options="[8, 16, 24]"
              :value="filteredTickets"
              class="support-table-mock"
              paginator
              table-style="width: 100%; min-width: 1080px; table-layout: fixed"
              @row-click="(event) => navigateToDetail(event.data.id)"
          >
            <pv-column
                :header="t('tickets.id')"
                field="id"
                sortable
                header-class="col-id"
                body-class="col-id"
            />
            <pv-column
                :header="t('tickets.userMode')"
                field="userMode"
                sortable
                header-class="col-category"
                body-class="col-category"
            >
              <template #body="slotProps">
                <span class="support-table-cell">
                  {{ t(`mode-selector.${slotProps.data.userMode}`) }}
                </span>
              </template>
            </pv-column>
            <pv-column
                :header="t('tickets.subject')"
                field="subject"
                sortable
                header-class="col-subject"
                body-class="col-subject"
            >
              <template #body="slotProps">
                <span class="support-table-cell support-table-cell--message" :title="slotProps.data.subject">
                  {{ slotProps.data.subject }}
                </span>
              </template>
            </pv-column>
            <pv-column
                :header="t('tickets.category')"
                field="category"
                sortable
                header-class="col-category"
                body-class="col-category"
            >
              <template #body="slotProps">
                <span class="support-table-cell support-table-cell--type" :title="slotProps.data.category">
                  {{ formatTicketCategory(slotProps.data.category) }}
                </span>
              </template>
            </pv-column>
            <pv-column
                :header="t('tickets.priority')"
                field="priority"
                sortable
                header-class="col-priority"
                body-class="col-priority"
            >
              <template #body="slotProps">
                <div class="support-table-cell support-table-cell--pill">
                  <span
                      class="support-severity-pill"
                      :class="`support-severity-pill--${getTicketPriorityKey(slotProps.data.priority)}`"
                  >
                    {{ slotProps.data.priority }}
                  </span>
                </div>
              </template>
            </pv-column>
            <pv-column
                :header="t('tickets.status')"
                field="status"
                sortable
                header-class="col-status"
                body-class="col-status"
            >
              <template #body="slotProps">
                <div class="support-table-cell support-table-cell--pill">
                  <span
                      class="support-status-pill"
                      :class="`support-status-pill--${getTicketStatusKey(slotProps.data.status)}`"
                  >
                    {{ slotProps.data.status }}
                  </span>
                </div>
              </template>
            </pv-column>
            <pv-column
                :header="t('tickets.updatedAt')"
                field="updatedAt"
                sortable
                header-class="col-updated"
                body-class="col-updated"
            >
              <template #body="slotProps">
                <span class="support-table-cell">
                  {{ formatSupportDate(slotProps.data.updatedAt) }}
                </span>
              </template>
            </pv-column>

            <pv-column
                :header="t('tickets.actions')"
                header-class="col-actions"
                body-class="col-actions"
            >
              <template #body="slotProps">
                <div class="table-actions">
                  <pv-button
                      type="button"
                      icon="pi pi-eye"
                      rounded
                      text
                      :aria-label="t('ticket.view')"
                      @click.stop="navigateToDetail(slotProps.data.id)"
                  />
                  <pv-button
                      icon="pi pi-pencil"
                      rounded
                      text
                      class="edit-button"
                      :aria-label="t('ticket.edit')"
                      @click.stop="navigateToEdit(slotProps.data.id)"
                  />
                  <pv-button
                      type="button"
                      icon="pi pi-trash"
                      rounded
                      text
                      class="delete-button"
                      :aria-label="t('ticket.delete')"
                      @click.stop="confirmDelete(slotProps.data)"
                  />
                </div>
              </template>
            </pv-column>
          </pv-data-table>
        </div>
      </section>

      <div v-if="errors.length" class="support-error">
        {{ t("errors.occurred") }}:
        {{ errors.map((e) => e.message).join(", ") }}
      </div>
    </div>
  </SupportPanel>
</template>
