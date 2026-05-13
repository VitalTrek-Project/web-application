export class Alert {

    constructor({id=null, touristId= null,expeditionId=null, type='',
                   severity='', status='', message='',  raisedAt=''}){

        this.id=id;
        this.touristId = touristId;
        this.expeditionId = expeditionId;
        this.type = type;
        this.severity = severity;
        this.status = status;
        this.message = message;
        this.raisedAt = raisedAt;
    }
}