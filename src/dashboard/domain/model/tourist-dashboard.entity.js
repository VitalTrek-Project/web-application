import {TouristExpedition} from "./tourist-expedition.entity.js";

export class TouristDashboard {
    constructor({currentExpedition = null, activeAlerts = [], historicalAlerts = [], pastExpeditions = []}) {
        this.currentExpedition = currentExpedition ? new TouristExpedition(currentExpedition) : null;
        this.activeAlerts = activeAlerts ?? [];
        this.historicalAlerts = historicalAlerts ?? [];
        this.pastExpeditions = (pastExpeditions ?? []).map(expedition => new TouristExpedition(expedition));
    }
}
