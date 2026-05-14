import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const toursEndpointPath = import.meta.env.VITE_TOUR_ENDPOINT_PATH;
const touristsEndpointPath = import.meta.env.VITE_TOURIST_ENDPOINT_PATH;
const checkpointsEndpointPath = import.meta.env.VITE_CHECKPOINTS_ENDPOINT_PATH;

/**
 * Infrastructure adapter for Tour Management HTTP endpoints.
 *
 * @class TourManagementApi
 * @extends BaseApi
 */
export class TourManagementApi extends BaseApi {

    /** @type {BaseEndpoint} */
    #toursEndpoint;

    /** @type {BaseEndpoint} */
    #touristsEndpoint;

    /** @type {BaseEndpoint} */
    #checkpointsEndpoint;

    /**
     * Creates endpoint clients for tours and checkpoints resources.
     */
    constructor() {
        super();

        this.#toursEndpoint =
            new BaseEndpoint(this, toursEndpointPath);

        this.#touristsEndpoint =
            new BaseEndpoint(this, touristsEndpointPath);

        this.#checkpointsEndpoint =
            new BaseEndpoint(this, checkpointsEndpointPath);
    }

    /**
     * Retrieves tour resources.
     * @returns {Promise}
     */
    getTours() {
        return this.#toursEndpoint.getAll();
    }

    /**
     * Retrieves tourist resources.
     * @returns {Promise}
     */
    getTourists() {
        return this.#touristsEndpoint.getAll();
    }

    /**
     * Retrieves one tour resource by identifier.
     * @param {number|string} id
     * @returns {Promise}
     */
    getTourById(id) {
        return this.#toursEndpoint.getById(id);
    }

    /**
     * Persists a new tour resource.
     * @param {Object} resource
     * @returns {Promise}
     */
    createTour(resource) {
        return this.#toursEndpoint.create(resource);
    }

    /**
     * Updates an existing tour resource.
     * @param {number|string} id
     * @param {Object} resource
     * @returns {Promise}
     */
    updateTour(id, resource) {
        return this.#toursEndpoint.update(id, resource);
    }

    /**
     * Deletes one tour resource by identifier.
     * @param {number|string} id
     * @returns {Promise}
     */
    deleteTour(id) {
        return this.#toursEndpoint.delete(id);
    }

    /**
     * Assigns a tourist to a tour.
     * @param {number|string} tourId
     * @param {Object} resource
     * @returns {Promise}
     */
    assignTourist(tourId, resource) {
        return this.#toursEndpoint.update(tourId, resource);
    }

    /**
     * Updates a tourist resource.
     * @param {number|string} touristId
     * @param {Object} resource
     * @returns {Promise}
     */
    updateTourist(touristId, resource) {
        return this.#touristsEndpoint.update(touristId, resource);
    }
}