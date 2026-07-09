import { createRouter, createWebHistory } from "vue-router";
import { useAppModeStore } from "./shared/application/app-mode.store.js";
import useIamStore from "./iam/application/iam.store.js";

import Home from "./shared/presentation/views/home.vue";
import TourList from "./tour-management/presentation/views/tour-list.vue";
import TourForm from "./tour-management/presentation/views/tour-form.vue";
import TouristsAssignment from "./tour-management/presentation/views/tourists-assigment.vue";
import monitoringRoutes from "./monitoring/presentation/monitoring-routes.js";
import navigationRoutes from "./navigation/presentation/navigation-routes.js";
import iotRoutes from "./iot/presentation/iot-routes.js";
import supportRoutes from "./support/presentation/support-routes.js";
import dashboardRoutes from "./dashboard/presentation/dashboard-routes.js";
import loyaltyRoutes from "./loyalty/presentation/loyalty-routes.js";
import iamRoutes from "./iam/presentation/iam-routes.js";
import profilesRoutes from "./profiles/presentation/profiles-routes.js";

const RoutesPage = () => import("./shared/presentation/views/routes-page.vue");
const RouteDetailPage = () =>
  import("./shared/presentation/views/route-detail.vue");
const CommunityPage = () => import("./shared/presentation/views/community.vue");
const PlansPage = () =>
  import("./subscriptions/presentation/views/plans.vue");
const pageNotFound = () =>
  import("./shared/presentation/views/page-not-found.vue");

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { title: "Home" }
  },
  {
    path: "/routes",
    name: "routes",
    component: RoutesPage,
    meta: { title: "Routes" }
  },
  {
    path: "/routes/:id",
    name: "route-detail",
    component: RouteDetailPage,
    meta: { title: "Route detail" }
  },
  {
    path: "/community",
    name: "community",
    component: CommunityPage,
    meta: { title: "Community" }
  },
  {
    path: "/plans",
    name: "plans",
    component: PlansPage,
    meta: { title: "Plans", requiresAuth: true }
  },
  {
    path: "/tours",
    name: "tour-management-tours",
    component: TourList,
    meta: { title: "Tour", requiredMode: "empresa" }
  },
  {
    path: "/tours/new",
    name: "tour-management-tour-new",
    component: TourForm,
    meta: { title: "New Tour", requiredMode: "empresa" }
  },
  {
    path: "/tours/:id/edit",
    name: "tour-management-tour-edit",
    component: TourForm,
    meta: { title: "Edit Tour", requiredMode: "empresa" }
  },
  {
    path: "/tourists-assignment",
    name: "tour-management-tourists-assignment",
    component: TouristsAssignment,
    meta: { title: "Tourists Assignment", requiredMode: "empresa" }
  },
  {
    path: "/monitoring",
    name: "monitoring",
    redirect: { name: "monitoring-signs" },
    children: monitoringRoutes
  },
  {
    path: "/navigation",
    name: "navigation",
    redirect: { name: "navigation-map" },
    children: navigationRoutes
  },
  {
    path: "/iot",
    name: "iot",
    redirect: { name: "iot-devices" },
    meta: { requiredMode: "empresa" },
    children: iotRoutes
  },
  {
    path: "/support",
    name: "support",
    redirect: { name: "support-tickets" },
    meta: { requiresAuth: true },
    children: supportRoutes
  },
  {
    path: "/iam",
    name: "iam",
    component: () => import("./iam/presentation/views/iam-shell.vue"),
    redirect: { name: "iam-sign-up" },
    children: iamRoutes
  },
  ...dashboardRoutes,
  ...loyaltyRoutes,
  ...profilesRoutes,
  {
    path: "/",
    redirect: "/iam/sign-up"
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: pageNotFound,
    meta: { title: "Page Not Found" }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

const ROLE_TO_MODE = { Agency: "empresa", Tourist: "trekker" };

router.beforeEach((to, from, next) => {
  const baseTitle = "VitalTrek";
  document.title = `${baseTitle} - ${to.meta.title}`;

  const iamStore = useIamStore();
  const modeStore = useAppModeStore();

  // Once authenticated, the mode is derived from the user's real role rather
  // than the manual mode-selector (kept for pre-authentication browsing).
  if (iamStore.isSignedIn && iamStore.currentRole) {
    const derivedMode = ROLE_TO_MODE[iamStore.currentRole];
    if (derivedMode && modeStore.mode !== derivedMode) modeStore.setMode(derivedMode);
  }

  // Authenticated users landing on auth screens go straight to home.
  if (iamStore.isSignedIn && to.path.startsWith("/iam")) {
    return next({ name: "home" });
  }

  // Buscar requiredMode en toda la cadena de rutas matched (padres e hijos)
  const requiredMode = to.matched
    .map(record => record.meta.requiredMode)
    .find(Boolean);
  const requiresAuth = Boolean(requiredMode) || to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !iamStore.isSignedIn) {
    return next({ name: "iam-sign-in", query: { redirect: to.fullPath } });
  }

  if (requiredMode) {
    const currentMode = modeStore.mode;
    // Solo bloquear si el usuario YA eligió un modo y no coincide
    if (currentMode && currentMode !== requiredMode) {
      return next("/home");
    }
  }

  return next();
});

export default router;