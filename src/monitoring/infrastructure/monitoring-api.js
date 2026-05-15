import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const signsEndpointPath = import.meta.env.VITE_SIGNS_ENDPOINT_PATH;
const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT_PATH;
const incidentsEndpointPath = import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH;
const locationsEndpointPath = import.meta.env.VITE_LOCATIONS_ENDPOINT_PATH;
const touristEndpointPath = import.meta.env.VITE_TOURISTS_ENDPOINT_PATH;

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
    #alertsEndpoint;
    #incidentsEndpoint;
    #locationsEndpoint;
    #touristsEndpoint;
    

    /** Creates endpoint clients for signs and tourists resources. */
    constructor() {
        super();
        this.#signsEndpoint = new BaseEndpoint(this, signsEndpointPath);
        this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
        this.#incidentsEndpoint = new BaseEndpoint(this, incidentsEndpointPath);
        this.#locationsEndpoint = new BaseEndpoint(this, locationsEndpointPath);
        this.#touristsEndpoint = new BaseEndpoint(this, touristEndpointPath);
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

    getAlerts() {
        return this.#alertsEndpoint.getAll();
    }


    getAlertById(id) {
        return this.#alertsEndpoint.getById(id);
    }


    createAlert(resource) {
        return this.#alertsEndpoint.create(resource);
    }


    updateAlert(resource) {
        return this.#alertsEndpoint.update(resource.id, resource);
    }

    deleteAlert(id) {
        return this.#alertsEndpoint.delete(id);
    }

    
    
    getIncidents() {
        return this.#incidentsEndpoint.getAll();
    }


    getIncidentById(id) {
        return this.#incidentsEndpoint.getById(id);
    }


    createIncident(resource) {
        return this.#incidentsEndpoint.create(resource);
    }


    updateIncident(resource) {
        return this.#incidentsEndpoint.update(resource.id, resource);
    }

    deleteIncident(id) {
        return this.#incidentsEndpoint.delete(id);
    }



    getLocations() {
        return this.#locationsEndpoint.getAll();
    }


    getLocationById(id) {
        return this.#locationsEndpoint.getById(id);
    }


    createLocation(resource) {
        return this.#locationsEndpoint.create(resource);
    }


    updateLocation(resource) {
        return this.#locationsEndpoint.update(resource.id, resource);
    }

    deleteLocation(id) {
        return this.#locationsEndpoint.delete(id);
    }

    getTourists() {
        return this.#touristsEndpoint.getAll();
    }

    getTouristById(id) {
        return this.#touristsEndpoint.getById(id);
    }

    createTourist(resource) {
        return this.#touristsEndpoint.create(resource);
    }

    updateTourist(resource) {
        return this.#touristsEndpoint.update(resource.id, resource);
    }

    deleteTourist(id) {
        return this.#touristsEndpoint.delete(id);
    }
}