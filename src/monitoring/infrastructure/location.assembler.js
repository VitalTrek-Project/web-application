import {Location} from "../domain/model/location.entity.js";

/**
 * Maps Monitoring location resources into domain entities.
 *
 * @class LocationAssembler
 */
export class LocationAssembler {


    static toEntityFromResource(resource) {
        return new Location({...resource});
    }

    /**
     * Parses location resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{categories:Array<{id: number|string, name: string}>}>} response - HTTP response with location resources.
     * @returns {Location[]} Location entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['locations'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}