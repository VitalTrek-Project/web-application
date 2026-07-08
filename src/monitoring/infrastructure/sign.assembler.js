import {Sign} from "../domain/model/sign.entity.js";

/**
 * Maps Monitoring sign resources into domain entities.
 *
 * @class SignAssembler
 */
export class SignAssembler {


    static toEntityFromResource(resource) {
        return new Sign({...resource});
    }

    /**
     * Parses sign resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{categories:Array<{id: number|string, name: string}>}>} response - HTTP response with sign resources.
     * @returns {Sign[]} Sign entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : (response.data?.['vital-sign-readings'] ?? [response.data]).filter(Boolean);

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}