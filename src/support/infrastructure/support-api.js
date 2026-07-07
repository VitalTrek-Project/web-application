import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const ticketsEndpointPath = import.meta.env.VITE_SUPPORT_TICKETS_ENDPOINT_PATH;
const ticketRepliesEndpointPath = import.meta.env.VITE_SUPPORT_TICKET_REPLIES_ENDPOINT_PATH;

/**
 * Infrastructure adapter for Support HTTP endpoints.
 *
 * @class SupportApi
 * @extends BaseApi
 */
export class SupportApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #ticketsEndpoint;
    /** @type {BaseEndpoint} */
    #ticketRepliesEndpoint;

    constructor() {
        super();
        this.#ticketsEndpoint = new BaseEndpoint(this, ticketsEndpointPath);
        this.#ticketRepliesEndpoint = new BaseEndpoint(this, ticketRepliesEndpointPath);
    }

    getTickets() {
        return this.#ticketsEndpoint.getAll();
    }

    getTicketById(id) {
        return this.#ticketsEndpoint.getById(id);
    }

    createTicket(resource) {
        return this.#ticketsEndpoint.create(resource);
    }

    updateTicket(resource) {
        return this.#ticketsEndpoint.update(resource.id, resource);
    }

    deleteTicket(id) {
        return this.#ticketsEndpoint.delete(id);
    }

    getTicketReplies(ticketId) {
        return this.#ticketRepliesEndpoint.getAll().then((response) => {
            const records = Array.isArray(response.data) ? response.data : [];
            return {
                ...response,
                data: records.filter((reply) => String(reply.ticketId) === String(ticketId))
            };
        });
    }

    createTicketReply(resource) {
        return this.#ticketRepliesEndpoint.create(resource);
    }
}
