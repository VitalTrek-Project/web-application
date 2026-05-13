
const signList = () => import('./views/sign-list.vue');
const signForm = () => import('./views/sign-form.vue');


/**
 * Publishing presentation routes mounted under `/monitoring`.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const monitoringRoutes = [
    {   path: 'signs',             name: 'monitoring-signs',      component: signList, meta: {title: 'Signs'}},
    {   path: 'signs/new',         name: 'monitoring-sign-new',    component: signForm, meta: {title: 'New Sign'}},
    {   path: 'signs/:id/edit',    name: 'monitoring-sign-edit',   component: signForm, meta: {title: 'Edit Sign'}},
    
];

export default monitoringRoutes;