import {BadgeDefinition} from "../domain/model/badge-definition.entity.js";

export class BadgeDefinitionAssembler {
    static toEntityFromResource(resource) {
        return new BadgeDefinition({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
