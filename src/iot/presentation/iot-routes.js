const deviceDashboard = () => import("./views/device-dashboard.vue");
const sensorDataView = () => import("./views/sensor-data-view.vue");
const deviceControlPanel = () => import("./views/device-control-panel.vue");

/**
 * Routes mounted under `/iot`.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const iotRoutes = [
  {
    path: "devices",
    name: "iot-devices",
    component: deviceDashboard,
    meta: { title: "IoT Devices" }
  },
  {
    path: "readings",
    name: "iot-readings",
    component: sensorDataView,
    meta: { title: "Sensor readings" }
  },
  {
    path: "control",
    name: "iot-control",
    component: deviceControlPanel,
    meta: { title: "Device control" }
  }
];

export default iotRoutes;
