import {defineStore} from "pinia";
import {ref} from "vue";
import {DashboardApi} from "../infrastructure/dashboard-api.js";
import {AdminDashboardSummaryAssembler} from "../infrastructure/admin-dashboard-summary.assembler.js";
import {ActiveExpeditionAssembler} from "../infrastructure/active-expedition.assembler.js";
import {AttentionAlertAssembler} from "../infrastructure/attention-alert.assembler.js";
import {TouristDashboardAssembler} from "../infrastructure/tourist-dashboard.assembler.js";

const dashboardApi = new DashboardApi();

function defaultRange() {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return {preset: '30d', from, to};
}

function toIso(date) {
    return date instanceof Date ? date.toISOString() : date;
}

function rangeKey(range) {
    return `${toIso(range.from)}|${toIso(range.to)}`;
}

/**
 * Reactive store that exposes Dashboard queries: the shared date-range filter,
 * per-section loading flags and a basic cache keyed by the active date range so
 * switching tabs doesn't re-fetch data that already matches the current filter.
 *
 * @returns {Object} Reactive Dashboard state and query actions.
 */
const useDashboardStore = defineStore('dashboard', () => {
    const dateRange = ref(defaultRange());
    const errors = ref([]);

    const summary = ref(null);
    const summaryLoading = ref(false);
    const summaryKey = ref(null);

    const alertsDistribution = ref(null);
    const alertsDistributionLoading = ref(false);
    const alertsDistributionKey = ref(null);

    const expeditionsTimeSeries = ref([]);
    const timeSeriesLoading = ref(false);
    const timeSeriesKey = ref(null);

    const attentionAlerts = ref([]);
    const attentionLoading = ref(false);
    const attentionLoaded = ref(false);

    const activeExpeditions = ref([]);
    const activeExpeditionsLoading = ref(false);
    const activeExpeditionsLoaded = ref(false);

    const touristDashboard = ref(null);
    const touristDashboardLoading = ref(false);
    const touristDashboardKey = ref(null);

    function fetchAdminSummary(force = false) {
        const key = rangeKey(dateRange.value);
        if (!force && summaryKey.value === key && summary.value) return Promise.resolve(summary.value);
        summaryLoading.value = true;
        errors.value = [];
        return dashboardApi.getAdminSummary({from: toIso(dateRange.value.from), to: toIso(dateRange.value.to)})
            .then(response => {
                summary.value = AdminDashboardSummaryAssembler.toEntityFromResource(response.data);
                summaryKey.value = key;
                return summary.value;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                summaryLoading.value = false;
            });
    }

    function fetchAlertsDistribution(force = false) {
        const key = rangeKey(dateRange.value);
        if (!force && alertsDistributionKey.value === key && alertsDistribution.value) {
            return Promise.resolve(alertsDistribution.value);
        }
        alertsDistributionLoading.value = true;
        errors.value = [];
        return dashboardApi.getAlertsDistribution({from: toIso(dateRange.value.from), to: toIso(dateRange.value.to)})
            .then(response => {
                alertsDistribution.value = response.data;
                alertsDistributionKey.value = key;
                return alertsDistribution.value;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                alertsDistributionLoading.value = false;
            });
    }

    function fetchExpeditionsTimeSeries(bucket = 'week', force = false) {
        const key = `${rangeKey(dateRange.value)}|${bucket}`;
        if (!force && timeSeriesKey.value === key) return Promise.resolve(expeditionsTimeSeries.value);
        timeSeriesLoading.value = true;
        errors.value = [];
        return dashboardApi.getExpeditionsTimeSeries({
            from: toIso(dateRange.value.from),
            to: toIso(dateRange.value.to),
            bucket
        })
            .then(response => {
                expeditionsTimeSeries.value = response.data;
                timeSeriesKey.value = key;
                return expeditionsTimeSeries.value;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                timeSeriesLoading.value = false;
            });
    }

    function fetchAlertsRequiringAttention(force = false) {
        if (!force && attentionLoaded.value) return Promise.resolve(attentionAlerts.value);
        attentionLoading.value = true;
        errors.value = [];
        return dashboardApi.getAlertsRequiringAttention({take: 20})
            .then(response => {
                attentionAlerts.value = AttentionAlertAssembler.toEntitiesFromResponse(response);
                attentionLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                attentionLoading.value = false;
            });
    }

    function fetchActiveExpeditions(force = false) {
        if (!force && activeExpeditionsLoaded.value) return Promise.resolve(activeExpeditions.value);
        activeExpeditionsLoading.value = true;
        errors.value = [];
        return dashboardApi.getActiveExpeditions()
            .then(response => {
                activeExpeditions.value = ActiveExpeditionAssembler.toEntitiesFromResponse(response);
                activeExpeditionsLoaded.value = true;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                activeExpeditionsLoading.value = false;
            });
    }

    function fetchTouristDashboard(touristId, force = false) {
        const key = String(touristId);
        if (!force && touristDashboardKey.value === key && touristDashboard.value) {
            return Promise.resolve(touristDashboard.value);
        }
        touristDashboardLoading.value = true;
        errors.value = [];
        return dashboardApi.getTouristSummary(touristId)
            .then(response => {
                touristDashboard.value = TouristDashboardAssembler.toEntityFromResource(response.data);
                touristDashboardKey.value = key;
                return touristDashboard.value;
            })
            .catch(error => {
                errors.value.push(error);
            })
            .finally(() => {
                touristDashboardLoading.value = false;
            });
    }

    function refreshAdminDashboard() {
        attentionLoaded.value = false;
        activeExpeditionsLoaded.value = false;
        return Promise.all([
            fetchAdminSummary(true),
            fetchAlertsDistribution(true),
            fetchExpeditionsTimeSeries('week', true),
            fetchAlertsRequiringAttention(true),
            fetchActiveExpeditions(true)
        ]);
    }

    return {
        dateRange,
        errors,

        summary,
        summaryLoading,
        alertsDistribution,
        alertsDistributionLoading,
        expeditionsTimeSeries,
        timeSeriesLoading,
        attentionAlerts,
        attentionLoading,
        attentionLoaded,
        activeExpeditions,
        activeExpeditionsLoading,
        activeExpeditionsLoaded,
        touristDashboard,
        touristDashboardLoading,

        fetchAdminSummary,
        fetchAlertsDistribution,
        fetchExpeditionsTimeSeries,
        fetchAlertsRequiringAttention,
        fetchActiveExpeditions,
        fetchTouristDashboard,
        refreshAdminDashboard
    };
});

export default useDashboardStore;
