/**
 * An emergency contact for a tourist profile.
 *
 * @class EmergencyContact
 */
export class EmergencyContact {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.name
     * @param {string} params.relationship
     * @param {string} params.phoneNumber
     */
    constructor({id, name, relationship, phoneNumber}) {
        this.id = id;
        this.name = name;
        this.relationship = relationship;
        this.phoneNumber = phoneNumber;
    }
}
