import { Expedition } from '../domain/model/expedition.entity.js';

export class ExpeditionAssembler {
    static toEntityFromResource(resource) {
        return new Expedition(
            resource.id,
            resource.tourID ?? resource.tourId,
            resource.guideID ?? resource.guideId,
            resource.status,
            resource.startedAt ?? null,
            resource.finishedAt ?? null
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
