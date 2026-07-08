/**
 * User entity in the IAM bounded context.
 *
 * @class User
 */
export class User {
    /**
     * @param {Object} params - Entity attributes.
     * @param {string} params.id - Unique user identifier (Guid).
     * @param {string} params.username - Public username.
     * @param {string} params.role - Role of the user: 'Tourist' or 'Agency'.
     * @param {string|null} [params.agencyId] - Agency identifier, present only for Agency-role users.
     */
    constructor({id, username, role, agencyId = null}) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.agencyId = agencyId;
    }
}
