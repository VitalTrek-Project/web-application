import {AdminDashboardSummary} from "../domain/model/admin-dashboard-summary.entity.js";

export class AdminDashboardSummaryAssembler {
    static toEntityFromResource(resource) {
        return new AdminDashboardSummary({...resource});
    }
}
