import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const toursEndpointPath = '/tours';
const checkpointsEndpointPath = '/checkpoints';

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
    #checkpointsEndpoint;

    /**
     * Creates endpoint clients for tours and checkpoints resources.
     */
    constructor() {
        super();

        this.#toursEndpoint =
            new BaseEndpoint(this, toursEndpointPath);

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
     * @param {number|string} touristId
     * @returns {Promise}
     */
    assignTourist(tourId, touristId) {

        return this.#toursEndpoint.update(tourId, {
            touristId
        });
    }
}