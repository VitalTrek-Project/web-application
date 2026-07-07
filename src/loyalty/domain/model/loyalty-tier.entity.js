export class LoyaltyTier {
    constructor({id = null, name = '', minPoints = 0, benefits = '', sortOrder = 0}) {
        this.id = id;
        this.name = name;
        this.minPoints = minPoints;
        this.benefits = benefits;
        this.sortOrder = sortOrder;
    }
}
