import { Tour } from "../domain/model/tour.entity.js";

export class TourAssembler {

    static toEntityFromResource(resource) {
        return new Tour(
            resource.id,
            resource.agencyId,
            resource.title,
            resource.description,
            resource.difficulty,
            resource.status,
            resource.capacity,
            resource.checkpoints
        );
    }

    static toEntitiesFromResponse(response) {
        if (response.status < 200 || response.status >= 400) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        const resources = response.data instanceof Array
            ? response.data
            : [response.data];

        return resources.map(resource => {
            const tour = this.toEntityFromResource(resource);
            tour.guide = resource.guide ?? resource.guideName ?? null;
            tour.assignedTourists = resource.assignedTourists ?? [];
            return tour;
        });
    }
}