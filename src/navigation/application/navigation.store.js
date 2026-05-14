import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { NavigationApi } from "../infrastructure/navigation-api.js";
import { ExperienceAssembler } from "../infrastructure/experiencie.assembler.js";
import { ExpeditionAssembler } from "../infrastructure/expedition.assembler.js";

const navigationApi = new NavigationApi();

const useNavigationStore = defineStore(
    'navigation',
    () => {
        const currentExpedition = ref(null);

        const progress = ref(false);

        const experiences = ref([]);

        const weather = ref(null);

        const errors = ref([]);

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
            navigationApi.getExpedition(id)
                .then(response => {
                    currentExpedition.value = ExpeditionAssembler.toEntitiesFromResponse(response);
                    //toursLoaded.value = true;
                })
                .catch(error => {
                    errors.value.push(error);
                })
        }
    }
)
