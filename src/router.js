import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
<<<<<<< HEAD
import TourList from "./tour-management/presentation/views/tour-list.vue";
import TourForm from "./tour-management/presentation/views/tour-form.vue";
import TouristsAssignment from "./tour-management/presentation/views/tourists-assigment.vue";
import monitoringRoutes from "./monitoring/presentation/monitoring-routes.js";
=======
import Weather from "./navigation/presentation/weather-widget.vue";
import Route from "./navigation/presentation/route-map.vue";
import Experience from "./navigation/presentation/experience-log.vue";
import Expedition from "./navigation/presentation/expedition-dashboard.vue"
>>>>>>> feature/navigation

// To import when IAM is implemented,
// import iamRoutes from "./iam/presentation/iam-routes.js";

// Define lazy-loaded components for routes
const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
<<<<<<< HEAD
/*
// Routes version when IAM is implemented
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/about',           name: 'about',      component: about,       meta: { title: 'About' } },
    { path: '/monitoring',      name: 'monitoring', children: monitoringRoutes },
    { path: '/iam',             name: 'iam',        children: iamRoutes },
    { path: '/',                redirect: '/home' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];
*/

// Routes version when IAM is not implemented
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/about',           name: 'about',      component: about,       meta: { title: 'About' } },
    { path: '/tours', name: 'tour-management-tours', component: TourList, meta: { title: 'Tour' } },
    { path: '/tours/new', name: 'tour-management-tour-new', component: TourForm, meta: { title: 'New Tour' } },
    { path: '/tours/:id/edit', name: 'tour-management-tour-edit', component: TourForm, meta: { title: 'Edit Tour' } },
    { path: '/tourists-assignment', name: 'tour-management-tourists-assignment', component: TouristsAssignment, meta: { title: 'Tourists Assignment' } },

    { path: '/monitoring', name: 'monitoring', redirect: { name: 'monitoring-signs' }, children: monitoringRoutes },
=======

// Routes version when IAM is not implemented
const routes = [
    { path: '/home',            name: 'home',        component: Home,         meta: { title: 'Home' } },
    // Navigation overview shows the expedition dashboard with map, weather and experiences
    { path: '/navigation',      name: 'navigation',   component: Expedition,   meta: { title: 'Navigation' } },

    { path: '/weather',         name: 'navigation-weather',     component: Weather,      meta: { title: 'Weather' } },
    { path: '/expeditions',     name: 'navigation-expeditions', component: Expedition,   meta: { title: 'Expeditions' } },
    { path: '/experiences',     name: 'navigation-experiences', component: Experience,   meta: { title: 'Experiences' } },
>>>>>>> feature/navigation
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