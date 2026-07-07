export class ActiveExpedition {
    constructor({id = null, expeditionName = '', status = '', guideId = null, touristCount = 0}) {
        this.id = id;
        this.expeditionName = expeditionName;
        this.status = status;
        this.guideId = guideId;
        this.touristCount = touristCount;
    }
}
