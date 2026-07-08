/**
 * One audit entry of an agency staff member reading a tourist's medical/emergency data.
 *
 * @class MedicalAccessLogEntry
 */
export class MedicalAccessLogEntry {
    /**
     * @param {Object} params
     * @param {string} params.id
     * @param {string} params.accessedByStaffUserId
     * @param {string} params.accessedAt
     */
    constructor({id, accessedByStaffUserId, accessedAt}) {
        this.id = id;
        this.accessedByStaffUserId = accessedByStaffUserId;
        this.accessedAt = accessedAt;
    }
}
