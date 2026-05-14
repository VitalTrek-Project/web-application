export class Expedition {
    constructor(id, tourId, guideId, status, startedAt, finishedAt) {
        this.id = id;
        this.tourId = tourId;
        this.guideId = guideId;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }
}
