import {LoyaltyProfile} from "../domain/model/loyalty-profile.entity.js";
import {PointsTransaction} from "../domain/model/points-transaction.entity.js";
import {AwardedBadge} from "../domain/model/awarded-badge.entity.js";
import {Referral} from "../domain/model/referral.entity.js";

export class LoyaltyProfileAssembler {
    static toEntityFromResource(resource) {
        return new LoyaltyProfile({...resource});
    }
}

export class PointsTransactionAssembler {
    static toEntityFromResource(resource) {
        return new PointsTransaction({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}

export class AwardedBadgeAssembler {
    static toEntityFromResource(resource) {
        return new AwardedBadge({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}

export class ReferralAssembler {
    static toEntityFromResource(resource) {
        return new Referral({...resource});
    }
}
