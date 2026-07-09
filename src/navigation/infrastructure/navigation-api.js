import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const expeditionsEndpointPath = import.meta.env.VITE_EXPEDITIONS_ENDPOINT_PATH || '/expeditions';
const experiencesEndpointPath = import.meta.env.VITE_EXPERIENCES_ENDPOINT_PATH || '/experiences';
const weatherEndpointPath = import.meta.env.VITE_WEATHER_ENDPOINT_PATH || '/weather';
const progressEndpointPath = import.meta.env.VITE_PROGRESS_ENDPOINT_PATH || '/progress';
const binnacleEndpointPath = import.meta.env.VITE_BINNACLE_ENDPOINT_PATH || '/binnacle-readings';
const toursEndpointPath = import.meta.env.VITE_TOUR_ENDPOINT_PATH || '/tours';

/**
 * Infrastructure adapter for Navigation & Exploration against VitalTrek Platform.
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
    /** @type {BaseEndpoint} */
    #progressEndpoint;

    constructor() {
        super();
        this.#expeditionsEndpoint = new BaseEndpoint(this, expeditionsEndpointPath);
        this.#experiencesEndpoint = new BaseEndpoint(this, experiencesEndpointPath);
        this.#weatherEndpoint = new BaseEndpoint(this, weatherEndpointPath);
        this.#progressEndpoint = new BaseEndpoint(this, progressEndpointPath);
    }

    getExpeditions() {
        return this.#expeditionsEndpoint.getAll();
    }

    getExpedition(id) {
        return this.#expeditionsEndpoint.getById(id);
    }

    /**
     * Creates an expedition using CreateExpeditionResource field names.
     * @param {{tourId: number|string, guideId?: number|string, expeditionName?: string, status?: string}} payload
     */
    startExpedition({tourId, guideId = 0, expeditionName = null, status = 'in_progress'}) {
        return this.#expeditionsEndpoint.create({
            tourID: Number(tourId),
            guideID: Number(guideId),
            expeditionName,
            status
        });
    }

    /**
     * Platform CreateExpeditionResource also covers status transitions via new records;
     * when a dedicated finish route is unavailable, recreate with finished status is not ideal,
     * so this posts progress at 100% and returns the latest expedition read.
     */
    finishExpedition(id, {tourId, guideId, expeditionName} = {}) {
        return this.#expeditionsEndpoint.create({
            tourID: Number(tourId ?? 0),
            guideID: Number(guideId ?? 0),
            expeditionName: expeditionName ?? null,
            status: 'finished'
        }).then(() => this.getExpedition(id));
    }

    getExperiences() {
        return this.#experiencesEndpoint.getAll();
    }

    /**
     * @param {Object} resource - CreateExperienceResource
     */
    createExperience(resource) {
        return this.#experiencesEndpoint.create({
            expeditionID: Number(resource.expeditionId ?? resource.expeditionID),
            touristID: Number(resource.touristId ?? resource.touristID),
            note: resource.note ?? null,
            mediaUrl: resource.mediaUrl ?? null
        });
    }

    getWeatherById(weatherId) {
        return this.#weatherEndpoint.getById(weatherId);
    }

    getWeather() {
        return this.#weatherEndpoint.getAll();
    }

    createWeather(resource) {
        return this.#weatherEndpoint.create(resource);
    }

    getProgress(progressId) {
        return this.#progressEndpoint.getById(progressId);
    }

    createProgress(resource) {
        return this.#progressEndpoint.create({
            expeditionId: Number(resource.expeditionId),
            completedCheckpoints: Number(resource.completedCheckpoints ?? 0),
            totalCheckpoints: Number(resource.totalCheckpoints ?? 0),
            percentage: Number(resource.percentage ?? 0)
        });
    }

    getBinnacleByExpedition(expeditionId) {
        return this.http.get(`${expeditionsEndpointPath}/${expeditionId}/binnacle-readings`);
    }

    recordBinnacleReading(resource) {
        return this.http.post(binnacleEndpointPath, {
            expeditionId: Number(resource.expeditionId),
            touristId: Number(resource.touristId),
            note: resource.note ?? null,
            mediaUrl: resource.mediaUrl ?? null,
            createdAt: resource.createdAt ?? new Date().toISOString()
        });
    }

    /**
     * Loads a tour so UI can reuse any embedded checkpoints/waypoints if the platform returns them.
     * There is no standalone /checkpoints resource.
     */
    getTourById(tourId) {
        return this.http.get(`${toursEndpointPath}/${tourId}`);
    }
}
