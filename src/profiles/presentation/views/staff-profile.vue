<script setup>
import { onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useProfilesStore from "../../application/profiles.store.js";
import useIamStore from "../../../iam/application/iam.store.js";

const { t } = useI18n();
const store = useProfilesStore();
const { staffProfile, staffProfileLoading, staffPreferences, staffPreferencesLoading, errors } = storeToRefs(store);
const { fetchStaffProfile, updateStaffProfile, fetchStaffPreferences, updateStaffPreferences } = store;

const iamStore = useIamStore();
const agencyId = iamStore.currentAgencyId;
const staffUserId = iamStore.currentUserId;

const profileForm = reactive({ fullName: "", photoUrl: "", position: "", contactPhone: "" });
const preferencesForm = reactive({ pendingRedemptionsEnabled: true, newBookingsEnabled: true });

function syncProfileForm() {
  if (!staffProfile.value) return;
  profileForm.fullName = staffProfile.value.fullName ?? "";
  profileForm.photoUrl = staffProfile.value.photoUrl ?? "";
  profileForm.position = staffProfile.value.position ?? "";
  profileForm.contactPhone = staffProfile.value.contactPhone ?? "";
}

function syncPreferencesForm() {
  if (!staffPreferences.value) return;
  preferencesForm.pendingRedemptionsEnabled = staffPreferences.value.pendingRedemptionsEnabled;
  preferencesForm.newBookingsEnabled = staffPreferences.value.newBookingsEnabled;
}

watch(staffProfile, syncProfileForm);
watch(staffPreferences, syncPreferencesForm);

onMounted(() => {
  fetchStaffProfile(agencyId, staffUserId).then(syncProfileForm);
  fetchStaffPreferences(agencyId, staffUserId).then(syncPreferencesForm);
});

function saveProfile() {
  updateStaffProfile(agencyId, staffUserId, {
    fullName: profileForm.fullName,
    photoUrl: profileForm.photoUrl || null,
    position: profileForm.position || null,
    contactPhone: profileForm.contactPhone || null
  });
}

function savePreferences() {
  updateStaffPreferences(agencyId, staffUserId, {
    pendingRedemptionsEnabled: preferencesForm.pendingRedemptionsEnabled,
    newBookingsEnabled: preferencesForm.newBookingsEnabled
  });
}
</script>

<template>
  <section class="support-page">
    <div class="support-panel">
      <div class="loyalty-panel-body">
        <div class="support-card">
          <h2 class="support-section-title">{{ t("profile.staff.title") }}</h2>
          <p class="support-meta">{{ t("profile.staff.subtitle") }}</p>

          <pv-skeleton v-if="staffProfileLoading" width="100%" height="160px" />
          <section v-else class="support-info-card">
            <h3>{{ t("profile.sections.personal") }}</h3>
            <div class="p-fluid profile-form-grid">
              <div class="field">
                <label for="fullName">{{ t("profile.fields.fullName") }}</label>
                <pv-input-text id="fullName" v-model="profileForm.fullName" />
              </div>
              <div class="field">
                <label for="photoUrl">{{ t("profile.fields.photoUrl") }}</label>
                <pv-input-text id="photoUrl" v-model="profileForm.photoUrl" />
              </div>
              <div class="field">
                <label for="position">{{ t("profile.fields.position") }}</label>
                <pv-input-text id="position" v-model="profileForm.position" />
              </div>
              <div class="field">
                <label for="contactPhone">{{ t("profile.fields.contactPhone") }}</label>
                <pv-input-text id="contactPhone" v-model="profileForm.contactPhone" />
              </div>
            </div>
            <pv-button :label="t('common.save')" :disabled="!profileForm.fullName" @click="saveProfile" />
          </section>

          <pv-skeleton v-if="staffPreferencesLoading" width="100%" height="120px" />
          <section v-else class="support-info-card">
            <h3>{{ t("profile.sections.notification-preferences") }}</h3>
            <div class="preference-toggle">
              <pv-checkbox model-value disabled binary />
              <span>{{ t("profile.notifications.critical-always-on") }}</span>
            </div>
            <div class="preference-toggle">
              <pv-checkbox v-model="preferencesForm.pendingRedemptionsEnabled" binary input-id="redemptionsToggle" />
              <label for="redemptionsToggle">{{ t("profile.notifications.pending-redemptions") }}</label>
            </div>
            <div class="preference-toggle">
              <pv-checkbox v-model="preferencesForm.newBookingsEnabled" binary input-id="bookingsToggle" />
              <label for="bookingsToggle">{{ t("profile.notifications.new-bookings") }}</label>
            </div>
            <pv-button :label="t('common.save')" @click="savePreferences" />
          </section>

          <div v-if="errors.length" class="support-error">
            {{ t("errors.occurred") }}
          </div>
        </div>
      </div>
    </div>
  </section>
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
