import {StaffProfile} from "../domain/model/staff-profile.entity.js";
import {StaffPreferences} from "../domain/model/staff-preferences.entity.js";

export class StaffProfileAssembler {
    static toEntityFromResource(resource) {
        return new StaffProfile({...resource});
    }
}

export class StaffPreferencesAssembler {
    static toEntityFromResource(resource) {
        return new StaffPreferences({...resource});
    }
}
