export class LoyaltyProgram {
    constructor({
        id = null,
        agencyId = null,
        pointsPerExpeditionCompleted = 0,
        pointsPerExpeditionBooked = 0,
        pointsPerReferral = 0,
        pointsPerReview = 0,
        expirationMonths = null
    }) {
        this.id = id;
        this.agencyId = agencyId;
        this.pointsPerExpeditionCompleted = pointsPerExpeditionCompleted;
        this.pointsPerExpeditionBooked = pointsPerExpeditionBooked;
        this.pointsPerReferral = pointsPerReferral;
        this.pointsPerReview = pointsPerReview;
        this.expirationMonths = expirationMonths;
    }
}
