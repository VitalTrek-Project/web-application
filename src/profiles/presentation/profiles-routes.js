const profileRouterView = () => import('./views/profile-router-view.vue');
const myPreferences = () => import('./views/my-preferences.vue');
const touristProfileViewer = () => import('./views/tourist-profile-viewer.vue');

/**
 * Profiles presentation routes. `/profile` renders either the tourist or the staff
 * profile view depending on the authenticated user's IAM role (see profile-router-view.vue) —
 * both modes share the same sidebar link.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const profilesRoutes = [
    { path: '/profile', name: 'my-profile', component: profileRouterView, meta: { title: 'My profile', requiresAuth: true } },
    { path: '/profile/preferences', name: 'my-preferences', component: myPreferences, meta: { title: 'My preferences', requiredMode: 'trekker' } },
    {
        path: '/profile/tourists/:touristId',
        name: 'agency-tourist-profile',
        component: touristProfileViewer,
        meta: { title: 'Tourist profile', requiredMode: 'empresa' }
    }
];

export default profilesRoutes;
