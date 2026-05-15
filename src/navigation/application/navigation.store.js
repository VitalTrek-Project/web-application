import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { NavigationApi } from "../infrastructure/navigation-api.js";
import { ExperienceAssembler } from "../infrastructure/experience.assembler.js";
import { ExpeditionAssembler } from "../infrastructure/expedition.assembler.js";

const navigationApi = new NavigationApi();

export const useNavigationStore = defineStore(
    "navigation",
    () => {


        /** @type {import('vue').Ref<import('../domain/expedition.entity.js').Expedition|null>} */
        const currentExpedition = ref(null);

        /** @type {import('vue').Ref<import('../domain/progress.entity.js').Progress|null>} */
        const progress = ref(null);

        /** @type {import('vue').Ref<import('../domain/experience.entity.js').TouristExperience[]>} */
        const experiences = ref([]);

        /** @type {import('vue').Ref<import('../domain/weather.entity.js').Weather|null>} */
        const weather = ref(null);

        /** @type {import('vue').Ref<any[]>} */
        const errors = ref([]);

        const expeditionLoaded = ref(false);

        /**
         * Returns the expedition progress as a percentage (0–100).
         * Uses Progress.completedCheckpoints and Progress.totalCheckpoints
         * as defined in the domain model.
         */
        const progressPercentage = computed(() => {
            if (!progress.value) return 0;
            const { totalCheckpoints, completedCheckpoints } = progress.value;
            return totalCheckpoints > 0
                ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
                : 0;
        });


        /**
         * Fetches one expedition by id and stores it.
         * @param {number|string} id
         * @returns {Promise}
         */
        function fetchExpedition(id) {
            return navigationApi.getExpedition(id)
                .then(response => {
                    currentExpedition.value =
                        ExpeditionAssembler.toEntityFromResource(response.data);
                    expeditionLoaded.value = true;
                    return currentExpedition.value;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        /**
         * Creates a new expedition for the given tour and stores it.
         * @param {number|string} tourId
         * @returns {Promise}
         */
        function startExpedition(tourId) {
            return navigationApi.startExpedition(tourId)
                .then(response => {
                    currentExpedition.value =
                        ExpeditionAssembler.toEntityFromResource(response.data);
                    expeditionLoaded.value = true;
                    return currentExpedition.value;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        /**
         * Finishes the current expedition and updates the stored entity.
         * @param {number|string} id
         * @returns {Promise}
         */
        function finishExpedition(id) {
            return navigationApi.finishExpedition(id)
                .then(response => {
                    currentExpedition.value =
                        ExpeditionAssembler.toEntityFromResource(response.data);
                    return currentExpedition.value;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        /**
         * Persists a new tourist experience and appends it to the local list.
         * @param {Object} experience
         * @returns {Promise}
         */
        function recordExperience(experience) {
            return navigationApi.createExperience(experience)
                .then(response => {
                    const newExperience =
                        ExperienceAssembler.toEntityFromResource(response.data);
                    experiences.value.push(newExperience);
                    return newExperience;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        /**
         * Fetches weather data for the given location.
         * MockAPI does not support location-based queries, so all records
         * are fetched and the first match by location name is selected.
         * @param {string} location
         * @returns {Promise}
         */
        function fetchWeather(location) {
            return navigationApi.getWeather(location)
                .then(response => {
                    const records = Array.isArray(response.data)
                        ? response.data
                        : [response.data];

                    const match = records.find(
                        w => w.location === location
                    ) ?? records[0] ?? null;

                    weather.value = match;
                    return weather.value;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        /**
         * Registers a checkpoint scan for the current expedition.
         * @param {number|string} checkpointId
         */
        function registerCheckpoint(checkpointId) {
            console.log("Checkpoint registered:", checkpointId);
        }

        /**
         * Downloads the offline route for the given tour.
         * @param {number|string} tourId
         */
        function downloadOfflineRoute(tourId) {
            console.log("Download offline route:", tourId);
        }

        return {
            // state
            currentExpedition,
            progress,
            experiences,
            weather,
            errors,
            expeditionLoaded,

            // computed
            progressPercentage,

            // methods
            fetchExpedition,
            startExpedition,
            finishExpedition,
            recordExperience,
            fetchWeather,
            registerCheckpoint,
            downloadOfflineRoute
        };
    }
);

export default useNavigationStore;
