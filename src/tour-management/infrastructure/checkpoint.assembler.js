import { Checkpoint } from "../domain/model/checkpoint.entity.js";

export class CheckpointAssembler {

    static toEntityFromResource(resource) {
        return new Checkpoint(
            resource.order,
            resource.name,
            resource.latitude,
            resource.longitude,
            resource.bluetoothBeaconId
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