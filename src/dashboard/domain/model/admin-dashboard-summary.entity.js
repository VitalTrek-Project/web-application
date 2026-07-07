import {Kpi} from "./kpi.entity.js";

export class AdminDashboardSummary {
    constructor({
        expeditionsActive = {},
        expeditionsCompleted = {},
        alertsOpen = {},
        alertsOpenBySeverity = {},
        touristsActive = {},
        staffAssigned = {}
    }) {
        this.expeditionsActive = new Kpi(expeditionsActive ?? {});
        this.expeditionsCompleted = new Kpi(expeditionsCompleted ?? {});
        this.alertsOpen = new Kpi(alertsOpen ?? {});
        this.alertsOpenBySeverity = alertsOpenBySeverity ?? {};
        this.touristsActive = new Kpi(touristsActive ?? {});
        this.staffAssigned = new Kpi(staffAssigned ?? {});
    }
}
