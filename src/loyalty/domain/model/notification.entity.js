export class LoyaltyNotification {
    constructor({id = null, type = '', title = '', message = '', isRead = false, createdAt = ''}) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
}
