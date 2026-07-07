export class Ticket {
    constructor({
        id = null,
        userId = null,
        userMode = '',
        fullName = '',
        email = '',
        subject = '',
        category = '',
        description = '',
        priority = '',
        status = '',
        createdAt = '',
        updatedAt = ''
    }) {
        this.id = id;
        this.userId = userId;
        this.userMode = userMode;
        this.fullName = fullName;
        this.email = email;
        this.subject = subject;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
