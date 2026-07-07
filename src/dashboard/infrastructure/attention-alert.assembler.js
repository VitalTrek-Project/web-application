import {Alert} from "../../monitoring/domain/model/alert.entity.js";

/**
 * Attention alerts share the same shape as Monitoring's Alert entity
 * (id, touristId, expeditionId, type, severity, message, raisedAt) — reused here
 * instead of duplicating a near-identical entity.
 */
export class AttentionAlertAssembler {
    static toEntityFromResource(resource) {
        return new Alert({...resource, status: 'ACTIVE'});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['alerts'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
