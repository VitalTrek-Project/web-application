import {BaseApi} from "../../shared/infrastructure/base-api.js";

const basePath = "/profiles";

/**
 * Infrastructure adapter for the Profiles HTTP endpoints. Uses this.http directly
 * (not BaseEndpoint) since these are custom nested resource paths, same convention
 * as Loyalty's LoyaltyApi and Dashboard's DashboardApi.
 *
 * @class ProfilesApi
 * @extends BaseApi
 */
export class ProfilesApi extends BaseApi {
    // Tourist profile
    getTouristProfile(touristId) {
        return this.http.get(`${basePath}/tourists/${touristId}`);
    }

    updateTouristProfile(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}`, payload);
    }

    updateIdentityDocument(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/identity-document`, payload);
    }

    updateMedicalInfo(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/medical-info`, payload);
    }

    addEmergencyContact(touristId, payload) {
        return this.http.post(`${basePath}/tourists/${touristId}/emergency-contacts`, payload);
    }

    updateEmergencyContact(touristId, contactId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/emergency-contacts/${contactId}`, payload);
    }

    removeEmergencyContact(touristId, contactId) {
        return this.http.delete(`${basePath}/tourists/${touristId}/emergency-contacts/${contactId}`);
    }

    getCompleteness(touristId) {
        return this.http.get(`${basePath}/tourists/${touristId}/completeness`);
    }

    // Agency-authorized tourist profile read (audited)
    getTouristProfileForAgency(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}`);
    }

    getMedicalAccessLog(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/medical-access-log`);
    }

    // Tourist preferences
    getPreferences(touristId) {
        return this.http.get(`${basePath}/tourists/${touristId}/preferences`);
    }

    updateExpeditionPreferences(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/preferences/expedition`, payload);
    }

    updateNotificationPreferences(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/preferences/notifications`, payload);
    }

    updatePrivacyPreferences(touristId, payload) {
        return this.http.put(`${basePath}/tourists/${touristId}/preferences/privacy`, payload);
    }

    // Staff profile & preferences
    getStaffProfile(agencyId, staffUserId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/staff/${staffUserId}`);
    }

    updateStaffProfile(agencyId, staffUserId, payload) {
        return this.http.put(`${basePath}/agencies/${agencyId}/staff/${staffUserId}`, payload);
    }

    getStaffPreferences(agencyId, staffUserId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/staff/${staffUserId}/preferences`);
    }

    updateStaffPreferences(agencyId, staffUserId, payload) {
        return this.http.put(`${basePath}/agencies/${agencyId}/staff/${staffUserId}/preferences`, payload);
    }
}
