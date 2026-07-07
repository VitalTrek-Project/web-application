import {ActiveExpedition} from "../domain/model/active-expedition.entity.js";

export class ActiveExpeditionAssembler {
    static toEntityFromResource(resource) {
        return new ActiveExpedition({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status} - ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['activeExpeditions'];
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
