const adminDashboard = () => import('./views/admin-dashboard.vue');
const touristDashboard = () => import('./views/tourist-dashboard.vue');

const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard-admin',
        component: adminDashboard,
        meta: {title: 'Dashboard', requiredMode: 'empresa'}
    },
    {
        path: '/mi-expedicion',
        name: 'dashboard-tourist',
        component: touristDashboard,
        meta: {title: 'My expedition', requiredMode: 'trekker'}
    }
];

export default dashboardRoutes;
