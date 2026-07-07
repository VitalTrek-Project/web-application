const myPoints = () => import('./views/my-points.vue');
const rewardsCatalog = () => import('./views/rewards-catalog.vue');
const myCollectibles = () => import('./views/my-collectibles.vue');
const myReferral = () => import('./views/my-referral.vue');
const loyaltySettings = () => import('./views/loyalty-settings.vue');
const rewardsManager = () => import('./views/rewards-manager.vue');
const redemptionsManager = () => import('./views/redemptions-manager.vue');

const loyaltyRoutes = [
    {
        path: '/loyalty/points',
        name: 'loyalty-points',
        component: myPoints,
        meta: { title: 'My points', requiredMode: 'trekker' }
    },
    {
        path: '/loyalty/rewards',
        name: 'loyalty-rewards',
        component: rewardsCatalog,
        meta: { title: 'Rewards', requiredMode: 'trekker' }
    },
    {
        path: '/loyalty/collectibles',
        name: 'loyalty-collectibles',
        component: myCollectibles,
        meta: { title: 'Badges & redemptions', requiredMode: 'trekker' }
    },
    {
        path: '/loyalty/referral',
        name: 'loyalty-referral',
        component: myReferral,
        meta: { title: 'Referral', requiredMode: 'trekker' }
    },
    {
        path: '/loyalty-admin/settings',
        name: 'loyalty-admin-settings',
        component: loyaltySettings,
        meta: { title: 'Loyalty settings', requiredMode: 'empresa' }
    },
    {
        path: '/loyalty-admin/rewards',
        name: 'loyalty-admin-rewards',
        component: rewardsManager,
        meta: { title: 'Rewards manager', requiredMode: 'empresa' }
    },
    {
        path: '/loyalty-admin/redemptions',
        name: 'loyalty-admin-redemptions',
        component: redemptionsManager,
        meta: { title: 'Redemptions manager', requiredMode: 'empresa' }
    }
];

export default loyaltyRoutes;
