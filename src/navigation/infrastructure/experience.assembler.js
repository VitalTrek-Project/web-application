import { TouristExperience } from '../domain/model/experience.entity.js';

export class ExperienceAssembler {
    static toEntityFromResource(resource) {
        return new TouristExperience(
            resource.id,
            resource.expeditionId,
            resource.touristId,
            resource.note,
            resource.mediaUrl,
            resource.createdAt
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

        return resources.map(resource =>
            this.toEntityFromResource(resource)
        );
    }
}
