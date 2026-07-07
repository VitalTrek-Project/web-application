import {TicketReply} from "../domain/model/ticket-reply.entity.js";

export class TicketReplyAssembler {
    static toEntityFromResource(resource) {
        return new TicketReply({...resource});
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['ticketReplies'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
