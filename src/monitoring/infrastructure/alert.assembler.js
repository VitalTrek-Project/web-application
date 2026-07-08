import {Alert} from "../domain/model/alert.entity.js";

/**
 * Maps monitoring alert resources into domain entities.
 *
 * @class AlertAssembler
 */
export class AlertAssembler {


    static toEntityFromResource(resource) {
        return new Alert({...resource});
    }

    /**
     * Parses alert resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{categories:Array<{id: number|string, name: string}>}>} response - HTTP response with alert resources.
     * @returns {Alert[]} Alert entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : (response.data?.alerts ?? [response.data]).filter(Boolean);

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}