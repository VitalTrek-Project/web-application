import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {LoyaltyApi} from "../infrastructure/loyalty-api.js";
import {LoyaltyProgramAssembler, LoyaltyTierAssembler} from "../infrastructure/program.assembler.js";
import {
    AwardedBadgeAssembler,
    LoyaltyProfileAssembler,
    PointsTransactionAssembler,
    ReferralAssembler
} from "../infrastructure/profile.assembler.js";
import {RewardAssembler} from "../infrastructure/reward.assembler.js";
import {RedemptionAssembler} from "../infrastructure/redemption.assembler.js";
import {BadgeDefinitionAssembler} from "../infrastructure/badge.assembler.js";
import {NotificationAssembler} from "../infrastructure/notification.assembler.js";
import {LoyaltyMetricsAssembler} from "../infrastructure/metrics.assembler.js";

const loyaltyApi = new LoyaltyApi();

/**
 * Reactive store exposing Loyalty commands and queries. One store for the whole
 * bounded context, same scaling pattern as monitoring.store.js (signs + alerts +
 * tourists + incidents + locations all in one store).
 *
 * @returns {Object} Reactive Loyalty state and use-case actions.
 */
const useLoyaltyStore = defineStore('loyalty', () => {
    const errors = ref([]);

    const program = ref(null);
    const programLoading = ref(false);

    const tiers = ref([]);
    const tiersLoading = ref(false);
    const tiersLoaded = ref(false);

    const profile = ref(null);
    const profileLoading = ref(false);

    const transactions = ref([]);
    const transactionsLoading = ref(false);

    const badges = ref([]);
    const badgesLoading = ref(false);

    const referralCode = ref('');
    const referralCodeLoading = ref(false);

    const rewards = ref([]);
    const rewardsLoading = ref(false);

    const myRedemptions = ref([]);
    const myRedemptionsLoading = ref(false);

    const foundRedemption = ref(null);
    const foundRedemptionLoading = ref(false);

    const badgeCatalog = ref([]);
    const badgeCatalogLoading = ref(false);
    const badgeCatalogLoaded = ref(false);

    const metrics = ref(null);
    const metricsLoading = ref(false);

    const notifications = ref([]);
    const notificationsLoading = ref(false);
    const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

    function fetchProgram(agencyId) {
        programLoading.value = true;
        errors.value = [];
        return loyaltyApi.getProgram(agencyId).then(response => {
            program.value = LoyaltyProgramAssembler.toEntityFromResource(response.data);
        }).catch(error => errors.value.push(error))
            .finally(() => { programLoading.value = false; });
    }

    function updateProgram(agencyId, payload) {
        return loyaltyApi.updateProgram(agencyId, payload).then(response => {
            program.value = LoyaltyProgramAssembler.toEntityFromResource(response.data);
            return program.value;
        }).catch(error => errors.value.push(error));
    }

    function fetchTiers(agencyId, force = false) {
        if (!force && tiersLoaded.value) return Promise.resolve(tiers.value);
        tiersLoading.value = true;
        errors.value = [];
        return loyaltyApi.getTiers(agencyId).then(response => {
            tiers.value = LoyaltyTierAssembler.toEntitiesFromResponse(response);
            tiersLoaded.value = true;
        }).catch(error => errors.value.push(error))
            .finally(() => { tiersLoading.value = false; });
    }

    function createTier(agencyId, payload) {
        return loyaltyApi.createTier(agencyId, payload).then(response => {
            tiers.value.push(LoyaltyTierAssembler.toEntityFromResource(response.data));
        }).catch(error => errors.value.push(error));
    }

    function updateTier(agencyId, tierId, payload) {
        return loyaltyApi.updateTier(agencyId, tierId, payload).then(response => {
            const updated = LoyaltyTierAssembler.toEntityFromResource(response.data);
            const index = tiers.value.findIndex(t => t.id === updated.id);
            if (index !== -1) tiers.value[index] = updated;
        }).catch(error => errors.value.push(error));
    }

    function deleteTier(agencyId, tierId) {
        return loyaltyApi.deleteTier(agencyId, tierId).then(() => {
            tiers.value = tiers.value.filter(t => t.id !== tierId);
        }).catch(error => errors.value.push(error));
    }

    function fetchProfile(agencyId, touristId) {
        profileLoading.value = true;
        errors.value = [];
        return loyaltyApi.getProfile(agencyId, touristId).then(response => {
            profile.value = LoyaltyProfileAssembler.toEntityFromResource(response.data);
        }).catch(error => errors.value.push(error))
            .finally(() => { profileLoading.value = false; });
    }

    function fetchTransactions(agencyId, touristId) {
        transactionsLoading.value = true;
        errors.value = [];
        return loyaltyApi.getTransactions(agencyId, touristId).then(response => {
            transactions.value = PointsTransactionAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { transactionsLoading.value = false; });
    }

    function recordEvent(agencyId, touristId, type, sourceId) {
        errors.value = [];
        return loyaltyApi.recordEvent(agencyId, touristId, {type, sourceId})
            .then(response => PointsTransactionAssembler.toEntityFromResource(response.data))
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchBadges(agencyId, touristId) {
        badgesLoading.value = true;
        errors.value = [];
        return loyaltyApi.getBadges(agencyId, touristId).then(response => {
            badges.value = AwardedBadgeAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { badgesLoading.value = false; });
    }

    function fetchReferralCode(agencyId, touristId) {
        referralCodeLoading.value = true;
        errors.value = [];
        return loyaltyApi.getReferralCode(agencyId, touristId).then(response => {
            referralCode.value = response.data.code;
        }).catch(error => errors.value.push(error))
            .finally(() => { referralCodeLoading.value = false; });
    }

    function submitReview(agencyId, touristId, expeditionId, rating, comment) {
        errors.value = [];
        return loyaltyApi.submitReview(agencyId, touristId, {expeditionId, rating, comment})
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchRewards(agencyId, activeOnly, force = false) {
        if (!force && rewards.value.length && !rewardsLoading.value) return Promise.resolve(rewards.value);
        rewardsLoading.value = true;
        errors.value = [];
        return loyaltyApi.getRewards(agencyId, activeOnly).then(response => {
            rewards.value = RewardAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { rewardsLoading.value = false; });
    }

    function createReward(agencyId, payload) {
        return loyaltyApi.createReward(agencyId, payload).then(response => {
            rewards.value.push(RewardAssembler.toEntityFromResource(response.data));
        }).catch(error => errors.value.push(error));
    }

    function updateReward(agencyId, rewardId, payload) {
        return loyaltyApi.updateReward(agencyId, rewardId, payload).then(response => {
            const updated = RewardAssembler.toEntityFromResource(response.data);
            const index = rewards.value.findIndex(r => r.id === updated.id);
            if (index !== -1) rewards.value[index] = updated;
        }).catch(error => errors.value.push(error));
    }

    function deactivateReward(agencyId, rewardId) {
        return loyaltyApi.deactivateReward(agencyId, rewardId).then(() => {
            const index = rewards.value.findIndex(r => r.id === rewardId);
            if (index !== -1) rewards.value[index].isActive = false;
        }).catch(error => errors.value.push(error));
    }

    function fetchMyRedemptions(agencyId, touristId) {
        myRedemptionsLoading.value = true;
        errors.value = [];
        return loyaltyApi.getMyRedemptions(agencyId, touristId).then(response => {
            myRedemptions.value = RedemptionAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { myRedemptionsLoading.value = false; });
    }

    function redeemReward(agencyId, touristId, rewardId) {
        errors.value = [];
        return loyaltyApi.redeemReward(agencyId, touristId, rewardId)
            .then(response => {
                const redemption = RedemptionAssembler.toEntityFromResource(response.data);
                myRedemptions.value.unshift(redemption);
                return redemption;
            })
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function findRedemptionByCode(agencyId, code) {
        foundRedemptionLoading.value = true;
        foundRedemption.value = null;
        errors.value = [];
        return loyaltyApi.findRedemptionByCode(agencyId, code).then(response => {
            foundRedemption.value = RedemptionAssembler.toEntityFromResource(response.data);
        }).catch(error => errors.value.push(error))
            .finally(() => { foundRedemptionLoading.value = false; });
    }

    function markRedemptionUsed(agencyId, redemptionId) {
        return loyaltyApi.markRedemptionUsed(agencyId, redemptionId).then(response => {
            const updated = RedemptionAssembler.toEntityFromResource(response.data);
            if (foundRedemption.value?.id === updated.id) foundRedemption.value = updated;
            return updated;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function redeemReferralCode(agencyId, code, referredTouristId) {
        errors.value = [];
        return loyaltyApi.redeemReferralCode(agencyId, code, referredTouristId)
            .then(response => ReferralAssembler.toEntityFromResource(response.data))
            .catch(error => {
                errors.value.push(error);
                throw error;
            });
    }

    function fetchBadgeCatalog(agencyId, force = false) {
        if (!force && badgeCatalogLoaded.value) return Promise.resolve(badgeCatalog.value);
        badgeCatalogLoading.value = true;
        errors.value = [];
        return loyaltyApi.getBadgeCatalog(agencyId).then(response => {
            badgeCatalog.value = BadgeDefinitionAssembler.toEntitiesFromResponse(response);
            badgeCatalogLoaded.value = true;
        }).catch(error => errors.value.push(error))
            .finally(() => { badgeCatalogLoading.value = false; });
    }

    function fetchMetrics(agencyId) {
        metricsLoading.value = true;
        errors.value = [];
        return loyaltyApi.getMetrics(agencyId).then(response => {
            metrics.value = LoyaltyMetricsAssembler.toEntityFromResource(response.data);
        }).catch(error => errors.value.push(error))
            .finally(() => { metricsLoading.value = false; });
    }

    function fetchNotifications(touristId, unreadOnly) {
        notificationsLoading.value = true;
        errors.value = [];
        return loyaltyApi.getNotifications(touristId, unreadOnly).then(response => {
            notifications.value = NotificationAssembler.toEntitiesFromResponse(response);
        }).catch(error => errors.value.push(error))
            .finally(() => { notificationsLoading.value = false; });
    }

    function markNotificationRead(notificationId) {
        return loyaltyApi.markNotificationRead(notificationId).then(() => {
            const notification = notifications.value.find(n => n.id === notificationId);
            if (notification) notification.isRead = true;
        }).catch(error => errors.value.push(error));
    }

    return {
        errors,
        program, programLoading, fetchProgram, updateProgram,
        tiers, tiersLoading, tiersLoaded, fetchTiers, createTier, updateTier, deleteTier,
        profile, profileLoading, fetchProfile,
        transactions, transactionsLoading, fetchTransactions, recordEvent,
        badges, badgesLoading, fetchBadges,
        referralCode, referralCodeLoading, fetchReferralCode,
        submitReview,
        rewards, rewardsLoading, fetchRewards, createReward, updateReward, deactivateReward,
        myRedemptions, myRedemptionsLoading, fetchMyRedemptions, redeemReward,
        foundRedemption, foundRedemptionLoading, findRedemptionByCode, markRedemptionUsed,
        redeemReferralCode,
        badgeCatalog, badgeCatalogLoading, badgeCatalogLoaded, fetchBadgeCatalog,
        metrics, metricsLoading, fetchMetrics,
        notifications, notificationsLoading, unreadCount, fetchNotifications, markNotificationRead
    };
});

export default useLoyaltyStore;
