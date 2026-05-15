export class Progress {
    constructor(completedCheckpoints, totalCheckpoints, percentage) {
        this.completedCheckpoints = completedCheckpoints;
        this.totalCheckpoints = totalCheckpoints;
        this.percentage = percentage;
    }
}
