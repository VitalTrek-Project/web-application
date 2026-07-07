<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useLoyaltyStore from "../../application/loyalty.store.js";
import { getLocalUserId } from "../../../shared/infrastructure/local-identity.js";
import { formatLoyaltyDate } from "../utils/loyalty-presenter.js";

const { t } = useI18n();
const store = useLoyaltyStore();
const { notifications, unreadCount } = storeToRefs(store);
const { fetchNotifications, markNotificationRead } = store;

const touristId = getLocalUserId();
const open = ref(false);

onMounted(() => {
  fetchNotifications(touristId);
});

function toggle() {
  open.value = !open.value;
  if (open.value) fetchNotifications(touristId);
}

function readAndClose(notification) {
  if (!notification.isRead) markNotificationRead(notification.id);
}
</script>

<template>
  <div class="notification-bell">
    <button
        type="button"
        class="notification-bell__trigger"
        :aria-label="t('loyalty.notifications.title')"
        @click="toggle"
    >
      <i class="pi pi-bell" aria-hidden="true" />
      <span v-if="unreadCount > 0" class="notification-bell__badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>

    <div v-if="open" class="notification-bell__panel">
      <div class="notification-bell__header">{{ t("loyalty.notifications.title") }}</div>
      <p v-if="!notifications.length" class="notification-bell__empty">{{ t("loyalty.notifications.empty") }}</p>
      <ul v-else class="notification-bell__list">
        <li
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-bell__item"
            :class="{ 'notification-bell__item--unread': !notification.isRead }"
            @click="readAndClose(notification)"
        >
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
          <span>{{ formatLoyaltyDate(notification.createdAt) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.notification-bell {
  position: relative;
}

.notification-bell__trigger {
  position: relative;
  background: none;
  border: none;
  color: #dbe4ef;
  cursor: pointer;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-bell__trigger:hover {
  color: #ffffff;
}

.notification-bell__trigger .pi-bell {
  font-size: 1.1rem;
}

.notification-bell__badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: 999px;
  background: #ff7a30;
  color: #0f1419;
  font-size: 0.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-bell__panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  max-height: 360px;
  overflow-y: auto;
  background: #121a26;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  z-index: 40;
}

.notification-bell__header {
  padding: 12px 14px;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.82rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.notification-bell__empty {
  padding: 16px;
  color: #64748b;
  font-size: 0.78rem;
  text-align: center;
  margin: 0;
}

.notification-bell__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notification-bell__item {
  padding: 10px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  cursor: pointer;
}

.notification-bell__item:last-child {
  border-bottom: none;
}

.notification-bell__item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.notification-bell__item--unread {
  background: rgba(255, 122, 48, 0.06);
}

.notification-bell__item strong {
  display: block;
  color: #f1f5f9;
  font-size: 0.78rem;
}

.notification-bell__item p {
  margin: 3px 0;
  color: #cbd5e1;
  font-size: 0.72rem;
  line-height: 1.4;
}

.notification-bell__item span {
  color: #64748b;
  font-size: 0.66rem;
}
</style>
