export class Incident {

    constructor({id=null,expeditionId=null, reportedBy=null, type='',
                 description='', severity='', status='', latitude=null,
                   longitude=null,  recordedAt=''}){
        this.id=id;
        this.expeditionId = expeditionId;
        this.reportedBy = reportedBy;
        this.type = type;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
        this.recordedAt = recordedAt;
    }
}