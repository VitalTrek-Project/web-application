import {Reward} from "../domain/model/reward.entity.js";

export class RewardAssembler {
    static toEntityFromResource(resource) {
        return new Reward({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
