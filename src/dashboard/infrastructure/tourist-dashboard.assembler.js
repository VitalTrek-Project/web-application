import {TouristDashboard} from "../domain/model/tourist-dashboard.entity.js";

export class TouristDashboardAssembler {
    static toEntityFromResource(resource) {
        return new TouristDashboard({...resource});
    }
}
