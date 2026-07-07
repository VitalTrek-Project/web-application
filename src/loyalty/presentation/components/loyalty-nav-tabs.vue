<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const props = defineProps({
  variant: { type: String, default: "tourist" } // 'tourist' | 'admin'
});

const { t } = useI18n();
const route = useRoute();

function isActive(name) {
  return route.name === name;
}
</script>

<template>
  <nav class="support-tabs" :aria-label="t('loyalty.title')">
    <template v-if="props.variant === 'tourist'">
      <router-link :to="{ name: 'loyalty-points' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-points') }">
        {{ t("loyalty.tabs.points") }}
      </router-link>
      <router-link :to="{ name: 'loyalty-rewards' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-rewards') }">
        {{ t("loyalty.tabs.rewards") }}
      </router-link>
      <router-link :to="{ name: 'loyalty-collectibles' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-collectibles') }">
        {{ t("loyalty.tabs.collectibles") }}
      </router-link>
      <router-link :to="{ name: 'loyalty-referral' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-referral') }">
        {{ t("loyalty.tabs.referral") }}
      </router-link>
    </template>
    <template v-else>
      <router-link :to="{ name: 'loyalty-admin-settings' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-admin-settings') }">
        {{ t("loyalty.tabs.settings") }}
      </router-link>
      <router-link :to="{ name: 'loyalty-admin-rewards' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-admin-rewards') }">
        {{ t("loyalty.tabs.rewards") }}
      </router-link>
      <router-link :to="{ name: 'loyalty-admin-redemptions' }" class="support-tab" :class="{ 'support-tab-active': isActive('loyalty-admin-redemptions') }">
        {{ t("loyalty.tabs.redemptions") }}
      </router-link>
    </template>
  </nav>
</template>
