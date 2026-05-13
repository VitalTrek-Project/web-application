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

        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }

        const resources =
            response.data instanceof Array
                ? response.data
                : [response.data];

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }
}