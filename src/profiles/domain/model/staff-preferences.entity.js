/**
 * An agency staff member's notification preferences.
 *
 * @class StaffPreferences
 */
export class StaffPreferences {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.userId
     * @param {boolean} params.criticalAlertsEnabled
     * @param {boolean} params.pendingRedemptionsEnabled
     * @param {boolean} params.newBookingsEnabled
     */
    constructor({id, userId, criticalAlertsEnabled, pendingRedemptionsEnabled, newBookingsEnabled}) {
        this.id = id;
        this.userId = userId;
        this.criticalAlertsEnabled = criticalAlertsEnabled;
        this.pendingRedemptionsEnabled = pendingRedemptionsEnabled;
        this.newBookingsEnabled = newBookingsEnabled;
    }
}
