/**
 * IoT device linked to an expedition or tourist.
 */
export class IoTDevice {
  constructor(id, name, type, status, lastSeen, expeditionId = null, touristId = null) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
    this.lastSeen = lastSeen;
    this.expeditionId = expeditionId;
    this.touristId = touristId;
  }
}
