export class TouristExperience {
    constructor(id, expeditionId, touristId, note, mediaUrl, createdAt) {
        this.id = id;
        this.expeditionId = expeditionId;
        this.touristId = touristId;
        this.note = note;
        this.mediaUrl = mediaUrl;
        this.createdAt = createdAt;
    }
}
