import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {SignAssembler} from "../infrastructure/sign.assembler.js";
import{TouristAssembler} from "../infrastructure/tourist.assembler.js";
import{AlertAssembler} from "../infrastructure/alert.assembler.js";

import {Sign} from "../domain/model/sign.entity.js";
import {Tourist} from "../domain/model/tourist.entity.js";
import {Alert} from "../domain/model/alert.entity.js";


const monitoringApi = new MonitoringApi();

/**
 * Reactive store that exposes Monitoring commands and queries.
 *
 * @returns {Object} Reactive Monitoring state and use-case actions.
 */
const useMonitoringStore = defineStore('monitoring', () => {
    /**
     * List of sign entities.
     * @type {import('vue').Ref<Sign[]>}
     */
    const signs = ref([]);
    /**
     * List of tourist entities.
     * @type {import('vue').Ref<Tourist[]>}
     */
    const tourists = ref([]);
    /**
     * List of errors encountered during API operations.
     * @type {import('vue').Ref<Error[]>}
     */
    const errors = ref([]);
    /**
     * Whether signs have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const signsLoaded = ref(false);
    /**
     * Whether tourists have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */
    const touristsLoaded = ref(false);
    /**
     * Number of loaded signs.
     * @type {import('vue').ComputedRef<number>}
     */
    const signsCount = computed(() => {
        return signsLoaded ? signs.value.length : 0;
    });
    /**
     * Number of loaded tourists.
     * @type {import('vue').ComputedRef<number>}
     */

    const touristsCount = computed(() => {
        return touristsLoaded ? signs.value.length : 0;
    });
    
    /**
     * Loads signs from infrastructure and updates the application state.
     * @returns {void}
     */
    function fetchSigns() {
        monitoringApi.getSigns().then(response => {
            signs.value = SignAssembler.toEntitiesFromResponse(response);
            signsLoaded.value = true;
            console.log(signsLoaded.value);
            console.log(signs.value);
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function fetchTourists() {
        monitoringApi.getTourists().then(response => {
            tourists.value = TouristAssembler.toEntitiesFromResponse(response);
            touristsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function getTouristById(id) {
        let idNum = parseInt(id);
        return tourists.value.find(tourist => tourist["id"] === idNum);
    }

    function addTourist(tourist) {
        monitoringApi.createTourist(tourist).then(response => {
            const resource = response.data;
            const newTourist = TouristAssembler.toEntityFromResource(resource);
            tourists.value.push(newTourist);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateTourist(tourist) {
        monitoringApi.updateTourist(tourist).then(response => {
            const resource = response.data;
            const updatedTourist = TouristAssembler.toEntityFromResource(resource);
            const index = tourists.value.findIndex(t => t["id"] === updatedTourist.id);
            if (index !== -1) tourists.value[index] = updatedTourist;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteTourist(tourist) {
        monitoringApi.deleteTourist(tourist.id).then(() => {
            const index = tourists.value.findIndex(t => t["id"] === tourist.id);
            if (index !== -1) tourists.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Loads tourists from infrastructure and updates the application state.
     * @returns {void}
     */


    /**
     * Finds a sign entity by identifier.
     * @param {number|string} id - Sign identifier.
     * @returns {Sign|undefined} Matching sign, if available.
     */
    function getSignById(id) {
        let idNum = parseInt(id);
        return signs.value.find(sign => sign["id"] === idNum);
    }

    /**
     * Creates a sign through infrastructure and appends it to the local state.
     * @param {Sign} sign - Sign entity to persist.
     * @returns {void}
     */
    function addSign(sign) {
        monitoringApi.createSign(sign).then(response => {
            const resource = response.data;
            const newSign = SignAssembler.toEntityFromResource(resource);
            signs.value.push(newSign);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Updates an existing sign and synchronizes local state.
     * @param {Sign} sign - Sign entity with updated data.
     * @returns {void}
     */
    function updateSign(sign) {
        monitoringApi.updateSign(sign).then(response => {
            const resource = response.data;
            const updatedSign = SignAssembler.toEntityFromResource(resource);
            const index = signs.value.findIndex(c => c["id"] === updatedSign.id);
            if (index !== -1) signs.value[index] = updatedSign;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    /**
     * Deletes a sign and removes it from the local state.
     * @param {Sign} sign - Sign entity to remove.
     * @returns {void}
     */
    function deleteSign(sign) {
        monitoringApi.deleteSign(sign.id).then(() => {
            const index = signs.value.findIndex(c => c["id"] === sign.id);
            if (index !== -1) signs.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    const alerts = ref([]);
    const alertsLoaded = ref(false);
    const alertsCount = computed(() => {
        return alertsLoaded ? alerts.value.length : 0;
    });
    function fetchAlerts() {
        monitoringApi.getAlerts().then(response => {
            alerts.value = AlertAssembler.toEntitiesFromResponse(response);
            alertsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function getAlertById(id) {
        let idNum = parseInt(id);
        return alerts.value.find(alert => alert["id"] === idNum);
    }
    function updateAlert(alert) {
        monitoringApi.updateAlert(alert).then(response => {
            const resource = response.data;
            const updatedAlert = AlertAssembler.toEntityFromResource(resource);
            const index = alerts.value.findIndex(t => t["id"] === updatedAlert.id);
            if (index !== -1) alerts.value[index] = updatedAlert;
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function deleteAlert(alert) {
        monitoringApi.deleteAlert(alert.id).then(() => {
            const index = alerts.value.findIndex(t => t["id"] === alert.id);
            if (index !== -1) alerts.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }
    function addAlert(alert) {
        monitoringApi.createAlert(alert).then(response => {
            const resource = response.data;
            const newAlert = AlertAssembler.toEntityFromResource(resource);
            alerts.value.push(newAlert);
        }).catch(error => {
            errors.value.push(error);
        });
    }


    return {
        signs,
        tourists,
        errors,
        signsLoaded,
        touristsLoaded,
        signsCount,
        touristsCount,
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
        alertsLoaded,
        alerts,
        alertsCount,
        fetchAlerts
    }
});

export default useMonitoringStore;