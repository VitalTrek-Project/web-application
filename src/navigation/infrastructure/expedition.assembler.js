import { Expedition } from '../domain/model/expedition.entity.js';

export class ExpeditionAssembler {
    static toEntityFromResource(resource) {
        return new Expedition(
            resource.id,
            resource.tourId,
            resource.guideId,
            resource.status,
            resource.startedAt,
            resource.finishedAt
        );
    }

    static toEntitiesFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : [response.data];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }
}
