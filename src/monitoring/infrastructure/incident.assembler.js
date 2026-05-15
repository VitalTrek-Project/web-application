import {Incident} from "../domain/model/incident.entity.js";

/**
 * Maps Monitoring incident resources into domain entities.
 *
 * @class IncidentAssembler
 */
export class IncidentAssembler {


    static toEntityFromResource(resource) {
        return new Incident({...resource});
    }

    /**
     * Parses incident resources from a response and maps them into entities.
     *
     * @param {import('axios').AxiosResponse<Array<{id: number|string, name: string}>|{categories:Array<{id: number|string, name: string}>}>} response - HTTP response with incident resources.
     * @returns {Incident[]} Incident entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['incidents'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}