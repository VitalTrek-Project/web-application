import {Subscription} from "../domain/model/subscription.entity.js";

/**
 * Maps subscription API resources into domain entities.
 */
export class SubscriptionAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Subscription({
            id: resource.id,
            plan: resource.plan ?? null,
            status: resource.status ?? null,
            startDate: resource.startDate ?? null,
            endDate: resource.endDate ?? null
        });
    }

    static toEntityFromResponse(response) {
        if (response.status < 200 || response.status >= 300) {
            console.error(`${response.status}, ${response.statusText}`);
            return null;
        }
        return this.toEntityFromResource(response.data);
    }
}
