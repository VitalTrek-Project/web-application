import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {MonitoringApi} from "../infrastructure/monitoring-api.js";
import {SignAssembler} from "../infrastructure/sign.assembler.js";

import {Sign} from "../domain/model/sign.entity.js";


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
     * List of tutorial entities.
     * @type {import('vue').Ref<Tutorial[]>}
     */

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
     * Whether tutorials have been loaded from the API.
     * @type {import('vue').Ref<boolean>}
     */

    /**
     * Number of loaded signs.
     * @type {import('vue').ComputedRef<number>}
     */
    const signsCount = computed(() => {
        return signsLoaded ? signs.value.length : 0;
    });
    /**
     * Number of loaded tutorials.
     * @type {import('vue').ComputedRef<number>}
     */


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

    /**
     * Loads tutorials from infrastructure and updates the application state.
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




    return {
        signs,
      
        errors,
        signsLoaded,
        
        signsCount,
        
        fetchSigns,
     
        getSignById,
        addSign,
        updateSign,
        deleteSign,
      
    }
});

export default useMonitoringStore;