import {Redemption} from "../domain/model/redemption.entity.js";

export class RedemptionAssembler {
    static toEntityFromResource(resource) {
        return new Redemption({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
