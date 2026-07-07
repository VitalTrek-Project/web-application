export class TicketReply {
    constructor({
        id = null,
        ticketId = null,
        authorName = '',
        authorMode = '',
        message = '',
        createdAt = ''
    }) {
        this.id = id;
        this.ticketId = ticketId;
        this.authorName = authorName;
        this.authorMode = authorMode;
        this.message = message;
        this.createdAt = createdAt;
    }
}
