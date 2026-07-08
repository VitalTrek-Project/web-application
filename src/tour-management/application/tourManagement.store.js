import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { TourManagementApi } from "../infrastructure/tour-management-api.js";
import { TourAssembler } from "../infrastructure/tour.assembler.js";
import useIamStore from "../../iam/application/iam.store.js";
import { getLocalAgencyId } from "../../shared/infrastructure/local-identity.js";

const tourManagementApi = new TourManagementApi();

function normalizeAssignmentIds(data) {
    if (!Array.isArray(data)) return [];
    return data
        .map((item) => {
            if (item == null) return null;
            if (typeof item === "string" || typeof item === "number") return String(item);
            return String(item.touristId ?? item.id ?? "");
        })
        .filter(Boolean);
}

function toCreateTourPayload(tour) {
    const iam = useIamStore();
    return {
        agencyId: tour.agencyId || iam.currentAgencyId,
        title: tour.title,
        description: tour.description,
        difficulty: tour.difficulty,
        capacity: Number(tour.capacity ?? 1),
        estimatedDurationMinutes: Number(tour.estimatedDurationMinutes ?? 0),
        distanceKm: Number(tour.distanceKm ?? 0)
    };
}

function toUpdateTourPayload(tour) {
    return {
        title: tour.title,
        description: tour.description
    };
}

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

        const toursCount = computed(() =>
            toursLoaded.value ? tours.value.length : 0
        );

        const availableTours = computed(() =>
            tours.value.filter((tour) =>
                ['available', 'published', 'Available', 'Published'].includes(tour.status)
            )
        );

        async function hydrateAssignments(tourList) {
            const hydrated = await Promise.all(
                tourList.map(async (tour) => {
                    try {
                        const response = await tourManagementApi.getAssignments(tour.id);
                        tour.assignedTourists = normalizeAssignmentIds(response.data);
                    } catch {
                        tour.assignedTourists = Array.isArray(tour.assignedTourists)
                            ? tour.assignedTourists
                            : [];
                    }
                    return tour;
                })
            );
            return hydrated;
        }

        async function fetchTours({hydrate = true, searchTerm = ""} = {}) {
            const iam = useIamStore();
            const agencyId = iam.currentAgencyId || getLocalAgencyId();
            const query = String(searchTerm ?? "").trim();
            // Platform search rejects empty term; catalog browse uses a broad matcher.
            const CATALOG_SEARCH_TERM = "a";

            try {
                let response = null;

                if (agencyId && !query) {
                    response = await tourManagementApi.getToursByAgency(agencyId);
                } else {
                    response = await tourManagementApi.searchTours(query || CATALOG_SEARCH_TERM);
                }

                let list = TourAssembler.toEntitiesFromResponse(response);
                if (hydrate) {
                    list = await hydrateAssignments(list);
                }
                tours.value = list;
                toursLoaded.value = true;
                return list;
            } catch (error) {
                errors.value.push(error);
                tours.value = [];
                toursLoaded.value = true;
                return tours.value;
            }
        }

        async function fetchTourists() {
            try {
                const response = await tourManagementApi.getUsers();
                const resources = Array.isArray(response.data)
                    ? response.data
                    : (response.data?.users ?? []);
                tourists.value = resources
                    .filter((user) => String(user.role ?? '').toLowerCase() === 'tourist')
                    .map((user) => ({
                        id: user.id,
                        name: user.username,
                        username: user.username,
                        role: user.role
                    }));
                touristsLoaded.value = true;
                return tourists.value;
            } catch (error) {
                errors.value.push(error);
                throw error;
            }
        }

        function fetchTourById(id) {
            return tourManagementApi.getTourById(id)
                .then(async (response) => {
                    const tour = TourAssembler.toEntityFromResource(response.data);
                    try {
                        const assignments = await tourManagementApi.getAssignments(id);
                        tour.assignedTourists = normalizeAssignmentIds(assignments.data);
                    } catch {
                        tour.assignedTourists = [];
                    }
                    selectedTour.value = tour;
                    return selectedTour.value;
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function addTour(tour) {
            return tourManagementApi.createTour(toCreateTourPayload(tour))
                .then((response) => {
                    const newTour = TourAssembler.toEntityFromResource(response.data);
                    newTour.assignedTourists = [];
                    newTour.checkpoints = tour.checkpoints ?? [];
                    tours.value.push(newTour);
                    return newTour;
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function updateTour(tour) {
            return tourManagementApi.updateTour(tour.id, toUpdateTourPayload(tour))
                .then((response) => {
                    const updatedTour = TourAssembler.toEntityFromResource(
                        response.data ?? {...tour, ...toUpdateTourPayload(tour)}
                    );
                    updatedTour.assignedTourists = tour.assignedTourists ?? [];
                    updatedTour.checkpoints = tour.checkpoints ?? [];
                    const index = tours.value.findIndex(
                        (t) => String(t.id) === String(updatedTour.id)
                    );
                    if (index !== -1) {
                        tours.value[index] = updatedTour;
                    } else {
                        tours.value.push(updatedTour);
                    }
                    selectedTour.value = updatedTour;
                    return updatedTour;
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function deleteTour(id) {
            return tourManagementApi.deleteTour(id)
                .then(() => {
                    const index = tours.value.findIndex(
                        (t) => String(t.id) === String(id)
                    );
                    if (index !== -1) tours.value.splice(index, 1);
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function duplicateTour(id) {
            return tourManagementApi.duplicateTour(id)
                .then(async (response) => {
                    const duplicated = TourAssembler.toEntityFromResource(response.data);
                    duplicated.assignedTourists = [];
                    tours.value.push(duplicated);
                    return duplicated;
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function assignTourist(tourId, touristId) {
            if (!tourId || !touristId) {
                return Promise.reject(new Error('Tour id and tourist id are required.'));
            }

            return tourManagementApi.assignTourist(tourId, touristId)
                .then(() => {
                    const index = tours.value.findIndex(
                        (item) => String(item.id) === String(tourId)
                    );
                    if (index !== -1) {
                        const current = Array.isArray(tours.value[index].assignedTourists)
                            ? tours.value[index].assignedTourists
                            : [];
                        if (!current.some((id) => String(id) === String(touristId))) {
                            tours.value[index] = {
                                ...tours.value[index],
                                assignedTourists: [...current, touristId]
                            };
                        }
                    }
                    if (!assignedTourists.value.some((id) => String(id) === String(touristId))) {
                        assignedTourists.value.push(touristId);
                    }
                })
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function unassignTourist(tourId, touristId) {
            if (!tourId || !touristId) {
                return Promise.reject(new Error('Tour id and tourist id are required.'));
            }

            return tourManagementApi.unassignTourist(tourId, touristId)
                .then(() => {
                    const index = tours.value.findIndex(
                        (item) => String(item.id) === String(tourId)
                    );
                    if (index !== -1) {
                        const current = Array.isArray(tours.value[index].assignedTourists)
                            ? tours.value[index].assignedTourists
                            : [];
                        tours.value[index] = {
                            ...tours.value[index],
                            assignedTourists: current.filter(
                                (id) => String(id) !== String(touristId)
                            )
                        };
                    }
                    assignedTourists.value = assignedTourists.value.filter(
                        (id) => String(id) !== String(touristId)
                    );
                })
                .catch((error) => {
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
                .then(() => assignTourist(newTourId, touristId))
                .catch((error) => {
                    errors.value.push(error);
                    throw error;
                });
        }

        function searchTours(term) {
            const normalizedTerm = String(term ?? '').trim().toLowerCase();
            if (!normalizedTerm) return tours.value;

            return tours.value.filter((tour) => {
                const searchableFields = [
                    tour.id,
                    tour.agencyId,
                    tour.title,
                    tour.description,
                    tour.difficulty,
                    tour.status,
                    tour.capacity
                ];
                return searchableFields.some((field) =>
                    String(field ?? '').toLowerCase().includes(normalizedTerm)
                );
            });
        }

        return {
            tours,
            tourists,
            selectedTour,
            assignedTourists,
            errors,
            toursLoaded,
            touristsLoaded,
            toursCount,
            availableTours,
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
