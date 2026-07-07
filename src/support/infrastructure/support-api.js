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

    /**
     * The backend only allows changing status/priority after creation, via PATCH
     * (not PUT — there is no full-resource replace, and no DELETE at all for tickets).
     * @param {string} ticketId
     * @param {{status?: string, priority?: string}} patch
     */
    updateTicket(ticketId, patch) {
        return this.http.patch(`${ticketsEndpointPath}/${ticketId}`, patch);
    }

    /**
     * ticketId is a required query parameter on the backend (GET /support-ticket-replies?ticketId=...),
     * not a path segment, and requests without it are rejected with 400.
     */
    getTicketReplies(ticketId) {
        return this.http.get(ticketRepliesEndpointPath, {params: {ticketId}});
    }

    createTicketReply(resource) {
        return this.#ticketRepliesEndpoint.create(resource);
    }
}
