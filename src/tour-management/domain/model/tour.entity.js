export class Tour {
    constructor(id, agencyId, title, description, difficulty, status, capacity, checkpoints = []) {
        this.id = id;
        this.agencyId = agencyId;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.status = status;
        this.capacity = capacity;
        this.checkpoints = checkpoints;
    }
}