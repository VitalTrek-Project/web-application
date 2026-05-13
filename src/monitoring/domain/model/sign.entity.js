export class Sign {

    constructor({id=null, touristId= null,expeditionId=null,
                    heartRate='',bloodOxygen='',bodyTemperature='',
                steps='', recordedAt=''}){
        this.id = id;
        this.touristId = touristId;
        this.expeditionId = expeditionId;
        this.heartRate = heartRate;
        this.bloodOxygen = bloodOxygen;
        this.bodyTemperature = bodyTemperature;
        this.steps = steps;
        this.recordedAt = recordedAt;
    }
}