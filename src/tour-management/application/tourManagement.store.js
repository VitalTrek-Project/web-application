import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { TourManagementApi } from "../infrastructure/tour-management-api.js";
import { TourAssembler } from "../infrastructure/tour.assembler.js";

const tourManagementApi = new TourManagementApi();

const useTourManagementStore = defineStore(
    'tour-management',
    () => {

        const tours = ref([]);

        const tourists = ref([]);

        const selectedTour = ref(null);

        const assignedTourists = ref([]);

        const errors = ref([]);

        const toursLoaded = ref(false);

        const touristsLoaded = ref(false);

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
                    tours.value = TourAssembler.toEntitiesFromResponse(response);
                    toursLoaded.value = true;
                })
                .catch(error => {
                    errors.value.push(error);
                })
        }

        function fetchTourists() {

            return tourManagementApi.getTourists()

                .then(response => {

                    tourists.value = response.data instanceof Array
                        ? response.data
                        : [response.data];

                    touristsLoaded.value = true;

                    return tourists.value;
                })

                .catch(error => {

                    errors.value.push(error);

                    throw error;
                });
        }

        function fetchTourById(id) {
            return tourManagementApi.getTourById(id)
                .then(response => {
                    selectedTour.value =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );
                    return selectedTour.value;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function addTour(tour) {

            return tourManagementApi.createTour(tour)
                .then(response => {
                    const newTour =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );
                    tours.value.push(newTour);
                    return newTour;
                })

                .catch(error => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function updateTour(tour) {
            return tourManagementApi.updateTour(tour.id, tour)
                .then(response => {
                    const updatedTour =
                        TourAssembler.toEntityFromResource(
                            response.data
                        );
                    const index =
                        tours.value.findIndex(
                            t => String(t.id) === String(updatedTour.id)
                        );
                    if (index !== -1) {
                        tours.value[index] = updatedTour;
                    } else {
                        tours.value.push(updatedTour);
                    }
                    selectedTour.value = updatedTour;
                    return updatedTour;
                })
                .catch(error => {
                    errors.value.push(error);
                    throw error;
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

            if (!tourId || !touristId) {

                return Promise.reject(
                    new Error('Tour id and tourist id are required.')
                );
            }

            const tour =
                tours.value.find(
                    item => String(item.id) === String(tourId)
                );

            if (!tour) {

                return Promise.reject(
                    new Error('Tour not found.')
                );
            }

            const currentAssignedTourists =
                Array.isArray(tour.assignedTourists)
                    ? tour.assignedTourists
                    : [];

            const alreadyAssigned =
                currentAssignedTourists.some(
                    id => String(id) === String(touristId)
                );

            if (alreadyAssigned) {

                return Promise.resolve(tour);
            }

            const updatedTour = {
                ...tour,
                assignedTourists: [
                    ...currentAssignedTourists,
                    touristId
                ]
            };

            return tourManagementApi.assignTourist(
                tourId,
                updatedTour
            )

                .then(response => {

                    const index =
                        tours.value.findIndex(
                            item => String(item.id) === String(tourId)
                        );

                    if (index !== -1) {

                        tours.value[index] = {
                            ...tours.value[index],
                            assignedTourists: updatedTour.assignedTourists
                        };
                    }

                    if (
                        !assignedTourists.value.some(
                            id => String(id) === String(touristId)
                        )
                    ) {
                        assignedTourists.value.push(touristId);
                    }

                    return response.data;
                })

                .catch(error => {

                    errors.value.push(error);

                    throw error;
                });
        }

        function unassignTourist(tourId, touristId) {

            if (!tourId || !touristId) {

                return Promise.reject(
                    new Error('Tour id and tourist id are required.')
                );
            }

            const tour =
                tours.value.find(
                    item => String(item.id) === String(tourId)
                );

            if (!tour) {

                return Promise.reject(
                    new Error('Tour not found.')
                );
            }

            const currentAssignedTourists =
                Array.isArray(tour.assignedTourists)
                    ? tour.assignedTourists
                    : [];

            const updatedTour = {
                ...tour,
                assignedTourists: currentAssignedTourists.filter(
                    id => String(id) !== String(touristId)
                )
            };

            return tourManagementApi.assignTourist(
                tourId,
                updatedTour
            )

                .then(response => {

                    const index =
                        tours.value.findIndex(
                            item => String(item.id) === String(tourId)
                        );

                    if (index !== -1) {

                        tours.value[index] = {
                            ...tours.value[index],
                            assignedTourists: updatedTour.assignedTourists
                        };
                    }

                    assignedTourists.value =
                        assignedTourists.value.filter(
                            id => String(id) !== String(touristId)
                        );

                    return response.data;
                })

                .catch(error => {

                    errors.value.push(error);

                    throw error;
                });
        }

        function changeTouristTour(currentTourId, newTourId, touristId) {

            if (!currentTourId || !newTourId || !touristId) {

                return Promise.reject(
                    new Error('Current tour id, new tour id and tourist id are required.')
                );
            }

            return unassignTourist(currentTourId, touristId)

                .then(() =>
                    assignTourist(newTourId, touristId)
                )

                .catch(error => {

                    errors.value.push(error);

                    throw error;
                });
        }

        function searchTours(term) {

            const normalizedTerm =
                String(term ?? '')
                    .trim()
                    .toLowerCase();

            if (!normalizedTerm) {

                return tours.value;
            }

            return tours.value.filter(tour => {

                const searchableFields = [
                    tour.id,
                    tour.agencyId,
                    tour.title,
                    tour.description,
                    tour.difficulty,
                    tour.status,
                    tour.capacity
                ];

                return searchableFields.some(field =>
                    String(field ?? '')
                        .toLowerCase()
                        .includes(normalizedTerm)
                );
            });
        }

        return {

            // state
            tours,
            tourists,
            selectedTour,
            assignedTourists,
            errors,
            toursLoaded,
            touristsLoaded,

            // computed
            toursCount,
            availableTours,

            // methods
            fetchTours,
            fetchTourists,
            fetchTourById,
            addTour,
            updateTour,
            deleteTour,
            duplicateTour,
            assignTourist,
            unassignTourist,
            changeTouristTour,
            searchTours
        };
    }
);

export default useTourManagementStore;