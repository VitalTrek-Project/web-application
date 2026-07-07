export class LoyaltyProfile {
    constructor({
        touristId = null,
        agencyId = null,
        totalPoints = 0,
        currentTierId = null,
        currentTierName = null,
        nextTierName = null,
        pointsToNextTier = null
    }) {
        this.touristId = touristId;
        this.agencyId = agencyId;
        this.totalPoints = totalPoints;
        this.currentTierId = currentTierId;
        this.currentTierName = currentTierName;
        this.nextTierName = nextTierName;
        this.pointsToNextTier = pointsToNextTier;
    }
}
