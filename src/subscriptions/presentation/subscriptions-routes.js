const plansView = () => import("./views/plans.vue");

export default [
  {
    path: "",
    name: "subscriptions-plans",
    component: plansView,
    meta: { title: "Plans", requiredMode: "empresa" }
  }
];
