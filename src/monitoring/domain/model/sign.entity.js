import {Tourist} from "./tourist.entity.js";

export class Sign {

    constructor({id=null, touristId= null,expeditionId=null,
                    heartRate=null,bloodOxygen=null,bodyTemperature=null,
                steps=null, recordedAt='', tourist = null}){
        this.id = id;
        this.touristId = touristId;
        this.expeditionId = expeditionId;
        this.heartRate = heartRate;
        this.bloodOxygen = bloodOxygen;
        this.bodyTemperature = bodyTemperature;
        this.steps = steps;
        this.recordedAt = recordedAt;

        this.tourist = tourist instanceof Tourist ? tourist : null;
    }
}