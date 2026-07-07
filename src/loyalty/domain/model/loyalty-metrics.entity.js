export class LoyaltyMetrics {
    constructor({
        pointsIssued = 0,
        pointsRedeemed = 0,
        enrolledTourists = 0,
        touristsPerTier = [],
        topTourists = []
    }) {
        this.pointsIssued = pointsIssued;
        this.pointsRedeemed = pointsRedeemed;
        this.enrolledTourists = enrolledTourists;
        this.touristsPerTier = touristsPerTier;
        this.topTourists = topTourists;
    }
}
