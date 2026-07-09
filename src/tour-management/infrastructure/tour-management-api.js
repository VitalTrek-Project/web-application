import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const toursEndpointPath = import.meta.env.VITE_TOUR_ENDPOINT_PATH || '/tours';
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH || '/users';

/**
 * Infrastructure adapter for Tour Management HTTP endpoints against VitalTrek Platform.
 *
 * @class TourManagementApi
 * @extends BaseApi
 */
export class TourManagementApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #toursEndpoint;
    /** @type {BaseEndpoint} */
    #usersEndpoint;

    constructor() {
        super();
        this.#toursEndpoint = new BaseEndpoint(this, toursEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Lists tours for an agency (platform source of truth).
     * Backend route is `GET /tours?agencyId=...`, not a sub-path.
     * @param {string} agencyId
     */
    getToursByAgency(agencyId) {
        return this.http.get(toursEndpointPath, {params: {agencyId}});
    }

    /**
     * Searches tours by free-text term.
     * Backend route is `GET /tours?term=...`, not a sub-path.
     * @param {string} term
     */
    searchTours(term) {
        const normalized = String(term ?? "").trim();
        if (!normalized) {
            return Promise.reject(new Error("Search term is required."));
        }
        return this.http.get(toursEndpointPath, {params: {term: normalized}});
    }

    getTourById(id) {
        return this.#toursEndpoint.getById(id);
    }

    /**
     * @param {Object} resource - CreateTourResource payload
     */
    createTour(resource) {
        return this.#toursEndpoint.create(resource);
    }

    /**
     * @param {number|string} id
     * @param {Object} resource - UpdateTourResource payload ({ title, description })
     */
    updateTour(id, resource) {
        return this.#toursEndpoint.update(id, resource);
    }

    deleteTour(id) {
        return this.#toursEndpoint.delete(id);
    }

    duplicateTour(tourId) {
        return this.http.post(`${toursEndpointPath}/${tourId}/copies`);
    }

    getAssignments(tourId) {
        return this.http.get(`${toursEndpointPath}/${tourId}/assignments`);
    }

    /**
     * @param {number|string} tourId
     * @param {string} touristId
     */
    assignTourist(tourId, touristId) {
        return this.http.post(`${toursEndpointPath}/${tourId}/assignments`, {touristId});
    }

    /**
     * @param {number|string} tourId
     * @param {string} touristId
     */
    unassignTourist(tourId, touristId) {
        return this.http.delete(`${toursEndpointPath}/${tourId}/assignments/${touristId}`);
    }

    /**
     * Platform users (tourists filtered in the store by role).
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}
