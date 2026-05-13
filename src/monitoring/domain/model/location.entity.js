export class Location {

    constructor({id=null,touristId= null,expeditionId=null,  latitude=null,
                    longitude=null, accuracyMeters=null,  recordedAt=''}){
        this.id=id;
        this.touristId = touristId;
        this.expeditionId = expeditionId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracyMeters = accuracyMeters;
        this.recordedAt = recordedAt;
    }
}