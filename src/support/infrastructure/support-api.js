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

    constructor() {
        super();
        this.#ticketsEndpoint = new BaseEndpoint(this, ticketsEndpointPath);
    }

    /**
     * @param {string} [userId] - When provided, filters the collection to tickets opened by this user.
     *   Tourists must always pass their own id — the backend rejects an unfiltered or mismatched
     *   request from a Tourist-role caller; only agency staff may omit it to browse the full queue.
     */
    getTickets(userId) {
        return this.http.get(ticketsEndpointPath, {params: userId ? {userId} : {}});
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
     * Replies are a nested sub-resource under `/tickets/{ticketId}/replies` (note: "tickets",
     * not "support-tickets" like the parent collection — that's the backend's own routing).
     */
    getTicketReplies(ticketId) {
        return this.http.get(`${ticketRepliesEndpointPath}/${ticketId}/replies`);
    }

    /**
     * @param {string} ticketId
     * @param {{authorName?: string, authorMode?: string, message: string}} resource
     */
    createTicketReply(ticketId, resource) {
        return this.http.post(`${ticketRepliesEndpointPath}/${ticketId}/replies`, resource);
    }
}
