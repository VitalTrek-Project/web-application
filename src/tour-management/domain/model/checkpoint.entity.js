export class Checkpoint {
    constructor(order, name, latitude, longitude, bluetoothBeaconId) {
        this.order = order;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.bluetoothBeaconId = bluetoothBeaconId;
    }
}