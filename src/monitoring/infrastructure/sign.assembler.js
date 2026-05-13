import {Sign} from "../domain/model/sign.entity.js";

/**
 * Maps Publishing sign resources into domain entities.
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
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['vital-sign-readings'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}