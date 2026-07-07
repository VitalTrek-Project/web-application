export class PointsTransaction {
    constructor({id = null, type = '', points = 0, sourceId = null, description = '', expiresAt = null, createdAt = ''}) {
        this.id = id;
        this.type = type;
        this.points = points;
        this.sourceId = sourceId;
        this.description = description;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }
}
