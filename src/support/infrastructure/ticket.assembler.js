import {Ticket} from "../domain/model/ticket.entity.js";

export class TicketAssembler {
    static toEntityFromResource(resource) {
        return new Ticket({...resource});
    }
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['tickets'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
