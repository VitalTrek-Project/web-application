import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const expeditionsEndpointPath = import.meta.env.VITE_EXPEDITIONS_ENDPOINT_PATH;
const experiencesEndpointPath = import.meta.env.VITE_EXPERIENCES_ENDPOINT_PATH;
const weatherEndpointPath = import.meta.env.VITE_WEATHER_ENDPOINT_PATH;

/**
 * Infrastructure adapter for Navigation Management HTTP endpoints.
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
     * Creates endpoints.
     */

    constructor() {
        super();
        this.#expeditionsEndpoint = new BaseEndpoint(this, expeditionsEndpointPath);
        this.#experiencesEndpoint = new BaseEndpoint(this, experiencesEndpointPath);
        this.#weatherEndpoint = new BaseEndpoint(this, weatherEndpointPath);
    }

    /**
     * Retrieves one navigation resource by identifier.
     * @param {number|string} id
     * @returns {Promise}
     */

    getExpedition(id) {
        return this.#expeditionsEndpoint.getById(id);
    }

    /**
     * Starts an expedition by identifier.
     * @param {number|string} tourId
     * @returns {Promise}
     */

    startExpedition(tourId) {
        return this.#expeditionsEndpoint.start(tourId);
    }

    /**
     * Finish an expedition by identifier.
     * @param {number|string} id
     * @returns {Promise}
     */

    finishExpedition(id) {
        return this.#expeditionsEndpoint.finish(id);
    }

    /**
     * Creates one experience
     * @returns {Promise}
     */

    createExperience(resource) {
        return this.#experiencesEndpoint.create(resource);
    }

    /**
     * Retrieves one navigation resource by identifier.
     * @param {number|string} latitude
     * @param {number|string} longitude
     * @returns {Promise}
     */

    getWeather(latitude, longitude) {
        return this.#weatherEndpoint.getById(`${latitude},${longitude}`);
    }
}
