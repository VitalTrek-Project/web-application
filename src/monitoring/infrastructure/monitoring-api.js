import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const signsEndpointPath = import.meta.env.VITE_SIGNS_ENDPOINT_PATH || "/vital-sign-readings";
const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT_PATH || "/alerts";
const incidentsEndpointPath = import.meta.env.VITE_INCIDENTS_ENDPOINT_PATH || "/incidents";
const locationsEndpointPath = import.meta.env.VITE_LOCATIONS_ENDPOINT_PATH || "/location-readings";
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH || "/users";
const expeditionsEndpointPath = import.meta.env.VITE_EXPEDITIONS_ENDPOINT_PATH || "/expeditions";

/**
 * Infrastructure adapter for Monitoring HTTP endpoints against VitalTrek Platform.
 *
 * @class MonitoringApi
 * @extends BaseApi
 */
export class MonitoringApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #signsEndpoint;
    /** @type {BaseEndpoint} */
    #alertsEndpoint;
    /** @type {BaseEndpoint} */
    #incidentsEndpoint;
    /** @type {BaseEndpoint} */
    #locationsEndpoint;
    /** @type {BaseEndpoint} */
    #usersEndpoint;

    constructor() {
        super();
        this.#signsEndpoint = new BaseEndpoint(this, signsEndpointPath);
        this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
        this.#incidentsEndpoint = new BaseEndpoint(this, incidentsEndpointPath);
        this.#locationsEndpoint = new BaseEndpoint(this, locationsEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Vital-sign readings for an expedition (platform query contract).
     * @param {number|string} expeditionId
     */
    getSignsByExpedition(expeditionId) {
        return this.http.get(`${expeditionsEndpointPath}/${expeditionId}/vital-sign-readings`);
    }

    createSign(resource) {
        return this.#signsEndpoint.create(resource);
    }

    /**
     * Active alerts for an expedition.
     * @param {number|string} expeditionId
     */
    getAlertsByExpedition(expeditionId) {
        return this.http.get(`${expeditionsEndpointPath}/${expeditionId}/alerts`);
    }

    createAlert(resource) {
        return this.#alertsEndpoint.create(resource);
    }

    acknowledgeAlert(alertId, userId) {
        return this.http.patch(`${alertsEndpointPath}/${alertId}`, {status: "ACKNOWLEDGED", userId});
    }

    dismissAlert(alertId) {
        return this.http.patch(`${alertsEndpointPath}/${alertId}`, {status: "DISMISSED"});
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

    /**
     * Location readings for an expedition.
     * @param {number|string} expeditionId
     */
    getLocationsByExpedition(expeditionId) {
        return this.http.get(`${expeditionsEndpointPath}/${expeditionId}/location-readings`);
    }

    createLocation(resource) {
        return this.#locationsEndpoint.create(resource);
    }

    /**
     * Platform users used as tourist directory (role filtered in the store).
     */
    getUsers() {
        return this.#usersEndpoint.getAll();
    }
}
