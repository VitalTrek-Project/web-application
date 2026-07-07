export class Redemption {
    constructor({
        id = null,
        touristId = null,
        rewardId = null,
        pointsSpent = 0,
        code = '',
        status = '',
        createdAt = '',
        usedAt = null,
        expiresAt = null
    }) {
        this.id = id;
        this.touristId = touristId;
        this.rewardId = rewardId;
        this.pointsSpent = pointsSpent;
        this.code = code;
        this.status = status;
        this.createdAt = createdAt;
        this.usedAt = usedAt;
        this.expiresAt = expiresAt;
    }
}
