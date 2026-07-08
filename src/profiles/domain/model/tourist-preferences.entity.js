/**
 * A tourist's expedition, notification and privacy preferences.
 *
 * @class TouristPreferences
 */
export class TouristPreferences {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.userId
     * @param {Array<string>} [params.preferredActivityTypes]
     * @param {string|null} [params.preferredDifficulty]
     * @param {Array<string>} [params.dietaryRestrictions]
     * @param {boolean} params.safetyAlertsEnabled
     * @param {boolean} params.loyaltyUpdatesEnabled
     * @param {boolean} params.expeditionRemindersEnabled
     * @param {boolean} params.profileVisibleToExpeditionMates
     */
    constructor({
        id, userId, preferredActivityTypes = [], preferredDifficulty = null, dietaryRestrictions = [],
        safetyAlertsEnabled, loyaltyUpdatesEnabled, expeditionRemindersEnabled, profileVisibleToExpeditionMates
    }) {
        this.id = id;
        this.userId = userId;
        this.preferredActivityTypes = preferredActivityTypes;
        this.preferredDifficulty = preferredDifficulty;
        this.dietaryRestrictions = dietaryRestrictions;
        this.safetyAlertsEnabled = safetyAlertsEnabled;
        this.loyaltyUpdatesEnabled = loyaltyUpdatesEnabled;
        this.expeditionRemindersEnabled = expeditionRemindersEnabled;
        this.profileVisibleToExpeditionMates = profileVisibleToExpeditionMates;
    }
}
