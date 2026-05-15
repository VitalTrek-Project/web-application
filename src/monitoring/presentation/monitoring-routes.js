
const signList = () => import('./views/sign-list.vue');
const signForm = () => import('./views/sign-form.vue');
const alertList = () => import('./views/alert-list.vue');
const alertForm = () => import('./views/alert-form.vue');

/**
 * Publishing presentation routes mounted under `/monitoring`.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const monitoringRoutes = [
    {   path: 'signs',             name: 'monitoring-signs',      component: signList, meta: {title: 'Signs'}},
    {   path: 'signs/new',         name: 'monitoring-sign-new',    component: signForm, meta: {title: 'New Sign'}},
    {   path: 'signs/:id/edit',    name: 'monitoring-sign-edit',   component: signForm, meta: {title: 'Edit Sign'}},

    {   path: 'alerts',             name: 'monitoring-alert',      component: alertList, meta: {title: 'Alerts'}},
    {   path: 'alerts/new',         name: 'monitoring-alert-new',    component: alertForm, meta: {title: 'New Alert'}},
    {   path: 'alerts/:id/edit',    name: 'monitoring-alert-edit',   component: alertForm, meta: {title: 'Edit Alert'}},
];

export default monitoringRoutes;