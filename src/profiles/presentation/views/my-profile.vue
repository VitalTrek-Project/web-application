<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useConfirm } from "primevue/useconfirm";
import useProfilesStore from "../../application/profiles.store.js";
import useIamStore from "../../../iam/application/iam.store.js";
import ProfilesPanel from "../components/profiles-panel.vue";
import CompletenessMeter from "../components/completeness-meter.vue";
import EmergencyContactForm from "../components/emergency-contact-form.vue";

const { t } = useI18n();
const confirm = useConfirm();
const store = useProfilesStore();
const { profile, profileLoading, completeness, errors } = storeToRefs(store);
const {
  fetchTouristProfile, updateTouristProfile, updateIdentityDocument, updateMedicalInfo,
  addEmergencyContact, updateEmergencyContact, removeEmergencyContact, fetchCompleteness
} = store;

const touristId = useIamStore().currentUserId;

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const documentTypes = ["Passport", "NationalId", "DriverLicense"];
const bloodTypes = ["Unknown", "APositive", "ANegative", "BPositive", "BNegative", "ABPositive", "ABNegative", "OPositive", "ONegative"];

const personalForm = reactive({
  fullName: "", photoUrl: "", dateOfBirth: null, nationality: "", phoneNumber: "",
  preferredLanguage: "", experienceLevel: "Beginner"
});

const documentForm = reactive({ type: "Passport", number: "" });

const medicalForm = reactive({ bloodType: "Unknown", allergies: "", medicalConditions: "", medications: "" });

const contactDialogVisible = ref(false);
const editingContact = ref(null);

function syncFormsFromProfile() {
  if (!profile.value) return;
  personalForm.fullName = profile.value.fullName ?? "";
  personalForm.photoUrl = profile.value.photoUrl ?? "";
  personalForm.dateOfBirth = profile.value.dateOfBirth ? new Date(profile.value.dateOfBirth) : null;
  personalForm.nationality = profile.value.nationality ?? "";
  personalForm.phoneNumber = profile.value.phoneNumber ?? "";
  personalForm.preferredLanguage = profile.value.preferredLanguage ?? "";
  personalForm.experienceLevel = profile.value.experienceLevel ?? "Beginner";

  documentForm.type = profile.value.identityDocumentType ?? "Passport";
  documentForm.number = profile.value.identityDocumentNumber ?? "";

  medicalForm.bloodType = profile.value.bloodType ?? "Unknown";
  medicalForm.allergies = profile.value.allergies ?? "";
  medicalForm.medicalConditions = profile.value.medicalConditions ?? "";
  medicalForm.medications = profile.value.medications ?? "";
}

watch(profile, syncFormsFromProfile);

onMounted(() => {
  fetchTouristProfile(touristId).then(syncFormsFromProfile);
  fetchCompleteness(touristId);
});

function savePersonalData() {
  updateTouristProfile(touristId, {
    fullName: personalForm.fullName,
    photoUrl: personalForm.photoUrl || null,
    dateOfBirth: personalForm.dateOfBirth ? personalForm.dateOfBirth.toISOString().slice(0, 10) : null,
    nationality: personalForm.nationality || null,
    phoneNumber: personalForm.phoneNumber || null,
    preferredLanguage: personalForm.preferredLanguage || null,
    experienceLevel: personalForm.experienceLevel
  }).then(() => fetchCompleteness(touristId));
}

function saveDocument() {
  updateIdentityDocument(touristId, { type: documentForm.type, number: documentForm.number })
      .then(() => fetchCompleteness(touristId));
}

function saveMedicalInfo() {
  updateMedicalInfo(touristId, {
    bloodType: medicalForm.bloodType === "Unknown" ? null : medicalForm.bloodType,
    allergies: medicalForm.allergies || null,
    medicalConditions: medicalForm.medicalConditions || null,
    medications: medicalForm.medications || null
  });
}

function openAddContact() {
  editingContact.value = null;
  contactDialogVisible.value = true;
}

function openEditContact(contact) {
  editingContact.value = contact;
  contactDialogVisible.value = true;
}

function saveContact(payload) {
  const promise = editingContact.value
      ? updateEmergencyContact(touristId, editingContact.value.id, payload)
      : addEmergencyContact(touristId, payload);
  promise.then(() => fetchCompleteness(touristId));
}

function confirmRemoveContact(contact) {
  confirm.require({
    message: t("profile.emergency-contact.confirm-remove", { name: contact.name }),
    header: t("common.confirm"),
    accept: () => removeEmergencyContact(touristId, contact.id).then(() => fetchCompleteness(touristId))
  });
}

const emergencyContacts = computed(() => profile.value?.emergencyContacts ?? []);
</script>

<template>
  <ProfilesPanel>
    <div class="support-card">
      <h2 class="support-section-title">{{ t("profile.my-profile.title") }}</h2>
      <p class="support-meta">{{ t("profile.my-profile.subtitle") }}</p>

      <pv-skeleton v-if="profileLoading" width="100%" height="200px" />

      <template v-else>
        <CompletenessMeter :completeness="completeness" />

        <section class="support-info-card">
          <h3>{{ t("profile.sections.personal") }}</h3>
          <div class="p-fluid profile-form-grid">
            <div class="field">
              <label for="fullName">{{ t("profile.fields.fullName") }}</label>
              <pv-input-text id="fullName" v-model="personalForm.fullName" />
            </div>
            <div class="field">
              <label for="photoUrl">{{ t("profile.fields.photoUrl") }}</label>
              <pv-input-text id="photoUrl" v-model="personalForm.photoUrl" :placeholder="t('profile.fields.photoUrl-placeholder')" />
            </div>
            <div class="field">
              <label for="dateOfBirth">{{ t("profile.fields.dateOfBirth") }}</label>
              <pv-date-picker id="dateOfBirth" v-model="personalForm.dateOfBirth" date-format="yy-mm-dd" show-icon />
            </div>
            <div class="field">
              <label for="nationality">{{ t("profile.fields.nationality") }}</label>
              <pv-input-text id="nationality" v-model="personalForm.nationality" />
            </div>
            <div class="field">
              <label for="phoneNumber">{{ t("profile.fields.phoneNumber") }}</label>
              <pv-input-text id="phoneNumber" v-model="personalForm.phoneNumber" />
            </div>
            <div class="field">
              <label for="preferredLanguage">{{ t("profile.fields.preferredLanguage") }}</label>
              <pv-input-text id="preferredLanguage" v-model="personalForm.preferredLanguage" :placeholder="t('profile.fields.preferredLanguage-placeholder')" />
            </div>
            <div class="field">
              <label for="experienceLevel">{{ t("profile.fields.experienceLevel") }}</label>
              <pv-select id="experienceLevel" v-model="personalForm.experienceLevel" :options="experienceLevels">
                <template #option="{ option }">{{ t(`profile.experience-levels.${option}`) }}</template>
                <template #value="{ value }">{{ t(`profile.experience-levels.${value}`) }}</template>
              </pv-select>
            </div>
          </div>
          <pv-button :label="t('common.save')" :disabled="!personalForm.fullName" @click="savePersonalData" />
        </section>

        <section class="support-info-card">
          <h3>{{ t("profile.sections.document") }}</h3>
          <p class="support-meta">{{ t("profile.sections.document-note") }}</p>
          <div class="p-fluid profile-form-grid">
            <div class="field">
              <label for="documentType">{{ t("profile.fields.documentType") }}</label>
              <pv-select id="documentType" v-model="documentForm.type" :options="documentTypes">
                <template #option="{ option }">{{ t(`profile.document-types.${option}`) }}</template>
                <template #value="{ value }">{{ t(`profile.document-types.${value}`) }}</template>
              </pv-select>
            </div>
            <div class="field">
              <label for="documentNumber">{{ t("profile.fields.documentNumber") }}</label>
              <pv-input-text id="documentNumber" v-model="documentForm.number" />
            </div>
          </div>
          <pv-button :label="t('common.save')" :disabled="!documentForm.number" @click="saveDocument" />
        </section>

        <section class="support-info-card">
          <h3>{{ t("profile.sections.emergency-contacts") }}</h3>
          <p class="support-meta">{{ t("profile.sections.emergency-contacts-note") }}</p>
          <ul v-if="emergencyContacts.length" class="emergency-contact-list">
            <li v-for="contact in emergencyContacts" :key="contact.id" class="emergency-contact-item">
              <div>
                <strong>{{ contact.name }}</strong>
                <span class="emergency-contact-relationship">{{ contact.relationship }}</span>
                <span class="emergency-contact-phone">{{ contact.phoneNumber }}</span>
              </div>
              <div class="emergency-contact-actions">
                <pv-button text size="small" icon="pi pi-pencil" @click="openEditContact(contact)" />
                <pv-button text size="small" severity="danger" icon="pi pi-trash" @click="confirmRemoveContact(contact)" />
              </div>
            </li>
          </ul>
          <p v-else class="loyalty-empty-text">{{ t("profile.emergency-contact.none") }}</p>
          <pv-button text :label="t('profile.emergency-contact.add')" icon="pi pi-plus" @click="openAddContact" />
        </section>

        <section class="support-info-card medical-card">
          <h3>{{ t("profile.sections.medical") }}</h3>
          <p class="support-meta medical-disclaimer">{{ t("profile.sections.medical-note") }}</p>
          <div class="p-fluid profile-form-grid">
            <div class="field">
              <label for="bloodType">{{ t("profile.fields.bloodType") }}</label>
              <pv-select id="bloodType" v-model="medicalForm.bloodType" :options="bloodTypes">
                <template #option="{ option }">{{ t(`profile.blood-types.${option}`) }}</template>
                <template #value="{ value }">{{ t(`profile.blood-types.${value}`) }}</template>
              </pv-select>
            </div>
            <div class="field">
              <label for="allergies">{{ t("profile.fields.allergies") }}</label>
              <pv-textarea id="allergies" v-model="medicalForm.allergies" rows="2" />
            </div>
            <div class="field">
              <label for="medicalConditions">{{ t("profile.fields.medicalConditions") }}</label>
              <pv-textarea id="medicalConditions" v-model="medicalForm.medicalConditions" rows="2" />
            </div>
            <div class="field">
              <label for="medications">{{ t("profile.fields.medications") }}</label>
              <pv-textarea id="medications" v-model="medicalForm.medications" rows="2" />
            </div>
          </div>
          <pv-button :label="t('common.save')" @click="saveMedicalInfo" />
        </section>

        <div v-if="errors.length" class="support-error">
          {{ t("errors.occurred") }}
        </div>
      </template>
    </div>

    <EmergencyContactForm v-model:visible="contactDialogVisible" :contact="editingContact" @save="saveContact" />
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

.medical-card {
  border-color: rgba(250, 204, 21, 0.25);
}

.medical-disclaimer {
  color: #fbbf24;
}

.emergency-contact-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emergency-contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.emergency-contact-item:last-child {
  border-bottom: none;
}

.emergency-contact-item strong {
  color: #f1f5f9;
  font-size: 0.85rem;
  margin-right: 8px;
}

.emergency-contact-relationship,
.emergency-contact-phone {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-right: 10px;
}

.emergency-contact-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
