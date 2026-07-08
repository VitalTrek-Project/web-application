/**
 * Domain entity for a VitalTrek Platform subscription.
 */
export class Subscription {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string|null} params.plan
     * @param {string|null} params.status
     * @param {string|null} params.startDate
     * @param {string|null} params.endDate
     */
    constructor({id, plan = null, status = null, startDate = null, endDate = null}) {
        this.id = id;
        this.plan = plan;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
