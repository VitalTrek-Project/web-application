import {TouristPreferences} from "../domain/model/tourist-preferences.entity.js";

export class TouristPreferencesAssembler {
    static toEntityFromResource(resource) {
        return new TouristPreferences({...resource});
    }
}
