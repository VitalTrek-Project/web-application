const routeMap = () => import("./route-map.vue");
const weatherWidget = () => import("./weather-widget.vue");
const experienceLog = () => import("./experience-log.vue");
const expeditionDashboard = () => import("./expedition-dashboard.vue");

/**
 * Presentation routes mounted under `/navigation`.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const navigationRoutes = [
  {
    path: "map",
    name: "navigation-map",
    component: routeMap,
    meta: { title: "Map & route" }
  },
  {
    path: "weather",
    name: "navigation-weather",
    component: weatherWidget,
    meta: { title: "Climate" }
  },
  {
    path: "log",
    name: "navigation-log",
    component: experienceLog,
    meta: { title: "Binnacle" }
  },
  {
    path: "expedition",
    name: "navigation-expedition",
    component: expeditionDashboard,
    meta: { title: "Expedition panel" }
  }
];

export default navigationRoutes;
