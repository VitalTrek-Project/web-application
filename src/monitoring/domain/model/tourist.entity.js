export class Tourist {
    constructor({id=null, userId= null,
                    fullName='',email='',phone='',
                    emergencyContact='', assignmentStatus=''}){
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.emergencyContact = emergencyContact;
        this.assignmentStatus = assignmentStatus;

    }

}