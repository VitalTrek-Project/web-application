import { Weather } from "../domain/model/weather.entity.js";

export class WeatherAssembler {
  static toEntityFromResource(resource) {
    if (!resource) return null;
    return new Weather(
      resource.temperatureCelsius,
      resource.condition,
      resource.humidity,
      resource.windSpeedKmh,
      resource.location ?? null
    );
  }
}
