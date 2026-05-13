import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const signsEndpointPath = import.meta.env.VITE_SIGNS_ENDPOINT_PATH;
//const tutorialsEndpointPath     = import.meta.env.VITE_TUTORIALS_ENDPOINT_PATH;

/**
 * Infrastructure adapter for Monitoring HTTP endpoints.
 *
 * @class MonitoringApi
 * @extends BaseApi
 */
export class MonitoringApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #signsEndpoint;
    /** @type {BaseEndpoint} */
    //#tutorialsEndpoint;

    /** Creates endpoint clients for signs and tutorials resources. */
    constructor() {
        super();
        this.#signsEndpoint = new BaseEndpoint(this, signsEndpointPath);
        //this.#tutorialsEndpoint = new BaseEndpoint(this, tutorialsEndpointPath);
    }

    /**
     * Retrieves sign resources.
     * @returns {Promise<import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{signs:Array<{id: number|string, name: string}>}>>} HTTP response with sign resources.
     */
    getSigns() {
        return this.#signsEndpoint.getAll();
    }

    /**
     * Retrieves one sign resource by identifier.
     * @param {number|string} id - Sign identifier.
     * @returns {Promise<import('axios').AxiosResponse<{id: number|string, name: string}>>} HTTP response with the requested sign resource.
     */
    getSignById(id) {
        return this.#signsEndpoint.getById(id);
    }

    /**
     * Persists a new sign resource.
     * @param {{id: number|string, name: string}|import('../domain/model/sign.entity.js').Sign} resource - Sign data to persist.
     * @returns {Promise<import('axios').AxiosResponse<{id: number|string, name: string}>>} HTTP response with the created sign resource.
     */
    createSign(resource) {
        return this.#signsEndpoint.create(resource);
    }

    /**
     * Updates an existing sign resource.
     * @param {{id: number|string, name: string}|import('../domain/model/sign.entity.js').Sign} resource - Sign data including its identifier.
     * @returns {Promise<import('axios').AxiosResponse<{id: number|string, name: string}>>} HTTP response with the updated sign resource.
     */
    updateSign(resource) {
        return this.#signsEndpoint.update(resource.id, resource);
    }

    /**
     * Deletes one sign resource by identifier.
     * @param {number|string} id - Sign identifier.
     * @returns {Promise<import('axios').AxiosResponse<Object>>} HTTP response from delete operation.
     */
    deleteSign(id) {
        return this.#signsEndpoint.delete(id);
    }

}