import {defineStore} from "pinia";
import {ref} from "vue";
import {ProfilesApi} from "../infrastructure/profiles-api.js";
import {
    MedicalAccessLogEntryAssembler,
    ProfileCompletenessAssembler,
    TouristProfileAssembler
} from "../infrastructure/tourist-profile.assembler.js";
import {TouristPreferencesAssembler} from "../infrastructure/tourist-preferences.assembler.js";
import {StaffPreferencesAssembler, StaffProfileAssembler} from "../infrastructure/staff.assembler.js";

const profilesApi = new ProfilesApi();

/**
 * Reactive store exposing Profiles commands and queries — personal/travel/health data and
 * preferences for tourists, and profile/preferences for agency staff. Kept separate from
 * iam.store.js: IAM owns identity/auth, Profiles owns everything about "who this person is".
 *
 * @returns {Object} Reactive Profiles state and use-case actions.
 */
const useProfilesStore = defineStore('profiles', () => {
    const errors = ref([]);

    const profile = ref(null);
    const profileLoading = ref(false);
    const profileLoaded = ref(false);

    const completeness = ref(null);
    const completenessLoading = ref(false);

    const preferences = ref(null);
    const preferencesLoading = ref(false);
    const preferencesLoaded = ref(false);

    const medicalAccessLog = ref([]);
    const medicalAccessLogLoading = ref(false);

    const staffProfile = ref(null);
    const staffProfileLoading = ref(false);
    const staffProfileLoaded = ref(false);

    const staffPreferences = ref(null);
    const staffPreferencesLoading = ref(false);
    const staffPreferencesLoaded = ref(false);

    function fetchTouristProfile(touristId) {
        profileLoading.value = true;
        errors.value = [];
        return profilesApi.getTouristProfile(touristId).then(response => {
            profile.value = TouristProfileAssembler.toEntityFromResource(response.data);
            profileLoaded.value = true;
        }).catch(error => {
            if (error?.status === 404) {
                profile.value = null;
                profileLoaded.value = true;
                return;
            }
            errors.value.push(error);
        }).finally(() => { profileLoading.value = false; });
    }

    function updateTouristProfile(touristId, payload) {
        return profilesApi.updateTouristProfile(touristId, payload).then(response => {
            profile.value = TouristProfileAssembler.toEntityFromResource(response.data);
            return profile.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function updateIdentityDocument(touristId, payload) {
        return profilesApi.updateIdentityDocument(touristId, payload).then(response => {
            profile.value = TouristProfileAssembler.toEntityFromResource(response.data);
            return profile.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function updateMedicalInfo(touristId, payload) {
        return profilesApi.updateMedicalInfo(touristId, payload).then(response => {
            profile.value = TouristProfileAssembler.toEntityFromResource(response.data);
            return profile.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function addEmergencyContact(touristId, payload) {
        return profilesApi.addEmergencyContact(touristId, payload).then(() => fetchTouristProfile(touristId))
            .catch(error => { errors.value.push(error); throw error; });
    }

    function updateEmergencyContact(touristId, contactId, payload) {
        return profilesApi.updateEmergencyContact(touristId, contactId, payload).then(() => fetchTouristProfile(touristId))
            .catch(error => { errors.value.push(error); throw error; });
    }

    function removeEmergencyContact(touristId, contactId) {
        return profilesApi.removeEmergencyContact(touristId, contactId).then(() => fetchTouristProfile(touristId))
            .catch(error => { errors.value.push(error); throw error; });
    }

    function fetchCompleteness(touristId) {
        completenessLoading.value = true;
        return profilesApi.getCompleteness(touristId).then(response => {
            completeness.value = ProfileCompletenessAssembler.toEntityFromResource(response.data);
        }).catch(error => errors.value.push(error))
            .finally(() => { completenessLoading.value = false; });
    }

    function fetchTouristProfileForAgency(agencyId, touristId) {
        profileLoading.value = true;
        errors.value = [];
        return profilesApi.getTouristProfileForAgency(agencyId, touristId).then(response => {
            profile.value = TouristProfileAssembler.toEntityFromResource(response.data);
            profileLoaded.value = true;
        }).catch(error => { errors.value.push(error); throw error; })
            .finally(() => { profileLoading.value = false; });
    }

    function fetchMedicalAccessLog(agencyId, touristId) {
        medicalAccessLogLoading.value = true;
        return profilesApi.getMedicalAccessLog(agencyId, touristId).then(response => {
            medicalAccessLog.value = MedicalAccessLogEntryAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { medicalAccessLogLoading.value = false; });
    }

    function fetchPreferences(touristId) {
        preferencesLoading.value = true;
        errors.value = [];
        return profilesApi.getPreferences(touristId).then(response => {
            preferences.value = TouristPreferencesAssembler.toEntityFromResource(response.data);
            preferencesLoaded.value = true;
        }).catch(error => {
            if (error?.status === 404) {
                preferences.value = null;
                preferencesLoaded.value = true;
                return;
            }
            errors.value.push(error);
        }).finally(() => { preferencesLoading.value = false; });
    }

    function updateExpeditionPreferences(touristId, payload) {
        return profilesApi.updateExpeditionPreferences(touristId, payload).then(response => {
            preferences.value = TouristPreferencesAssembler.toEntityFromResource(response.data);
            return preferences.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function updateNotificationPreferences(touristId, payload) {
        return profilesApi.updateNotificationPreferences(touristId, payload).then(response => {
            preferences.value = TouristPreferencesAssembler.toEntityFromResource(response.data);
            return preferences.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function updatePrivacyPreferences(touristId, payload) {
        return profilesApi.updatePrivacyPreferences(touristId, payload).then(response => {
            preferences.value = TouristPreferencesAssembler.toEntityFromResource(response.data);
            return preferences.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function fetchStaffProfile(agencyId, staffUserId) {
        staffProfileLoading.value = true;
        errors.value = [];
        return profilesApi.getStaffProfile(agencyId, staffUserId).then(response => {
            staffProfile.value = StaffProfileAssembler.toEntityFromResource(response.data);
            staffProfileLoaded.value = true;
        }).catch(error => {
            if (error?.status === 404) {
                staffProfile.value = null;
                staffProfileLoaded.value = true;
                return;
            }
            errors.value.push(error);
        }).finally(() => { staffProfileLoading.value = false; });
    }

    function updateStaffProfile(agencyId, staffUserId, payload) {
        return profilesApi.updateStaffProfile(agencyId, staffUserId, payload).then(response => {
            staffProfile.value = StaffProfileAssembler.toEntityFromResource(response.data);
            return staffProfile.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    function fetchStaffPreferences(agencyId, staffUserId) {
        staffPreferencesLoading.value = true;
        return profilesApi.getStaffPreferences(agencyId, staffUserId).then(response => {
            staffPreferences.value = StaffPreferencesAssembler.toEntityFromResource(response.data);
            staffPreferencesLoaded.value = true;
        }).catch(error => {
            if (error?.status === 404) {
                staffPreferences.value = null;
                staffPreferencesLoaded.value = true;
                return;
            }
            errors.value.push(error);
        }).finally(() => { staffPreferencesLoading.value = false; });
    }

    function updateStaffPreferences(agencyId, staffUserId, payload) {
        return profilesApi.updateStaffPreferences(agencyId, staffUserId, payload).then(response => {
            staffPreferences.value = StaffPreferencesAssembler.toEntityFromResource(response.data);
            return staffPreferences.value;
        }).catch(error => { errors.value.push(error); throw error; });
    }

    return {
        errors,
        profile, profileLoading, profileLoaded,
        completeness, completenessLoading,
        preferences, preferencesLoading, preferencesLoaded,
        medicalAccessLog, medicalAccessLogLoading,
        staffProfile, staffProfileLoading, staffProfileLoaded,
        staffPreferences, staffPreferencesLoading, staffPreferencesLoaded,
        fetchTouristProfile, updateTouristProfile, updateIdentityDocument, updateMedicalInfo,
        addEmergencyContact, updateEmergencyContact, removeEmergencyContact,
        fetchCompleteness, fetchTouristProfileForAgency, fetchMedicalAccessLog,
        fetchPreferences, updateExpeditionPreferences, updateNotificationPreferences, updatePrivacyPreferences,
        fetchStaffProfile, updateStaffProfile, fetchStaffPreferences, updateStaffPreferences
    };
});

export default useProfilesStore;
