import {LoyaltyProgram} from "../domain/model/loyalty-program.entity.js";
import {LoyaltyTier} from "../domain/model/loyalty-tier.entity.js";

export class LoyaltyProgramAssembler {
    static toEntityFromResource(resource) {
        return new LoyaltyProgram({...resource});
    }
}

export class LoyaltyTierAssembler {
    static toEntityFromResource(resource) {
        return new LoyaltyTier({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
