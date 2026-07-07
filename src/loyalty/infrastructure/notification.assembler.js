import {LoyaltyNotification} from "../domain/model/notification.entity.js";

export class NotificationAssembler {
    static toEntityFromResource(resource) {
        return new LoyaltyNotification({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
