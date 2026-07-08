import {TouristProfile} from "../domain/model/tourist-profile.entity.js";
import {ProfileCompleteness} from "../domain/model/profile-completeness.entity.js";
import {MedicalAccessLogEntry} from "../domain/model/medical-access-log-entry.entity.js";

export class TouristProfileAssembler {
    static toEntityFromResource(resource) {
        return new TouristProfile({...resource});
    }
}

export class ProfileCompletenessAssembler {
    static toEntityFromResource(resource) {
        return new ProfileCompleteness({...resource});
    }
}

export class MedicalAccessLogEntryAssembler {
    static toEntityFromResource(resource) {
        return new MedicalAccessLogEntry({...resource});
    }

    static toEntitiesFromResponse(response) {
        if (response.status !== 200) return [];
        return response.data.map(resource => this.toEntityFromResource(resource));
    }
}
