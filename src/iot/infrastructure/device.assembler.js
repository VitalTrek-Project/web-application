import { IoTDevice } from "../domain/model/iot-device.entity.js";
import { extractResourceList } from "./iot-resource.util.js";

export class DeviceAssembler {
  static toEntityFromResource(resource) {
    return new IoTDevice(
      resource.id,
      resource.name,
      resource.type,
      resource.status,
      resource.lastSeen,
      resource.expeditionId ?? null,
      resource.touristId ?? null
    );
  }

  static toEntitiesFromResponse(response) {
    return extractResourceList(response, "devices").map((resource) =>
      this.toEntityFromResource(resource)
    );
  }
}
