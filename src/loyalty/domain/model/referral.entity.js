export class Referral {
    constructor({id = null, status = '', createdAt = '', completedAt = null}) {
        this.id = id;
        this.status = status;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }
}
