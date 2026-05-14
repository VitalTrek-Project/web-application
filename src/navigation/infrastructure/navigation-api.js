import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const expeditionsEndpointPath = import.meta.env.VITE_EXPEDITIONS_ENDPOINT_PATH;
const experiencesEndpointPath = import.meta.env.VITE_EXPERIENCES_ENDPOINT_PATH;
const weatherEndpointPath = import.meta.env.VITE_WEATHER_ENDPOINT_PATH;

/**
 * Infrastructure adapter for Navigation & Exploration HTTP endpoints.
 *
 * @class NavigationApi
 * @extends BaseApi
 */
export class NavigationApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #expeditionsEndpoint;

    /** @type {BaseEndpoint} */
    #experiencesEndpoint;

    /** @type {BaseEndpoint} */
    #weatherEndpoint;

    /**
     * Creates endpoint clients for expeditions, experiences and weather resources.
     */
    constructor() {
        super();
        this.#expeditionsEndpoint = new BaseEndpoint(this, expeditionsEndpointPath);
        this.#experiencesEndpoint = new BaseEndpoint(this, experiencesEndpointPath);
        this.#weatherEndpoint     = new BaseEndpoint(this, weatherEndpointPath);
    }

    /**
     * Retrieves one expedition resource by identifier.
     * @param {number|string} id
     * @returns {Promise}
     */
    getExpedition(id) {
        return this.#expeditionsEndpoint.getById(id);
    }

    /**
     * Starts a new expedition for the given tour by creating an expedition resource
     * with status in_progress. MockAPI does not support custom action routes,
     * so this is modelled as a POST to the expeditions collection.
     * @param {number|string} tourId
     * @returns {Promise}
     */
    startExpedition(tourId) {
        return this.#expeditionsEndpoint.create({
            tourId,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            finishedAt: null
        });
    }

    /**
     * Finishes an expedition by updating its status to finished.
     * MockAPI does not support custom action routes,
     * so this is modelled as a PUT to the expeditions resource.
     * @param {number|string} id
     * @returns {Promise}
     */
    finishExpedition(id) {
        return this.#expeditionsEndpoint.update(id, {
            status: 'finished',
            finishedAt: new Date().toISOString()
        });
    }

    /**
     * Persists a new experience resource.
     * @param {Object} resource
     * @returns {Promise}
     */
    createExperience(resource) {
        return this.#experiencesEndpoint.create(resource);
    }

    /**
     * Retrieves weather resource. Latitude and longitude are kept as parameters
     * to match the diagram contract; filtering by coordinates is handled in the store.
     * MockAPI does not support coordinate-based lookup so all records are fetched.
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Promise}
     */
    getWeather(latitude, longitude) {
        return this.#weatherEndpoint.getAll();
    }
}
