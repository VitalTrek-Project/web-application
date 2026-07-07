export class TouristExpedition {
    constructor({id = null, expeditionName = '', status = '', guideId = null, lastActivityAt = ''}) {
        this.id = id;
        this.expeditionName = expeditionName;
        this.status = status;
        this.guideId = guideId;
        this.lastActivityAt = lastActivityAt;
    }
}
