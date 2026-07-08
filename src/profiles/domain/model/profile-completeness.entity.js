/**
 * Result of evaluating whether a tourist profile has enough information to join an expedition.
 *
 * @class ProfileCompleteness
 */
export class ProfileCompleteness {
    /**
     * @param {Object} params
     * @param {boolean} params.canJoinExpedition
     * @param {number} params.completionPercentage
     * @param {Array<string>} [params.missingFields]
     */
    constructor({canJoinExpedition, completionPercentage, missingFields = []}) {
        this.canJoinExpedition = canJoinExpedition;
        this.completionPercentage = completionPercentage;
        this.missingFields = missingFields;
    }
}
