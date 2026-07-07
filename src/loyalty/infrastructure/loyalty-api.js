import {BaseApi} from "../../shared/infrastructure/base-api.js";

const basePath = "/loyalty";
const notificationsPath = "/notifications";

/**
 * Infrastructure adapter for the Loyalty HTTP endpoints. Uses this.http directly
 * (not BaseEndpoint) since these are custom nested resource paths with mixed verbs
 * (POST for events/redemptions, PATCH for partial updates), same convention as
 * Dashboard's DashboardApi.
 *
 * @class LoyaltyApi
 * @extends BaseApi
 */
export class LoyaltyApi extends BaseApi {
    // Program & tiers
    getProgram(agencyId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/program`);
    }

    updateProgram(agencyId, payload) {
        return this.http.put(`${basePath}/agencies/${agencyId}/program`, payload);
    }

    getTiers(agencyId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tiers`);
    }

    createTier(agencyId, payload) {
        return this.http.post(`${basePath}/agencies/${agencyId}/tiers`, payload);
    }

    updateTier(agencyId, tierId, payload) {
        return this.http.put(`${basePath}/agencies/${agencyId}/tiers/${tierId}`, payload);
    }

    deleteTier(agencyId, tierId) {
        return this.http.delete(`${basePath}/agencies/${agencyId}/tiers/${tierId}`);
    }

    // Profile
    getProfile(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/profile`);
    }

    getTransactions(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/points-transactions`);
    }

    recordEvent(agencyId, touristId, payload) {
        return this.http.post(`${basePath}/agencies/${agencyId}/tourists/${touristId}/points-transactions`, payload);
    }

    getBadges(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/badges`);
    }

    getReferralCode(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/referral-code`);
    }

    submitReview(agencyId, touristId, payload) {
        return this.http.post(`${basePath}/agencies/${agencyId}/tourists/${touristId}/reviews`, payload);
    }

    // Rewards
    getRewards(agencyId, activeOnly) {
        return this.http.get(`${basePath}/agencies/${agencyId}/rewards`, {params: {activeOnly}});
    }

    createReward(agencyId, payload) {
        return this.http.post(`${basePath}/agencies/${agencyId}/rewards`, payload);
    }

    updateReward(agencyId, rewardId, payload) {
        return this.http.put(`${basePath}/agencies/${agencyId}/rewards/${rewardId}`, payload);
    }

    deactivateReward(agencyId, rewardId) {
        return this.http.delete(`${basePath}/agencies/${agencyId}/rewards/${rewardId}`);
    }

    // Redemptions
    getMyRedemptions(agencyId, touristId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/tourists/${touristId}/redemptions`);
    }

    redeemReward(agencyId, touristId, rewardId) {
        return this.http.post(`${basePath}/agencies/${agencyId}/tourists/${touristId}/redemptions`, {rewardId});
    }

    findRedemptionByCode(agencyId, code) {
        return this.http.get(`${basePath}/agencies/${agencyId}/redemptions`, {params: {code}});
    }

    markRedemptionUsed(agencyId, redemptionId) {
        return this.http.patch(`${basePath}/agencies/${agencyId}/redemptions/${redemptionId}`, {status: 'Used'});
    }

    // Referrals
    redeemReferralCode(agencyId, code, referredTouristId) {
        return this.http.post(`${basePath}/agencies/${agencyId}/referrals`, {code, referredTouristId});
    }

    // Badge catalog
    getBadgeCatalog(agencyId) {
        return this.http.get(`${basePath}/badges`, {params: {agencyId}});
    }

    // Metrics
    getMetrics(agencyId) {
        return this.http.get(`${basePath}/agencies/${agencyId}/metrics`);
    }

    // Notifications (own top-level route, not nested under /loyalty)
    getNotifications(touristId, unreadOnly) {
        return this.http.get(notificationsPath, {params: {touristId, unreadOnly}});
    }

    markNotificationRead(notificationId) {
        return this.http.patch(`${notificationsPath}/${notificationId}`);
    }
}
