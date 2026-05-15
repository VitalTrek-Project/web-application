import {Tourist} from "../domain/model/tourist.entity.js";

/**
 * Maps Monitoring tourist resources into domain entities.
 *
 * @class TouristAssembler
 */
export class TouristAssembler {


    static toEntityFromResource(resource) {
        return new Tourist({...resource});
    }

    /**
     * Parses tourist resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{categories:Array<{id: number|string, name: string}>}>} response - HTTP response with tourist resources.
     * @returns {Tourist[]} Tourist entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['tourists'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}