<script setup>
import { onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useProfilesStore from "../../application/profiles.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import ProfilesPanel from "../components/profiles-panel.vue";

const { t } = useI18n();
const store = useProfilesStore();
const { preferences, preferencesLoading, errors } = storeToRefs(store);
const { fetchPreferences, updateExpeditionPreferences, updateNotificationPreferences, updatePrivacyPreferences } = store;

const touristId = useIamStore().currentUserId;

const difficulties = ["Easy", "Moderate", "Hard", "Expert"];

const expeditionForm = reactive({ preferredActivityTypes: "", preferredDifficulty: null, dietaryRestrictions: "" });
const notificationForm = reactive({ loyaltyUpdatesEnabled: true, expeditionRemindersEnabled: true });
const privacyForm = reactive({ profileVisibleToExpeditionMates: false });

function syncFormsFromPreferences() {
  if (!preferences.value) return;
  expeditionForm.preferredActivityTypes = preferences.value.preferredActivityTypes.join(", ");
  expeditionForm.preferredDifficulty = preferences.value.preferredDifficulty;
  expeditionForm.dietaryRestrictions = preferences.value.dietaryRestrictions.join(", ");
  notificationForm.loyaltyUpdatesEnabled = preferences.value.loyaltyUpdatesEnabled;
  notificationForm.expeditionRemindersEnabled = preferences.value.expeditionRemindersEnabled;
  privacyForm.profileVisibleToExpeditionMates = preferences.value.profileVisibleToExpeditionMates;
}

watch(preferences, syncFormsFromPreferences);

onMounted(() => fetchPreferences(touristId).then(syncFormsFromPreferences));

function splitList(value) {
  return value.split(",").map(v => v.trim()).filter(Boolean);
}

function saveExpeditionPreferences() {
  updateExpeditionPreferences(touristId, {
    preferredActivityTypes: splitList(expeditionForm.preferredActivityTypes),
    preferredDifficulty: expeditionForm.preferredDifficulty,
    dietaryRestrictions: splitList(expeditionForm.dietaryRestrictions)
  });
}

function saveNotificationPreferences() {
  updateNotificationPreferences(touristId, {
    loyaltyUpdatesEnabled: notificationForm.loyaltyUpdatesEnabled,
    expeditionRemindersEnabled: notificationForm.expeditionRemindersEnabled
  });
}

function savePrivacyPreferences() {
  updatePrivacyPreferences(touristId, { profileVisibleToExpeditionMates: privacyForm.profileVisibleToExpeditionMates });
}
</script>

<template>
  <ProfilesPanel>
    <div class="support-card">
      <h2 class="support-section-title">{{ t("profile.my-preferences.title") }}</h2>
      <p class="support-meta">{{ t("profile.my-preferences.subtitle") }}</p>

      <pv-skeleton v-if="preferencesLoading" width="100%" height="200px" />

      <template v-else>
        <section class="support-info-card">
          <h3>{{ t("profile.sections.expedition-preferences") }}</h3>
          <div class="p-fluid profile-form-grid">
            <div class="field">
              <label for="activityTypes">{{ t("profile.fields.preferredActivityTypes") }}</label>
              <pv-input-text id="activityTypes" v-model="expeditionForm.preferredActivityTypes" :placeholder="t('profile.fields.list-placeholder')" />
            </div>
            <div class="field">
              <label for="difficulty">{{ t("profile.fields.preferredDifficulty") }}</label>
              <pv-select
                  id="difficulty"
                  v-model="expeditionForm.preferredDifficulty"
                  :options="difficulties"
                  :placeholder="t('profile.fields.no-preference')"
                  show-clear
              >
                <template #option="{ option }">{{ t(`profile.difficulties.${option}`) }}</template>
                <template #value="{ value }">{{ value ? t(`profile.difficulties.${value}`) : t('profile.fields.no-preference') }}</template>
              </pv-select>
            </div>
            <div class="field">
              <label for="dietary">{{ t("profile.fields.dietaryRestrictions") }}</label>
              <pv-input-text id="dietary" v-model="expeditionForm.dietaryRestrictions" :placeholder="t('profile.fields.list-placeholder')" />
            </div>
          </div>
          <pv-button :label="t('common.save')" @click="saveExpeditionPreferences" />
        </section>

        <section class="support-info-card">
          <h3>{{ t("profile.sections.notification-preferences") }}</h3>
          <div class="preference-toggle">
            <pv-checkbox model-value disabled binary />
            <span>{{ t("profile.notifications.safety-always-on") }}</span>
          </div>
          <div class="preference-toggle">
            <pv-checkbox v-model="notificationForm.loyaltyUpdatesEnabled" binary input-id="loyaltyToggle" />
            <label for="loyaltyToggle">{{ t("profile.notifications.loyalty-updates") }}</label>
          </div>
          <div class="preference-toggle">
            <pv-checkbox v-model="notificationForm.expeditionRemindersEnabled" binary input-id="remindersToggle" />
            <label for="remindersToggle">{{ t("profile.notifications.expedition-reminders") }}</label>
          </div>
          <pv-button :label="t('common.save')" @click="saveNotificationPreferences" />
        </section>

        <section class="support-info-card">
          <h3>{{ t("profile.sections.privacy-preferences") }}</h3>
          <div class="preference-toggle">
            <pv-checkbox v-model="privacyForm.profileVisibleToExpeditionMates" binary input-id="visibilityToggle" />
            <label for="visibilityToggle">{{ t("profile.privacy.visible-to-expedition-mates") }}</label>
          </div>
          <p class="support-meta">{{ t("profile.privacy.note") }}</p>
          <pv-button :label="t('common.save')" @click="savePrivacyPreferences" />
        </section>

        <div v-if="errors.length" class="support-error">
          {{ t("errors.occurred") }}
        </div>
      </template>
    </div>
  </ProfilesPanel>
</template>

<style scoped>
.profile-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
  margin-bottom: 16px;
}

@media (max-width: 640px) {
  .profile-form-grid {
    grid-template-columns: 1fr;
  }
}

.preference-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #e2e8f0;
  font-size: 0.85rem;
}
</style>
