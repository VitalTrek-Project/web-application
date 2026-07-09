import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SupportApi} from "../infrastructure/support-api.js";
import {TicketAssembler} from "../infrastructure/ticket.assembler.js";
import {TicketReplyAssembler} from "../infrastructure/ticket-reply.assembler.js";
import useIamStore from "../../iam/application/iam.store.js";

const supportApi = new SupportApi();

/**
 * Reactive store that exposes Support commands and queries.
 *
 * @returns {Object} Reactive Support state and use-case actions.
 */
const useSupportStore = defineStore('support', () => {
    const tickets = ref([]);
    const ticketsLoaded = ref(false);
    const ticketsCount = computed(() => ticketsLoaded.value ? tickets.value.length : 0);

    const replies = ref([]);
    const repliesLoaded = ref(false);

    const errors = ref([]);

    function fetchTickets() {
        errors.value = [];
        // Tourists only ever see their own tickets; agency staff browse the full queue.
        const iamStore = useIamStore();
        const userId = iamStore.currentRole === 'Tourist' ? iamStore.currentUserId : undefined;
        return supportApi.getTickets(userId).then(response => {
            tickets.value = TicketAssembler.toEntitiesFromResponse(response);
            ticketsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getTicketById(id) {
        return tickets.value.find(ticket => String(ticket.id) === String(id));
    }

    function addTicket(ticket) {
        return supportApi.createTicket(ticket).then(response => {
            const resource = response.data;
            const newTicket = TicketAssembler.toEntityFromResource(resource);
            tickets.value.push(newTicket);
            return newTicket;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * @param {string} ticketId
     * @param {{status?: string, priority?: string}} patch - at least one of status/priority
     */
    function updateTicket(ticketId, patch) {
        return supportApi.updateTicket(ticketId, patch).then(response => {
            const resource = response.data;
            const updatedTicket = TicketAssembler.toEntityFromResource(resource);
            const index = tickets.value.findIndex(t => String(t.id) === String(updatedTicket.id));
            if (index !== -1) tickets.value[index] = updatedTicket;
            return updatedTicket;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function fetchRepliesByTicketId(ticketId) {
        errors.value = [];
        repliesLoaded.value = false;
        return supportApi.getTicketReplies(ticketId).then(response => {
            replies.value = TicketReplyAssembler.toEntitiesFromResponse(response);
            repliesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function addReply(reply) {
        return supportApi.createTicketReply(reply.ticketId, reply).then(response => {
            const resource = response.data;
            const newReply = TicketReplyAssembler.toEntityFromResource(resource);
            replies.value.push(newReply);
            return newReply;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        tickets,
        ticketsLoaded,
        ticketsCount,
        fetchTickets,
        getTicketById,
        addTicket,
        updateTicket,

        replies,
        repliesLoaded,
        fetchRepliesByTicketId,
        addReply,

        errors
    };
});

export default useSupportStore;
