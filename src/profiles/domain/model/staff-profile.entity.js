/**
 * An agency staff member's own profile.
 *
 * @class StaffProfile
 */
export class StaffProfile {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.userId
     * @param {string} params.agencyId
     * @param {string} params.fullName
     * @param {string|null} [params.photoUrl]
     * @param {string|null} [params.position]
     * @param {string|null} [params.contactPhone]
     */
    constructor({id, userId, agencyId, fullName, photoUrl = null, position = null, contactPhone = null}) {
        this.id = id;
        this.userId = userId;
        this.agencyId = agencyId;
        this.fullName = fullName;
        this.photoUrl = photoUrl;
        this.position = position;
        this.contactPhone = contactPhone;
    }
}
