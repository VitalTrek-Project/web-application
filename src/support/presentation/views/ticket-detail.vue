<script setup>
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import useSupportStore from "../../application/support.store.js";
import { useAppModeStore } from "../../../shared/application/app-mode.store.js";
import { TicketReply } from "../../domain/model/ticket-reply.entity.js";
import SupportPanel from "../components/support-panel.vue";
import {
  formatSupportDate,
  formatTicketCategory,
  getTicketPriorityKey,
  getTicketStatusKey
} from "../utils/support-presenter.js";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSupportStore();
const modeStore = useAppModeStore();
const { errors, ticketsLoaded, replies, repliesLoaded } = storeToRefs(store);
const { fetchTickets, getTicketById, fetchRepliesByTicketId, addReply } = store;

const replyMessage = ref("");

const ticket = computed(() => getTicketById(route.params.id));

const sortedReplies = computed(() =>
  [...replies.value].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
);

const navigateBack = () => router.push({ name: "support-tickets" });
const navigateToEdit = () => router.push({ name: "support-ticket-edit", params: { id: route.params.id } });

const sendReply = () => {
  const message = replyMessage.value.trim();
  if (!message) return;
  const reply = new TicketReply({
    ticketId: route.params.id,
    authorName: t(`mode-selector.${modeStore.mode || "trekker"}`),
    authorMode: modeStore.mode || "trekker",
    message,
    createdAt: new Date().toISOString()
  });
  addReply(reply).then(() => {
    replyMessage.value = "";
  });
};

onMounted(async () => {
  if (!ticketsLoaded.value) {
    await fetchTickets();
  }
  if (!ticket.value) {
    navigateBack();
    return;
  }
  await fetchRepliesByTicketId(route.params.id);
});
</script>

<template>
  <SupportPanel v-if="ticket">
    <div class="support-card">
      <div class="support-dashboard-header">
        <div>
          <h2 class="support-section-title">{{ ticket.subject }}</h2>
          <p class="support-meta">
            {{ t("ticket.requested-by", { name: ticket.fullName || ticket.email }) }}
          </p>
        </div>
        <div class="support-dashboard-actions">
          <pv-button
              :label="t('ticket.edit')"
              icon="pi pi-pencil"
              class="support-outline-button"
              outlined
              @click="navigateToEdit"
          />
          <pv-button
              :label="t('ticket.back')"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              @click="navigateBack"
          />
        </div>
      </div>

      <section class="support-info-card">
        <div class="support-detail-meta-row">
          <span class="support-severity-pill" :class="`support-severity-pill--${getTicketPriorityKey(ticket.priority)}`">
            {{ ticket.priority }}
          </span>
          <span class="support-status-pill" :class="`support-status-pill--${getTicketStatusKey(ticket.status)}`">
            {{ ticket.status }}
          </span>
          <span class="support-detail-tag">{{ formatTicketCategory(ticket.category) }}</span>
          <span class="support-detail-tag">{{ t(`mode-selector.${ticket.userMode}`) }}</span>
        </div>
        <p class="support-detail-description">{{ ticket.description }}</p>
      </section>

      <section class="support-info-card" aria-labelledby="support-thread-title">
        <h3 id="support-thread-title">{{ t("ticket.conversation") }}</h3>

        <ul class="support-thread" aria-live="polite">
          <li v-if="repliesLoaded && !sortedReplies.length" class="support-thread-empty">
            {{ t("ticket.no-replies") }}
          </li>
          <li v-for="reply in sortedReplies" :key="reply.id" class="support-thread-item">
            <div class="support-thread-item-header">
              <strong>{{ reply.authorName }}</strong>
              <span class="support-detail-tag">{{ t(`mode-selector.${reply.authorMode}`) }}</span>
              <time class="support-thread-item-date">{{ formatSupportDate(reply.createdAt) }}</time>
            </div>
            <p>{{ reply.message }}</p>
          </li>
        </ul>

        <form class="support-reply-form" @submit.prevent="sendReply">
          <label for="reply-message" class="visually-hidden">{{ t("ticket.reply-placeholder") }}</label>
          <pv-textarea
              id="reply-message"
              v-model="replyMessage"
              :placeholder="t('ticket.reply-placeholder')"
              rows="3"
              class="w-full"
          />
          <div class="bc-form-actions">
            <pv-button
                type="submit"
                :label="t('ticket.reply-send')"
                class="support-primary-button"
                icon="pi pi-send"
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
.support-detail-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.support-detail-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(148, 163, 184, 0.12);
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.support-detail-description {
  color: #e2e8f0;
  font-size: 0.86rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

.support-thread {
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
}

.support-thread-empty {
  color: #94a3b8;
  font-size: 0.82rem;
}

.support-thread-item {
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.support-thread-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #ffffff;
  font-size: 0.78rem;
}

.support-thread-item-date {
  margin-left: auto;
  color: #94a3b8;
  font-size: 0.7rem;
}

.support-thread-item p {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.84rem;
  line-height: 1.55;
}

.support-reply-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:deep(.p-textarea) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(220, 229, 241, 0.16);
  color: #ffffff;
}

:deep(.p-textarea:enabled:focus) {
  border-color: #ff7a30;
  box-shadow: 0 0 0 1px rgba(255, 122, 48, 0.25);
}

@media (max-width: 800px) {
  .support-thread-item-header {
    flex-wrap: wrap;
  }

  .support-thread-item-date {
    margin-left: 0;
  }
}
</style>
