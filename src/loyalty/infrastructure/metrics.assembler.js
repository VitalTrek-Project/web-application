import {LoyaltyMetrics} from "../domain/model/loyalty-metrics.entity.js";

export class LoyaltyMetricsAssembler {
    static toEntityFromResource(resource) {
        return new LoyaltyMetrics({...resource});
    }
}
