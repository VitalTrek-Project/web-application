import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
import Weather from "./navigation/presentation/weather-widget.vue";
import Route from "./navigation/presentation/route-map.vue";
import Experience from "./navigation/presentation/experience-log.vue";
import Expedition from "./navigation/presentation/expedition-dashboard.vue"

// To import when IAM is implemented,
// import iamRoutes from "./iam/presentation/iam-routes.js";

// Define lazy-loaded components for routes
const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

// Routes version when IAM is not implemented
const routes = [
    { path: '/home',            name: 'home',        component: Home,         meta: { title: 'Home' } },
    // Navigation overview shows the expedition dashboard with map, weather and experiences
    { path: '/navigation',      name: 'navigation',   component: Expedition,   meta: { title: 'Navigation' } },

    { path: '/weather',         name: 'navigation-weather',     component: Weather,      meta: { title: 'Weather' } },
    { path: '/expeditions',     name: 'navigation-expeditions', component: Expedition,   meta: { title: 'Expeditions' } },
    { path: '/experiences',     name: 'navigation-experiences', component: Experience,   meta: { title: 'Experiences' } },
    { path: '/',                redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found',   component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

/**
 * Global navigation guard that updates the document title and delegates auth when enabled.
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'VitalTrek';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    return next();
});

export default router;