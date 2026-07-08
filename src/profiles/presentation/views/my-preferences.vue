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
        <section class="support-info-card preference-section">
          <h3>{{ t("profile.sections.expedition-preferences") }}</h3>
          <div class="p-fluid preference-form-grid">
            <div class="field preference-form-grid__full">
              <label for="activityTypes">{{ t("profile.fields.preferredActivityTypes") }}</label>
              <pv-input-text
                  id="activityTypes"
                  v-model="expeditionForm.preferredActivityTypes"
                  class="w-full"
                  :placeholder="t('profile.fields.list-placeholder')"
              />
            </div>
            <div class="field">
              <label for="difficulty">{{ t("profile.fields.preferredDifficulty") }}</label>
              <pv-select
                  id="difficulty"
                  v-model="expeditionForm.preferredDifficulty"
                  :options="difficulties"
                  :placeholder="t('profile.fields.no-preference')"
                  show-clear
                  class="w-full"
              >
                <template #option="{ option }">{{ t(`profile.difficulties.${option}`) }}</template>
                <template #value="{ value }">{{ value ? t(`profile.difficulties.${value}`) : t('profile.fields.no-preference') }}</template>
              </pv-select>
            </div>
            <div class="field">
              <label for="dietary">{{ t("profile.fields.dietaryRestrictions") }}</label>
              <pv-input-text
                  id="dietary"
                  v-model="expeditionForm.dietaryRestrictions"
                  class="w-full"
                  :placeholder="t('profile.fields.list-placeholder')"
              />
            </div>
          </div>
          <pv-button :label="t('common.save')" @click="saveExpeditionPreferences" />
        </section>

        <section class="support-info-card preference-section">
          <h3>{{ t("profile.sections.notification-preferences") }}</h3>
          <div class="preference-list">
            <label class="preference-row preference-row--locked">
              <pv-checkbox model-value disabled binary />
              <span>
                <strong>{{ t("profile.notifications.safety-always-on") }}</strong>
              </span>
            </label>
            <label class="preference-row" for="loyaltyToggle">
              <pv-checkbox v-model="notificationForm.loyaltyUpdatesEnabled" binary input-id="loyaltyToggle" />
              <span>{{ t("profile.notifications.loyalty-updates") }}</span>
            </label>
            <label class="preference-row" for="remindersToggle">
              <pv-checkbox v-model="notificationForm.expeditionRemindersEnabled" binary input-id="remindersToggle" />
              <span>{{ t("profile.notifications.expedition-reminders") }}</span>
            </label>
          </div>
          <pv-button :label="t('common.save')" @click="saveNotificationPreferences" />
        </section>

        <section class="support-info-card preference-section">
          <h3>{{ t("profile.sections.privacy-preferences") }}</h3>
          <div class="preference-list">
            <label class="preference-row" for="visibilityToggle">
              <pv-checkbox v-model="privacyForm.profileVisibleToExpeditionMates" binary input-id="visibilityToggle" />
              <span>{{ t("profile.privacy.visible-to-expedition-mates") }}</span>
            </label>
          </div>
          <p class="support-meta preference-note">{{ t("profile.privacy.note") }}</p>
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
.preference-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preference-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 20px;
  margin: 14px 0 18px;
  align-items: start;
}

.preference-form-grid .field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preference-form-grid .field label {
  color: #cbd5e1;
  font-size: 0.82rem;
  font-weight: 600;
}

.preference-form-grid__full {
  grid-column: 1 / -1;
}

.preference-form-grid :deep(.p-inputtext),
.preference-form-grid :deep(.p-select) {
  width: 100%;
}

.preference-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 14px 0 18px;
}

.preference-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.35);
  color: #e2e8f0;
  font-size: 0.88rem;
  line-height: 1.4;
  cursor: pointer;
}

.preference-row--locked {
  cursor: default;
  opacity: 0.88;
}

.preference-row strong {
  font-weight: 600;
}

.preference-note {
  margin: 0 0 16px;
}

@media (max-width: 700px) {
  .preference-form-grid {
    grid-template-columns: 1fr;
  }

  .preference-form-grid__full {
    grid-column: auto;
  }
}
</style>
