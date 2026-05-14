import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { NavigationApi } from "../infrastructure/navigation-api.js";
import { ExperienceAssembler } from "../infrastructure/experiencie.assembler.js";
import { ExpeditionAssembler } from "../infrastructure/expedition.assembler.js";

const navigationApi = new NavigationApi();

export const useNavigationStore = defineStore(
    "navigation",
    () => {
        const currentExpedition = ref(null);
        const progress = ref(false);
        const experiences = ref([]);
        const weather = ref(null);
        const errors = ref([]);

        const expeditionLoaded = ref(false);

        /**
         * COMPUTED
         */

        const progressPercentage = computed(() => {
            if (!progress.value) {
                return 0;
            }
            const { total, completed } = progress.value;
            return total > 0 ? (completed / total) * 100 : 0;
        });

        /**
         * METHODS
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

        function startExpedition(tourId) {
            return navigationApi.startExpedition(tourId)
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function finishExpedition(id) {
            return navigationApi.finishExpedition(id)
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

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

        function fetchWeather(latitude, longitude) {

            return navigationApi.getWeather(latitude, longitude)

                .then(response => {

                    weather.value = response.data;

                    return weather.value;
                })

                .catch(error => {

                    errors.value.push(error);

                    throw error;
                });
        }

        function registerCheckpoint(checkpointId) {
            console.log("Checkpoint:", checkpointId);
        }

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
