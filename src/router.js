import { createRouter, createWebHistory } from "vue-router";
import { useAppModeStore } from "./shared/application/app-mode.store.js";

import Home from "./shared/presentation/views/home.vue";
import TourList from "./tour-management/presentation/views/tour-list.vue";
import TourForm from "./tour-management/presentation/views/tour-form.vue";
import TouristsAssignment from "./tour-management/presentation/views/tourists-assigment.vue";
import monitoringRoutes from "./monitoring/presentation/monitoring-routes.js";
import navigationRoutes from "./navigation/presentation/navigation-routes.js";
import iotRoutes from "./iot/presentation/iot-routes.js";

const RoutesPage = () => import("./shared/presentation/views/routes-page.vue");
const RouteDetailPage = () =>
  import("./shared/presentation/views/route-detail.vue");
const CommunityPage = () => import("./shared/presentation/views/community.vue");
const pageNotFound = () =>
  import("./shared/presentation/views/page-not-found.vue");

// Routes version when IAM is not implemented
// TODO [IAM]: Cuando se implemente autenticación real, reemplazar `requiredMode`
// por guards que lean el claim `role` del JWT. Ver useAppModeStore y el plan de
// implementación del bounded context IAM en el backend.
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
    path: "/about",
    name: "about",
    component: pageNotFound,
    meta: { title: "Page 404 not found" }
  },
  {
    path: "/agencies",
    name: "agencies",
    component: pageNotFound,
    meta: { title: "Page 404 not found", requiredMode: "empresa" }
  },
  {
    path: "/plans",
    name: "plans",
    component: pageNotFound,
    meta: { title: "Page 404 not found", requiredMode: "empresa" }
  },
  {
    path: "/identity",
    name: "identity-access",
    component: pageNotFound,
    meta: { title: "Page 404 not found" }
  },
  {
    path: "/notifications",
    name: "notifications-profile",
    component: pageNotFound,
    meta: { title: "Page 404 not found" }
  },
  {
    path: "/profile",
    name: "my-profile",
    component: pageNotFound,
    meta: { title: "Page 404 not found" }
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
    path: "/",
    redirect: "/home"
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

router.beforeEach((to, from, next) => {
  const baseTitle = "VitalTrek";
  document.title = `${baseTitle} - ${to.meta.title}`;

  // Buscar requiredMode en toda la cadena de rutas matched (padres e hijos)
  const requiredMode = to.matched
    .map(record => record.meta.requiredMode)
    .find(Boolean);

  if (requiredMode) {
    const modeStore = useAppModeStore();
    const currentMode = modeStore.mode;
    // Solo bloquear si el usuario YA eligió un modo y no coincide
    if (currentMode && currentMode !== requiredMode) {
      return next("/home");
    }
  }

  return next();
});

export default router;