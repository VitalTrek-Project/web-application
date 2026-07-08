<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import useProfilesStore from "../../application/profiles.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import { formatProfileDate } from "../utils/profile-presenter.js";

const { t } = useI18n();
const route = useRoute();
const store = useProfilesStore();
const { profile, profileLoading, medicalAccessLog, medicalAccessLogLoading, errors } = storeToRefs(store);
const { fetchTouristProfileForAgency, fetchMedicalAccessLog } = store;

const agencyId = useIamStore().currentAgencyId;
const touristId = route.params.touristId;

onMounted(() => {
  fetchTouristProfileForAgency(agencyId, touristId);
  fetchMedicalAccessLog(agencyId, touristId);
});
</script>

<template>
  <section class="support-page">
    <div class="support-panel">
      <div class="loyalty-panel-body">
        <div class="support-card">
          <h2 class="support-section-title">{{ t("profile.viewer.title") }}</h2>
          <p class="support-meta">{{ t("profile.viewer.subtitle") }}</p>

          <pv-skeleton v-if="profileLoading" width="100%" height="240px" />

          <div v-else-if="errors.length" class="support-error">
            {{ t("profile.viewer.forbidden") }}
          </div>

          <template v-else-if="profile">
            <section class="support-info-card">
              <h3>{{ t("profile.sections.personal") }}</h3>
              <dl class="viewer-grid">
                <dt>{{ t("profile.fields.fullName") }}</dt><dd>{{ profile.fullName }}</dd>
                <dt>{{ t("profile.fields.dateOfBirth") }}</dt><dd>{{ profile.dateOfBirth || "—" }}</dd>
                <dt>{{ t("profile.fields.nationality") }}</dt><dd>{{ profile.nationality || "—" }}</dd>
                <dt>{{ t("profile.fields.phoneNumber") }}</dt><dd>{{ profile.phoneNumber || "—" }}</dd>
                <dt>{{ t("profile.fields.experienceLevel") }}</dt><dd>{{ t(`profile.experience-levels.${profile.experienceLevel}`) }}</dd>
                <dt>{{ t("profile.fields.documentType") }}</dt>
                <dd>{{ profile.identityDocumentType ? t(`profile.document-types.${profile.identityDocumentType}`) : "—" }}</dd>
                <dt>{{ t("profile.fields.documentNumber") }}</dt><dd>{{ profile.identityDocumentNumber || "—" }}</dd>
              </dl>
            </section>

            <section class="support-info-card">
              <h3>{{ t("profile.sections.emergency-contacts") }}</h3>
              <ul v-if="profile.emergencyContacts.length" class="emergency-contact-list">
                <li v-for="contact in profile.emergencyContacts" :key="contact.id" class="emergency-contact-item">
                  <strong>{{ contact.name }}</strong>
                  <span>{{ contact.relationship }}</span>
                  <span>{{ contact.phoneNumber }}</span>
                </li>
              </ul>
              <p v-else class="loyalty-empty-text">{{ t("profile.emergency-contact.none") }}</p>
            </section>

            <section class="support-info-card medical-card">
              <h3>{{ t("profile.sections.medical") }}</h3>
              <dl class="viewer-grid">
                <dt>{{ t("profile.fields.bloodType") }}</dt>
                <dd>{{ profile.bloodType ? t(`profile.blood-types.${profile.bloodType}`) : "—" }}</dd>
                <dt>{{ t("profile.fields.allergies") }}</dt><dd>{{ profile.allergies || "—" }}</dd>
                <dt>{{ t("profile.fields.medicalConditions") }}</dt><dd>{{ profile.medicalConditions || "—" }}</dd>
                <dt>{{ t("profile.fields.medications") }}</dt><dd>{{ profile.medications || "—" }}</dd>
              </dl>
            </section>

            <section class="support-info-card">
              <h3>{{ t("profile.viewer.access-log-title") }}</h3>
              <p class="support-meta">{{ t("profile.viewer.access-log-note") }}</p>
              <pv-skeleton v-if="medicalAccessLogLoading" width="100%" height="60px" />
              <p v-else-if="!medicalAccessLog.length" class="loyalty-empty-text">{{ t("profile.viewer.access-log-empty") }}</p>
              <ul v-else class="access-log-list">
                <li v-for="entry in medicalAccessLog" :key="entry.id" class="access-log-item">
                  <span>{{ entry.accessedByStaffUserId }}</span>
                  <span>{{ formatProfileDate(entry.accessedAt) }}</span>
                </li>
              </ul>
            </section>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.viewer-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 16px;
  margin: 0;
}

.viewer-grid dt {
  color: #94a3b8;
  font-size: 0.78rem;
}

.viewer-grid dd {
  margin: 0;
  color: #f1f5f9;
  font-size: 0.85rem;
}

.medical-card {
  border-color: rgba(250, 204, 21, 0.25);
}

.emergency-contact-list,
.access-log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emergency-contact-item,
.access-log-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  font-size: 0.82rem;
  color: #e2e8f0;
}

.emergency-contact-item strong {
  color: #f1f5f9;
}
</style>
