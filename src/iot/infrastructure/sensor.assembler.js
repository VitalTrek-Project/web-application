import { SensorReading } from "../domain/model/sensor-reading.entity.js";
import { extractResourceList } from "./iot-resource.util.js";

export class SensorAssembler {
  static toEntityFromResource(resource) {
    return new SensorReading(
      resource.id,
      resource.deviceId,
      resource.type,
      resource.value,
      resource.recordedAt,
      resource.unit ?? null
    );
  }

  static toEntitiesFromResponse(response) {
    return extractResourceList(response, "sensor-readings").map((resource) =>
      this.toEntityFromResource(resource)
    );
  }
}
