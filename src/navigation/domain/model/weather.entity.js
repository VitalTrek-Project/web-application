export class Weather {
    constructor(temperatureCelsius, condition, humidity, windSpeedKmh, location = null) {
        this.temperatureCelsius = temperatureCelsius;
        this.condition = condition;
        this.humidity = humidity;
        this.windSpeedKmh = windSpeedKmh;
        this.location = location;
    }
}
