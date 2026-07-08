import {User} from "../domain/user.entity.js";

/**
 * Maps IAM infrastructure resources into domain entities.
 *
 * @class UserAssembler
 */
export class UserAssembler {
    /**
     * Maps one user resource into a User entity.
     * @param {{id: number|string, username: string}} resource - User resource payload.
     * @returns {User} User entity.
     */
    static toEntityFromResource(resource) {
        return new User({...resource});
    }
    
    /**
     * @param {import('axios').AxiosResponse<Array<{id: number|string, username: string}>|{users:Array<{id: number|string, username: string}>}>} response - HTTP response containing user resources.
     * @returns {User[]} Collection of user entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        const resources = response.data instanceof Array
            ? response.data
            : (response.data?.users ?? [response.data]).filter(Boolean);

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}