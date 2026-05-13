import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { TourManagementApi } from "../infrastructure/tour-management-api.js";
import { TourAssembler } from "../infrastructure/tour.assembler.js";
import {Tour} from "../domain/model/tour.entity.js";

const tourManagementApi = new TourManagementApi();

const useTourManagementStore = defineStore(
    'tour-management',
    () => {

        const tours = ref([]);

        const selectedTour = ref(null);

        const assignedTourists = ref([]);

        const errors = ref([]);

        const toursLoaded = ref(false);

        /**
         * COMPUTED
         */

        const toursCount = computed(() => {
            return toursLoaded.value
                ? tours.value.length
                : 0;
        });

        const availableTours = computed(() => {

            return tours.value.filter(
                tour => tour.status === 'available'
            );
        });

        /**
         * METHODS
         */

        function fetchTours() {

            tourManagementApi.getTours()

                .then(response => {

                    tours.value =
                        TourAssembler.toEntitiesFromResponse(response);

                    toursLoaded.value = true;
                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function fetchTourById(id) {

            tourManagementApi.getTourById(id)

                .then(response => {

                    selectedTour.value =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );
                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function addTour(tour) {

            tourManagementApi.createTour(tour)

                .then(response => {

                    const newTour =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );

                    tours.value.push(newTour);

                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function updateTour(tour) {

            tourManagementApi.updateTour(
                tour.id,
                tour
            )

                .then(response => {

                    const updatedTour =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );

                    const index =
                        tours.value.findIndex(
                            t => t.id === updatedTour.id
                        );

                    if (index !== -1) {

                        tours.value[index] = updatedTour;
                    }
                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function deleteTour(id) {

            tourManagementApi.deleteTour(id)

                .then(() => {

                    const index =
                        tours.value.findIndex(
                            t => t.id === id
                        );

                    if (index !== -1) {

                        tours.value.splice(index, 1);
                    }
                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function duplicateTour(id) {

            const tour =
                tours.value.find(t => t.id === id);

            if (!tour) return;

            const duplicatedTour = {

                ...tour,

                id: null,

                title: `${tour.title} Copy`
            };

            addTour(duplicatedTour);
        }

        function assignTourist(tourId, touristId) {

            tourManagementApi.assignTourist(
                tourId,
                touristId
            )

                .then(() => {

                    assignedTourists.value.push(
                        touristId
                    );
                })

                .catch(error => {

                    errors.value.push(error);

                });
        }

        function unassignTourist(tourId, touristId) {

            assignedTourists.value =
                assignedTourists.value.filter(
                    id => id !== touristId
                );
        }

        function searchTours(term) {

            return tours.value.filter(tour =>

                tour.title
                    .toLowerCase()
                    .includes(term.toLowerCase())
            );
        }

        return {

            // state
            tours,
            selectedTour,
            assignedTourists,
            errors,
            toursLoaded,

            // computed
            toursCount,
            availableTours,

            // methods
            fetchTours,
            fetchTourById,
            addTour,
            updateTour,
            deleteTour,
            duplicateTour,
            assignTourist,
            unassignTourist,
            searchTours
        };
    }
);

export default useTourManagementStore;