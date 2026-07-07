const ticketList = () => import('./views/ticket-list.vue');
const ticketForm = () => import('./views/ticket-form.vue');
const ticketDetail = () => import('./views/ticket-detail.vue');

const supportRoutes = [
    { path: 'tickets', name: 'support-tickets', component: ticketList, meta: { title: 'Support tickets' } },
    { path: 'tickets/new', name: 'support-ticket-new', component: ticketForm, meta: { title: 'New support ticket' } },
    { path: 'tickets/:id', name: 'support-ticket-detail', component: ticketDetail, meta: { title: 'Support ticket detail' } },
    { path: 'tickets/:id/edit', name: 'support-ticket-edit', component: ticketForm, meta: { title: 'Edit support ticket' } }
];

export default supportRoutes;
