import {BaseApi} from "../../shared/infrastructure/base-api.js";

const adminSummaryPath = "/dashboard/admin/summary";
const alertsDistributionPath = "/dashboard/admin/alerts-distribution";
const expeditionsTimeSeriesPath = "/dashboard/admin/expeditions-timeseries";
const alertsAttentionPath = "/dashboard/admin/alerts-attention";
const activeExpeditionsPath = "/dashboard/admin/expeditions-active";

/**
 * Infrastructure adapter for Dashboard HTTP endpoints.
 * Unlike other bounded contexts this does not use BaseEndpoint, since these are
 * fixed read-only aggregation routes (query params), not a CRUD resource collection.
 *
 * @class DashboardApi
 * @extends BaseApi
 */
export class DashboardApi extends BaseApi {
    getAdminSummary({from, to} = {}) {
        return this.http.get(adminSummaryPath, {params: {from, to}});
    }

    getAlertsDistribution({from, to} = {}) {
        return this.http.get(alertsDistributionPath, {params: {from, to}});
    }

    getExpeditionsTimeSeries({from, to, bucket = "week"} = {}) {
        return this.http.get(expeditionsTimeSeriesPath, {params: {from, to, bucket}});
    }

    getAlertsRequiringAttention({take = 20} = {}) {
        return this.http.get(alertsAttentionPath, {params: {take}});
    }

    getActiveExpeditions() {
        return this.http.get(activeExpeditionsPath);
    }

    getTouristSummary(touristId) {
        return this.http.get(`/dashboard/tourist/${touristId}/summary`);
    }
}
