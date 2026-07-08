import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {SignAssembler} from "../infrastructure/sign.assembler.js";
import {TouristAssembler} from "../infrastructure/tourist.assembler.js";
import {AlertAssembler} from "../infrastructure/alert.assembler.js";

const monitoringApi = new MonitoringApi();
const DEFAULT_EXPEDITION_ID_KEY = "vitaltrek_monitoring_expedition_id";

function resolveExpeditionId(explicitId) {
    if (explicitId != null && explicitId !== "") return explicitId;
    const stored = localStorage.getItem(DEFAULT_EXPEDITION_ID_KEY);
    return stored || null;
}

/**
 * Reactive store that exposes Monitoring commands and queries against VitalTrek Platform.
 */
const useMonitoringStore = defineStore('monitoring', () => {
    const signs = ref([]);
    const tourists = ref([]);
    const alerts = ref([]);
    const locations = ref([]);
    const incidents = ref([]);
    const errors = ref([]);
    const signsLoaded = ref(false);
    const touristsLoaded = ref(false);
    const alertsLoaded = ref(false);
    const currentExpeditionId = ref(resolveExpeditionId());

    const signsCount = computed(() => (signsLoaded.value ? signs.value.length : 0));
    const touristsCount = computed(() => (touristsLoaded.value ? tourists.value.length : 0));
    const alertsCount = computed(() => (alertsLoaded.value ? alerts.value.length : 0));

    function setExpeditionId(expeditionId) {
        currentExpeditionId.value = expeditionId;
        if (expeditionId != null) {
            localStorage.setItem(DEFAULT_EXPEDITION_ID_KEY, String(expeditionId));
        }
    }

    function fetchSigns(expeditionId) {
        errors.value = [];
        const id = resolveExpeditionId(expeditionId ?? currentExpeditionId.value);
        if (!id) {
            signs.value = [];
            signsLoaded.value = true;
            return Promise.resolve([]);
        }
        setExpeditionId(id);
        return monitoringApi.getSignsByExpedition(id).then((response) => {
            signs.value = SignAssembler.toEntitiesFromResponse(response);
            signsLoaded.value = true;
            return signs.value;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function fetchTourists() {
        errors.value = [];
        return monitoringApi.getUsers().then((response) => {
            const resources = Array.isArray(response.data)
                ? response.data
                : (response.data?.users ?? []);
            const touristResources = resources
                .filter((user) => String(user.role ?? "").toLowerCase() === "tourist")
                .map((user) => ({
                    id: user.id,
                    userId: user.id,
                    fullName: user.username,
                    email: "",
                    phone: "",
                    emergencyContact: "",
                    assignmentStatus: ""
                }));
            tourists.value = touristResources.map((resource) =>
                TouristAssembler.toEntityFromResource(resource)
            );
            touristsLoaded.value = true;
            return tourists.value;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function getTouristById(id) {
        return tourists.value.find((tourist) => String(tourist.id) === String(id));
    }

    function getSignById(id) {
        return signs.value.find((sign) => String(sign.id) === String(id));
    }

    function addSign(sign) {
        const payload = {
            expeditionId: Number(sign.expeditionId ?? currentExpeditionId.value),
            touristId: Number(sign.touristId ?? sign.tourist?.id),
            heartRate: Number(sign.heartRate),
            bloodOxygen: Number(sign.bloodOxygen),
            bodyTemperature: Number(sign.bodyTemperature)
        };
        return monitoringApi.createSign(payload).then((response) => {
            const newSign = SignAssembler.toEntityFromResource(response.data);
            signs.value.push(newSign);
            return newSign;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    // Platform does not expose PUT/DELETE for vital-sign readings; keep no-ops for UI compatibility.
    function updateSign() {
        return Promise.resolve();
    }

    function deleteSign() {
        return Promise.resolve();
    }

    function fetchAlerts(expeditionId) {
        errors.value = [];
        const id = resolveExpeditionId(expeditionId ?? currentExpeditionId.value);
        if (!id) {
            alerts.value = [];
            alertsLoaded.value = true;
            return Promise.resolve([]);
        }
        setExpeditionId(id);
        return monitoringApi.getAlertsByExpedition(id).then((response) => {
            alerts.value = AlertAssembler.toEntitiesFromResponse(response);
            alertsLoaded.value = true;
            return alerts.value;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function getAlertById(id) {
        return alerts.value.find((alert) => String(alert.id) === String(id));
    }

    function addAlert(alert) {
        const payload = {
            expeditionId: Number(alert.expeditionId ?? currentExpeditionId.value),
            touristId: Number(alert.touristId ?? alert.tourist?.id),
            type: alert.type,
            severity: alert.severity,
            message: alert.message
        };
        return monitoringApi.createAlert(payload).then((response) => {
            const newAlert = AlertAssembler.toEntityFromResource(response.data);
            alerts.value.push(newAlert);
            return newAlert;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function updateAlert() {
        return Promise.resolve();
    }

    function deleteAlert() {
        return Promise.resolve();
    }

    function acknowledgeAlert(alertId, userId) {
        return monitoringApi.acknowledgeAlert(alertId, userId).then((response) => {
            const updatedAlert = AlertAssembler.toEntityFromResource(response.data);
            const index = alerts.value.findIndex((t) => String(t.id) === String(updatedAlert.id));
            if (index !== -1) alerts.value[index] = updatedAlert;
            return updatedAlert;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function dismissAlert(alertId) {
        return monitoringApi.dismissAlert(alertId).then((response) => {
            const updatedAlert = AlertAssembler.toEntityFromResource(response.data);
            const index = alerts.value.findIndex((t) => String(t.id) === String(updatedAlert.id));
            if (index !== -1) alerts.value[index] = updatedAlert;
            return updatedAlert;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function fetchLocations(expeditionId) {
        const id = resolveExpeditionId(expeditionId ?? currentExpeditionId.value);
        if (!id) {
            locations.value = [];
            return Promise.resolve([]);
        }
        return monitoringApi.getLocationsByExpedition(id).then((response) => {
            locations.value = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
            return locations.value;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    function fetchIncidents() {
        return monitoringApi.getIncidents().then((response) => {
            incidents.value = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
            return incidents.value;
        }).catch((error) => {
            errors.value.push(error);
            throw error;
        });
    }

    // Deprecated mockCRUD tourist mutations — directory is read-only from /users.
    function addTourist() { return Promise.resolve(); }
    function updateTourist() { return Promise.resolve(); }
    function deleteTourist() { return Promise.resolve(); }

    return {
        signs,
        tourists,
        errors,
        signsLoaded,
        touristsLoaded,
        signsCount,
        touristsCount,
        currentExpeditionId,
        setExpeditionId,
        fetchSigns,
        fetchTourists,
        getSignById,
        addSign,
        updateSign,
        deleteSign,
        addTourist,
        updateTourist,
        deleteTourist,
        getTouristById,
        addAlert,
        updateAlert,
        deleteAlert,
        getAlertById,
        acknowledgeAlert,
        dismissAlert,
        alertsLoaded,
        alerts,
        alertsCount,
        fetchAlerts,
        locations,
        fetchLocations,
        incidents,
        fetchIncidents
    };
});

export default useMonitoringStore;
